import { FIRRecord, HotspotZone, GraphEntity, GraphRelationship } from '../types';

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthResponse {
  app: string;
  status: string;
  environment: string;
  governance_mode: string;
  postgres: string;
  neo4j: string;
}

export interface DashboardSummaryResponse {
  status: string;
  system_health: string;
  metrics: {
    total_firs: number;
    active_hotspots: number;
    graph_nodes: number;
    graph_relationships: number;
    total_audit_events: number;
  };
  hotspots: any[];
  graph_data: {
    nodes: any[];
    edges: any[];
  };
  case_timeline: any[];
  recent_firs: any[];
}

export interface FirIntakeResponse {
  status?: string;
  stage?: string;
  extraction?: {
    complainant: string;
    location: string;
    time: string;
    evidence: string;
    completeness: boolean;
  };
  bns_sections?: string[];
  ipc_sections?: string[];
  fraud_risk?: string;
  [key: string]: any;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE;
  }

  /**
   * Check backend health status
   */
  async checkHealth(): Promise<HealthResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/health`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Backend health check failed:', err);
      return null;
    }
  }

  /**
   * Fetch dashboard summary telemetry, hotspots, graph data, timeline events, and recent FIRs
   */
  async getDashboardSummary(): Promise<DashboardSummaryResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/dashboard/summary`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('Backend getDashboardSummary failed, using fallback metrics:', err);
      return null;
    }
  }

  /**
   * E-FIR Intake Assistant API Call
   */
  async firIntake(complaintText: string, channel: string = 'web_portal', aadhaarInput?: string): Promise<FirIntakeResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/fir/intake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'citizen_user_1',
          role: 'Investigator',
          complaint_text: complaintText,
          channel: channel,
          aadhaar_input: aadhaarInput
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('firIntake API error:', err);
      return null;
    }
  }

  /**
   * E-FIR Aadhaar OCR Verification API Call
   */
  async firVerifyAadhaar(complainantName: string, aadhaarInput: string): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/fir/verify-aadhaar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'citizen_user_1',
          role: 'Investigator',
          complainant_name: complainantName,
          aadhaar_input: aadhaarInput
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('firVerifyAadhaar API error:', err);
      return null;
    }
  }

  /**
   * E-FIR Draft Generation API Call
   */
  async firDraft(complaintText: string, policeStation: string = 'Central Police Station', aadhaarInput?: string): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/fir/draft`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'officer1',
          role: 'Investigator',
          complaint_text: complaintText,
          police_station: policeStation,
          aadhaar_input: aadhaarInput
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('firDraft API error:', err);
      return null;
    }
  }

  /**
   * E-FIR Authenticity & Fraud Verification API Call
   */
  async firVerifyAuthenticity(firDraft: any, options?: { otpVerified?: boolean; govtIdVerified?: boolean; gpsValidated?: boolean; aadhaarInput?: string }): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/fir/verify-authenticity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'officer1',
          role: 'Investigator',
          fir_draft: firDraft,
          otp_verified: options?.otpVerified ?? true,
          govt_id_verified: options?.govtIdVerified ?? true,
          gps_validated: options?.gpsValidated ?? true,
          aadhaar_input: options?.aadhaarInput
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('firVerifyAuthenticity API error:', err);
      return null;
    }
  }

  /**
   * E-FIR Official Registration & Approval API Call
   */
  async firApprove(draftId: string, badge: string = 'OFF-4029', notes: string = 'Verified complainant identity and evidence logs. Approved for FIR registration.'): Promise<any | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/fir/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'officer1',
          role: 'Supervisor',
          draft_id: draftId,
          police_officer_badge: badge,
          approval_notes: notes
        })
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn('firApprove API error:', err);
      return null;
    }
  }
}

export const apiService = new ApiService();
