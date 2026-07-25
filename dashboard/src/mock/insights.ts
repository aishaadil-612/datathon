import { AIInsight } from '../types';

export const mockInsights: AIInsight[] = [
  {
    insightId: "INS-01",
    title: "Cross-Case Vehicle Match Detected",
    text: "4 commercial break-in cases across Whitefield, Indiranagar, Koramangala & Marathahalli share a common silver SUV registration (KA-03-MN-4921). ANPR confidence score: 94%.",
    confidence: 94,
    sourceIds: ["FIR-2026-0489", "FIR-2026-0512", "FIR-2026-0534", "FIR-2026-0560", "v1"],
    agent: "Case Intelligence Agent (NL2Cypher)",
    timestamp: "12 mins ago",
    severity: "critical",
    reasoningSteps: [
      "1. Automated background crawler scanned newly filed FIR ANPR logs.",
      "2. Identified license plate KA-03-MN-4921 present within 15 minutes of occurrence at 4 crime locations.",
      "3. Cross-referenced RTO database: Vehicle owned by Suresh Gowda (Scrap dealer under surveillance).",
      "4. Generated cross-case link graph node in Neo4j layer."
    ]
  },
  {
    insightId: "INS-02",
    title: "30-Day Rising Risk Warning — Hoodi Corridor",
    text: "Spatio-temporal model flags an 88% probability of night-time warehouse break-ins in the Hoodi-ORR industrial corridor over the next 30 days.",
    confidence: 88,
    sourceIds: ["hz-pred-1", "FIR-2026-0489", "FIR-2026-0534"],
    agent: "Analytics Agent (ST-DBSCAN + XGBoost)",
    timestamp: "45 mins ago",
    severity: "warning",
    reasoningSteps: [
      "1. Analyzed spatial shift of burglary incidents moving east along the Outer Ring Road corridor.",
      "2. Identified temporal pattern: All incidents occur between 01:30 AM and 03:45 AM on Tuesdays/Thursdays.",
      "3. Highlighted 12 un-monitored electronics storage warehouses in Hoodi sector.",
      "4. Flagged for immediate supervisor patrol allocation."
    ]
  },
  {
    insightId: "INS-03",
    title: "Modus Operandi Tool Signature Match",
    text: "Forensic metallurgical analysis of lock cuts in Whitefield (FIR-0489) and Indiranagar (FIR-0512) confirms identical DeWalt 9-inch diamond cutting blade kerf signature.",
    confidence: 91,
    sourceIds: ["FIR-2026-0489", "FIR-2026-0512", "w1"],
    agent: "Forensic Pattern Matcher",
    timestamp: "2 hours ago",
    severity: "info",
    reasoningSteps: [
      "1. Extracted high-resolution kerf width scans (2.4mm) from state forensic lab uploads.",
      "2. Matched blade wear notch pattern with 91% similarity index.",
      "3. Linked recovered tool w1 (DeWalt Grinder) directly to both crime scene reports."
    ]
  }
];
