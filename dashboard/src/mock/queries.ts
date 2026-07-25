import { SampleQuery } from '../types';

export const mockSampleQueries: SampleQuery[] = [
  {
    id: "q1",
    queryEn: "Which cases in the last month share a vehicle plate?",
    queryKn: "ಕಳೆದ ತಿಂಗಳಲ್ಲಿ ಯಾವ ಪ್ರಕರಣಗಳು ಒಂದೇ ವಾಹನ ಸಂಖ್ಯೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳುತ್ತವೆ?",
    responseEn: "Analysis of Neo4j graph & ANPR logs reveals 4 connected commercial burglary cases sharing Silver Mahindra XUV700 (Reg: KA-03-MN-4921):\n• FIR-2026-0489 (Whitefield Tech Park, 02-Jul)\n• FIR-2026-0512 (Indiranagar Gold Heist, 09-Jul)\n• FIR-2026-0534 (Koramangala Warehouse, 15-Jul)\n• FIR-2026-0560 (Marathahalli Cash Van, 20-Jul)\nRegistered owner: Suresh Gowda (Scrap Merchant under surveillance).",
    responseKn: "Neo4j ಗ್ರಾಫ್ ಮತ್ತು ANPR ಲಾಗ್‌ಗಳ ವಿಶ್ಲೇಷಣೆಯು ಬೆಳ್ಳಿ ಮಹೀಂದ್ರಾ XUV700 (ಸಂಖ್ಯೆ: KA-03-MN-4921) ಅನ್ನು ಹಂಚಿಕೊಳ್ಳುವ 4 ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸುತ್ತದೆ:\n• ಎಫ್‌ಐಆರ್-2026-0489 (ವೈಟ್‌ಫೀಲ್ಡ್, 02-ಜುಲೈ)\n• ಎಫ್‌ಐಆರ್-2026-0512 (ಇಂದಿರಾನಗರ, 09-ಜುಲೈ)\n• ಎಫ್‌ಐಆರ್-2026-0534 (ಕೋರಮಂಗಲ, 15-ಜುಲೈ)\n• ಎಫ್‌ಐಆರ್-2026-0560 (ಮರಾಠಹಳ್ಳಿ, 20-ಜುಲೈ)\nಮಾಲೀಕರು: ಸುರೇಶ್ ಗೌಡ.",
    confidence: 94,
    sourceIds: ["FIR-2026-0489", "FIR-2026-0512", "FIR-2026-0534", "FIR-2026-0560", "v1"],
    targetView: "network",
    filterParams: { caseId: "FIR-2026-0489" },
    reasoningSteps: [
      "1. Ran NL2Cypher traversal: MATCH (v:Vehicle {plate: 'KA-03-MN-4921'})-[:SPOTTED_AT]->(c:Case) RETURN c.",
      "2. Verified 4 distinct FIR nodes linked within 30-day temporal window.",
      "3. Cross-referenced ANPR cameras along Old Airport Road & Whitefield Main Road."
    ]
  },
  {
    id: "q2",
    queryEn: "Show predicted rising-risk zones for Whitefield & Hoodi",
    queryKn: "ವೈಟ್‌ಫೀಲ್ಡ್ ಮತ್ತು ಹೂಡಿಗೆ ಮುನ್ಸೂಚಿಸಿದ ಅಪಾಯದ ವಲಯಗಳನ್ನು ತೋರಿಸಿ",
    responseEn: "Spatio-temporal forecasting model flags Hoodi - Outer Ring Road Corridor with an 88% predicted risk score for night-time warehouse break-ins over the next 30 days. Recommended action: Increase midnight mobile patrols along ORR Junction between 01:30 AM and 04:00 AM.",
    responseKn: "ಸ್ಪಾಟಿಯೋ-ಟೆಂಪೊರಲ್ ಮಾಡೆಲ್ ಮುಂದಿನ 30 ದಿನಗಳಲ್ಲಿ ಹೂಡಿ - ಔಟರ್ ರಿಂಗ್ ರೋಡ್ ಕಾರಿಡಾರ್‌ನಲ್ಲಿ ರಾತ್ರಿ ವೇಳೆ ಕನ್ನಗಳ್ಳತನದ ಅಪಾಯವನ್ನು 88% ಎಂದು ಮುನ್ಸೂಚಿಸುತ್ತದೆ. ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ: ಮಧ್ಯರಾತ್ರಿಯ ಮೊಬೈಲ್ ಗಸ್ತು ಹೆಚ್ಚಿಸಿ.",
    confidence: 88,
    sourceIds: ["hz-pred-1", "FIR-2026-0489", "FIR-2026-0534"],
    targetView: "map",
    filterParams: { zoneId: "hz-pred-1" },
    reasoningSteps: [
      "1. Queried ST-DBSCAN temporal decay model for East Subdivision.",
      "2. Detected 2.4x incident density acceleration heading toward Hoodi industrial zone.",
      "3. Formulated patrol optimization vector for station command."
    ]
  },
  {
    id: "q3",
    queryEn: "Trace the shortest connection path for Rajesh Kumar (Raja)",
    queryKn: "ರಾಜೇಶ್ ಕುಮಾರ್ (ರಾಜಾ) ಅವರ ಕನಿಷ್ಠ ಸಂಪರ್ಕ ಹಾದಿಯನ್ನು ಪತ್ತೆಹಚ್ಚಿ",
    responseEn: "Pathfinding query resolved direct 2-hop linkage between suspect Rajesh Kumar and Cash Van Heist FIR-2026-0560:\nRajesh Kumar → [charged_in] → FIR-2026-0560.\nSecondary 3-hop vehicle trail:\nRajesh Kumar → [operates] → KA-03-MN-4921 → [rammed_vehicle] → FIR-2026-0560.",
    responseKn: "ಲಿಂಕ್ ಹಾದಿ ವಿಶ್ಲೇಷಣೆ:\nರಾಜೇಶ್ ಕುಮಾರ್ → [ಆರೋಪಿ] → ಎಫ್‌ಐಆರ್-2026-0560.\nವಾಹನ ಹಾದಿ:\nರಾಜೇಶ್ ಕುಮಾರ್ → [ಚಾಲನೆ] → KA-03-MN-4921 → [ಡಿಕ್ಕಿ] → ಎಫ್‌ಐಆರ್-2026-0560.",
    confidence: 98,
    sourceIds: ["p1", "c4", "v1"],
    targetView: "network",
    filterParams: { source: "p1", target: "c4" },
    reasoningSteps: [
      "1. Executed graph path algorithm: shortestPath((p:Person {name:'Rajesh Kumar'})-[*]-(c:Case {caseId:'FIR-2026-0560'})).",
      "2. Evaluated edge confidence weights: direct charge sheet (98%) + vehicle match (95%)."
    ]
  },
  {
    id: "q4",
    queryEn: "Summarize the Kalyan Gang's Modus Operandi",
    queryKn: "ಕಲ್ಯಾಣ್ ಗ್ಯಾಂಗ್‌ನ ಅಪರಾಧ ಶೈಲಿಯನ್ನು ಸಂಕ್ಷೇಪಿಸಿ",
    responseEn: "Kalyan Criminal Syndicate Modus Operandi Profile:\n1. Target Selection: High-value commercial electronics stores & jewelry vaults situated near highway arterial exits.\n2. Entry Method: Heavy-duty DeWalt 9-inch angle grinder cuts through rear metal security shutters between 02:00 AM - 03:30 AM.\n3. Getaway Vehicle: Silver Mahindra XUV700 with forged/obfuscated license plates.\n4. Stolen Goods Disposal: Routed via scrap dealer network in Hoodi.",
    responseKn: "ಕಲ್ಯಾಣ್ ಅಪರಾಧ ಜಾಲದ ಕಾರ್ಯಾಚರಣೆ ವಿವರ:\n1. ಪ್ರಮುಖ ಎಲೆಕ್ಟ್ರಾನಿಕ್ಸ್ ಮತ್ತು ಚಿನ್ನದ ಮಳಿಗೆಗಳ ಗುರಿ.\n2. ರಾತ್ರಿ 02:00 - 03:30 ರ ನಡುವೆ ಆಂಗಲ್ ಗ್ರೈಂಡರ್ ಬಳಸಿ ಹಿಂದಿನ ಬಾಗಿಲು ಕತ್ತರಿಸುವುದು.\n3. ಬೆಳ್ಳಿ XUV700 ಕಾರಿನಲ್ಲಿ ಪರಾರಿ.\n4. ಹೂಡಿಯಲ್ಲಿ ಕದ್ದ ಮಾಲು ಹಂಚಿಕೆ.",
    confidence: 92,
    sourceIds: ["o1", "FIR-2026-0489", "FIR-2026-0512", "w1"],
    targetView: "search",
    filterParams: { query: "Kalyan" },
    reasoningSteps: [
      "1. Aggregated MO tags across 4 primary FIR reports.",
      "2. Cluster analysis confirmed 100% temporal alignment (02:00 - 03:30 AM entry window).",
      "3. Forensic tool match confirmed identical grinder blade signature."
    ]
  }
];
