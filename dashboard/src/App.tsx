import React from 'react';
import { useDashboardStore } from './store/useDashboardStore';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { AlertTicker } from './components/layout/AlertTicker';
import { OverviewView } from './components/overview/OverviewView';
import { HotspotMapView } from './components/map/HotspotMapView';
import { CriminalNetworkView } from './components/network/CriminalNetworkView';
import { CaseTimelinesView } from './components/timelines/CaseTimelinesView';
import { CaseSearchRecordsView } from './components/search/CaseSearchRecordsView';
import { AuditGovernanceView } from './components/audit/AuditGovernanceView';
import { AIWorkspaceWidget } from './components/workspace/AIWorkspaceWidget';
import { ExplainabilityPanel } from './components/common/ExplainabilityPanel';
import { SyntheticWatermark } from './components/common/SyntheticWatermark';

export const App: React.FC = () => {
  const { activeView } = useDashboardStore();

  const renderCurrentView = () => {
    switch (activeView) {
      case 'overview':
        return <OverviewView />;
      case 'map':
        return <HotspotMapView />;
      case 'network':
        return <CriminalNetworkView />;
      case 'timelines':
        return <CaseTimelinesView />;
      case 'search':
        return <CaseSearchRecordsView />;
      case 'audit':
        return <AuditGovernanceView />;
      case 'copilot':
        return <AIWorkspaceWidget isFullView={true} />;
      default:
        return <OverviewView />;
    }
  };

  return (
    <div className="min-h-screen bg-command-bg flex flex-col font-sans select-none overflow-x-hidden">
      {/* Persistent Top Bar */}
      <TopBar />

      {/* Persistent Alert Ticker */}
      <AlertTicker />

      {/* Main Operational Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Persistent Left Sidebar */}
        <Sidebar />

        {/* Dynamic View Container */}
        <main className="flex-1 overflow-y-auto min-h-[calc(100vh-6rem)]">
          {renderCurrentView()}
        </main>
      </div>

      {/* Shared Explainability Drawer */}
      <ExplainabilityPanel />

      {/* Embedded Docked AI Workspace (Shown on all views except full copilot view) */}
      {activeView !== 'copilot' && <AIWorkspaceWidget isFullView={false} />}

      {/* Synthetic Demo Watermark */}
      <SyntheticWatermark />
    </div>
  );
};

export default App;
