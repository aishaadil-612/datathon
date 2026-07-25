import { AuditLogEntry } from '../types';

export const mockAuditLogs: AuditLogEntry[] = [
  {
    logId: "AUD-2026-9041",
    user: "Inspector S. Patil",
    userRank: "Inspector of Police (Whitefield Station)",
    role: "investigator",
    query: "Identify all commercial burglary FIRs sharing vehicle registration KA-03-MN-4921 in Eastern Subdivision",
    toolInvoked: "Case Intelligence Agent (NL2Cypher)",
    timestamp: "2026-07-23 02:45:12",
    confidence: 94,
    recordsTouched: ["FIR-2026-0489", "FIR-2026-0512", "FIR-2026-0534", "FIR-2026-0560", "Vehicle: KA-03-MN-4921"],
    executionTimeMs: 420,
    reasoningSteps: [
      "1. Parsed natural language intent for vehicle plate match 'KA-03-MN-4921'.",
      "2. Generated Cypher query to traverse (Vehicle)-[:SPOTTED_AT|SPOTTED_NEAR]->(Case).",
      "3. Filtered nodes where crimeType IN ['Commercial Burglary', 'Armed Robbery', 'Warehouse Heist'].",
      "4. Aggregated 4 matching FIR entries spanning Whitefield, Indiranagar, Koramangala, Marathahalli.",
      "5. Verified RTO registration owner 'Suresh Gowda' against Neo4j entity graph."
    ]
  },
  {
    logId: "AUD-2026-9038",
    user: "ACP K. Ramachandra",
    userRank: "Assistant Commissioner of Police (East Zone)",
    role: "supervisor",
    query: "Generate 30-day temporal crime forecast model for Whitefield-Hoodi industrial corridor",
    toolInvoked: "Analytics Agent (ST-DBSCAN + XGBoost)",
    timestamp: "2026-07-22 21:14:05",
    confidence: 88,
    recordsTouched: ["Zone: Hoodi-ORR-Corridor", "FIR-2026-0489", "FIR-2026-0534", "Cell Tower Logs #882"],
    executionTimeMs: 650,
    reasoningSteps: [
      "1. Ingested 90-day spatio-temporal incident points across East Zone.",
      "2. Applied ST-DBSCAN spatial clustering to isolate night-time commercial break-in vectors.",
      "3. Evaluated feature matrix against trained XGBoost temporal decay model.",
      "4. Identified Hoodi ORR transit corridor as 88% probability zone for next 30-day incident surge.",
      "5. Generated recommended patrol route matrix for Whitefield patrol units."
    ]
  },
  {
    logId: "AUD-2026-9025",
    user: "Inspector S. Patil",
    userRank: "Inspector of Police (Whitefield Station)",
    role: "investigator",
    query: "Find shortest connecting path between Rajesh Kumar (Alias Raja) and Cash Van Robbery FIR-2026-0560",
    toolInvoked: "Case Intelligence Agent (Neo4j Pathfinding)",
    timestamp: "2026-07-22 18:30:40",
    confidence: 98,
    recordsTouched: ["Person: p1 (Rajesh Kumar)", "Case: c4 (FIR-2026-0560)", "Weapon: w1 (DeWalt Grinder)", "Vehicle: v1"],
    executionTimeMs: 310,
    reasoningSteps: [
      "1. Initialized Dijkstra shortest path traversal from node p1 to node c4.",
      "2. Found 2-hop path: Person(Rajesh Kumar) -> [charged_in] -> Case(FIR-0560).",
      "3. Found 3-hop secondary path: Person(Rajesh Kumar) -> [operates] -> Vehicle(KA-03-MN-4921) -> [rammed_vehicle] -> Case(FIR-0560).",
      "4. Consolidated evidence weight to return 98% linkage confidence score."
    ]
  },
  {
    logId: "AUD-2026-9011",
    user: "System Administrator",
    userRank: "SCRB System Admin",
    role: "admin",
    query: "Audit user access permissions and vector index rebalancing status",
    toolInvoked: "Governance & Audit Agent (System Health)",
    timestamp: "2026-07-22 14:00:00",
    confidence: 100,
    recordsTouched: ["User Table", "Audit Ledger Root", "pgvector Index #04"],
    executionTimeMs: 180,
    reasoningSteps: [
      "1. Verified cryptographic SHA-256 hash tree for append-only audit ledger.",
      "2. Validated 100% integrity across 9,041 transaction blocks.",
      "3. Evaluated pgvector HNSW index recall rate (99.4%)."
    ]
  }
];
