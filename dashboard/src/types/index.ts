export type Role = 'investigator' | 'supervisor' | 'admin';
export type Language = 'en' | 'kn';

export type ViewType = 
  | 'overview' 
  | 'map' 
  | 'network' 
  | 'timelines' 
  | 'search' 
  | 'audit' 
  | 'copilot';

export type CrimeSeverity = 'low' | 'medium' | 'high' | 'critical';
export type CaseStatus = 'open' | 'under_investigation' | 'charge_sheeted' | 'resolved' | 'archived';

export interface FIRRecord {
  caseId: string;
  title: string;
  station: string;
  district: string;
  crimeType: string;
  dateTime: string;
  lat: number;
  lng: number;
  status: CaseStatus;
  severity: CrimeSeverity;
  riskScore: number; // 0-100
  summary: string;
  victims: string[];
  witnesses: string[];
  evidence: string[];
  suspects: string[];
  vehiclesInvolved: string[];
  moTags: string[];
}

export type EntityType = 'person' | 'case' | 'vehicle' | 'location' | 'organization' | 'weapon';

export interface GraphEntity {
  id: string;
  type: EntityType;
  label: string;
  sublabel?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  attributes: Record<string, string | number | boolean>;
}

export interface GraphRelationship {
  id: string;
  source: string;
  target: string;
  type: string; // e.g. 'owns', 'associated_with', 'witnessed', 'linked_by_mo'
  confidence: number; // 0-100
  evidenced: boolean; // true = solid direct evidence, false = inferred MO similarity
  description?: string;
}

export interface HotspotZone {
  zoneId: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  radius: number; // meters
  density: number; // incidents per sq km
  type: 'confirmed' | 'predicted';
  confidence: number; // 0-100 for predicted
  predictedTrend?: 'increasing' | 'stable' | 'decreasing';
  crimeTypeBreakdown: Record<string, number>;
  activeCasesCount: number;
  boundaryCoordinates?: Array<[number, number]>;
}

export interface AuditLogEntry {
  logId: string;
  user: string;
  role: Role;
  userRank: string;
  query: string;
  toolInvoked: string; // e.g., 'Analytics Agent', 'Case Intelligence Agent', 'NL2SQL', 'NL2Cypher', 'RAG Engine'
  timestamp: string;
  confidence: number;
  recordsTouched: string[];
  reasoningSteps: string[];
  executionTimeMs: number;
}

export interface AIInsight {
  insightId: string;
  title: string;
  text: string;
  confidence: number; // 0-100
  sourceIds: string[];
  agent: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
  reasoningSteps: string[];
}

export interface ExplainabilityData {
  conclusion: string;
  confidence: number;
  reasoningSteps: string[];
  evidenceSources: { id: string; label: string; type: string }[];
  agentAttribution: {
    name: string;
    type: string;
    version: string;
    latencyMs: number;
  };
}

export interface SampleQuery {
  id: string;
  queryEn: string;
  queryKn: string;
  responseEn: string;
  responseKn: string;
  confidence: number;
  sourceIds: string[];
  targetView?: ViewType;
  filterParams?: Record<string, string>;
  reasoningSteps: string[];
}
