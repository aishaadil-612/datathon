const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dashboardDir = path.resolve(__dirname, '..');
const distDir = path.join(dashboardDir, 'dist');
const clientPackageSrc = path.join(dashboardDir, 'client-package.json');
const clientPackageDst = path.join(distDir, 'client-package.json');
const zipFile = path.join(dashboardDir, 'argus-crimelens-catalyst.zip');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run "npm run build" first.');
  process.exit(1);
}

// 1. Copy client-package.json into dist/
if (fs.existsSync(clientPackageSrc)) {
  fs.copyFileSync(clientPackageSrc, clientPackageDst);
  console.log('✔ Copied client-package.json into dist/');
} else {
  console.error('Error: client-package.json not found in dashboard directory.');
  process.exit(1);
}

// 2. Remove existing ZIP if present
if (fs.existsSync(zipFile)) {
  fs.unlinkSync(zipFile);
}

// 3. Compress dist directory contents ensuring ALL entry paths use forward slashes "/" (Catalyst compatible)
try {
  if (process.platform === 'win32') {
    // PowerShell .NET ZipArchive explicit entry creation with forward-slash normalization
    const psScript = `
$distDir = '${distDir.replace(/'/g, "''")}';
$zipFile = '${zipFile.replace(/'/g, "''")}';
Add-Type -Assembly 'System.IO.Compression';
Add-Type -Assembly 'System.IO.Compression.FileSystem';
$zip = [System.IO.Compression.ZipFile]::Open($zipFile, [System.IO.Compression.ZipArchiveMode]::Create);
$files = Get-ChildItem -Path $distDir -Recurse | Where-Object { -not $_.PSIsContainer };
foreach ($file in $files) {
    $relPath = $file.FullName.Substring($distDir.Length + 1).Replace('\\', '/');
    [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $file.FullName, $relPath, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null;
}
$zip.Dispose();
`;
    execSync(`powershell -NoProfile -Command "${psScript.replace(/\n/g, ' ')}"`, { stdio: 'inherit' });
  } else {
    execSync(`cd "${distDir}" && zip -r "${zipFile}" .`, { stdio: 'inherit' });
  }
  console.log(`✔ Catalyst deployment package created successfully at: ${zipFile}`);
} catch (err) {
  console.error('Failed to create ZIP package:', err);
  process.exit(1);
}
