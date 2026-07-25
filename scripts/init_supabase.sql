-- ==========================================================
-- ARGUS Intelligence Platform - Supabase PostgreSQL Schema
-- ==========================================================

-- Enable pgvector extension for vector search
CREATE EXTENSION IF NOT EXISTS vector;

-- FIRs (First Information Reports) Table
CREATE TABLE IF NOT EXISTS firs (
    id VARCHAR(50) PRIMARY KEY,
    station TEXT NOT NULL,
    offense TEXT NOT NULL,
    incident_date TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    location TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    vector_embedding vector(4)
);

-- Victims Table
CREATE TABLE IF NOT EXISTS victims (
    id VARCHAR(50) PRIMARY KEY,
    fir_id VARCHAR(50) REFERENCES firs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    age INT,
    statement TEXT
);

-- Witnesses Table
CREATE TABLE IF NOT EXISTS witnesses (
    id VARCHAR(50) PRIMARY KEY,
    fir_id VARCHAR(50) REFERENCES firs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    contact VARCHAR(50),
    testimony TEXT
);

-- Evidence Table
CREATE TABLE IF NOT EXISTS evidence (
    id VARCHAR(50) PRIMARY KEY,
    fir_id VARCHAR(50) REFERENCES firs(id) ON DELETE CASCADE,
    type VARCHAR(100),
    description TEXT
);

-- Audit Logs Table (Immutable Append-Only Audit Store)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(100) NOT NULL,
    role VARCHAR(50) NOT NULL,
    action VARCHAR(100) NOT NULL,
    tool_name VARCHAR(100) NOT NULL,
    query_params JSONB,
    explanation TEXT,
    compliance_passed BOOLEAN DEFAULT TRUE
);

-- Initial Seed Data Insertion
INSERT INTO firs (id, station, offense, incident_date, status, description, location, lat, lng, vector_embedding)
VALUES
('FIR-2026-001', 'Central Police Station, Bengaluru', 'Cyber Fraud & Money Laundering', '2026-06-12 14:30:00', 'Under Investigation', 'Unidentified suspects used phishing links to drain INR 45 Lakhs from victims. Linked to vehicle KA-01-MJ-9921.', 'MG Road, Bengaluru', 12.9716, 77.5946, '[0.12, 0.45, -0.23, 0.89]'),
('FIR-2026-002', 'Indiranagar Station, Bengaluru', 'Vehicle Theft & Armed Robbery', '2026-07-01 22:15:00', 'Active Lead', 'Armed suspects robbed a jewelry store on 100ft road and fled in suspect car KA-03-HA-4412.', 'Indiranagar 100ft Road', 12.9784, 77.6408, '[0.88, -0.12, 0.67, 0.05]'),
('FIR-2026-003', 'Koramangala Police Station', 'Financial ATM Skimming', '2026-07-15 03:00:00', 'Under Investigation', 'Skimming devices found at 3 major bank ATMs in 5th Block Koramangala. Suspect identified on CCTV.', 'Koramangala 5th Block', 12.9347, 77.6244, '[0.05, 0.62, -0.41, 0.77]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO victims (id, fir_id, name, age, statement)
VALUES
('VIC-101', 'FIR-2026-001', 'Rajesh Kumar', 42, 'Received SMS with fake banking verification link.'),
('VIC-102', 'FIR-2026-002', 'Priya Sharma', 31, 'Two masked men threatened staff with handguns.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO witnesses (id, fir_id, name, contact, testimony)
VALUES
('WIT-501', 'FIR-2026-002', 'Suresh Gowda', '+91-9876543210', 'Saw black sedan driving towards Domlur with license plate KA-03-HA-4412.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO evidence (id, fir_id, type, description)
VALUES
('EVI-901', 'FIR-2026-001', 'Digital', 'Server IP logs mapping to proxy subnet 192.168.4.12.'),
('EVI-902', 'FIR-2026-002', 'CCTV Footage', 'High-def recording of robbers fleeing scene.')
ON CONFLICT (id) DO NOTHING;
