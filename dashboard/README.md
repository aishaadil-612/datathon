# CrimeLens — Crime Intelligence Command Center

CrimeLens is an AI-powered Crime Intelligence Platform. Instead of helping officers manually query disconnected databases, CrimeLens transforms disparate crime records, ANPR logs, cell tower pings, and modus operandi signatures into explainable, accountable, and actionable intelligence.

---

## 🚀 Quick Start (Running Locally)

### Prerequisites
- Node.js (v18+ or LTS) & npm

### Installation & Launch Commands

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

The application will launch locally at `http://localhost:3000`.

---

## 🏛️ System Information Architecture & Key Views

1. **Overview ("Command Center Home"):** Real-time KPI strip, mini hotspot map, mini criminal network graph, operational alert ticker, and live AI insights feed.
2. **Hotspot Map:** Interactive Leaflet map with incident clusters, density heatmap toggle, time-range slider, and a **30-Day Predictive Forecast Layer** ("Show predicted rising-risk zones next 30 days") with ST-DBSCAN zone polygons (e.g., Hoodi ORR Corridor - 88% risk).
3. **Criminal Network:** Interactive entity graph (Persons, Cases, Vehicles, Locations, Organizations, Weapons) supporting direct evidence (solid) vs inferred MO similarity (dashed) links, node inspection, and **Shortest Path Highlight interaction** (Dijkstra algorithm).
4. **Case Timelines:** Multi-case chronological timelines with event source tagging and **Multi-Case Overlay Comparison** to highlight cross-case temporal correlation.
5. **Case Search & Records:** Multi-faceted search engine filtering across FIRs, vehicle plates, suspect names, and risk scores with quick-action links.
6. **Audit & Governance:** Append-only compliance ledger matching schema (`logId`, `user`, `role`, `query`, `toolInvoked`, `timestamp`, `confidence`, `recordsTouched`). Features **Role-Gated Views** (Investigator personal log vs Supervisor/Admin system-wide log).
7. **AI Investigation Workspace:** Embedded, read-only copilot assistant narrating insights with confidence scores, reasoning steps, and evidence links.
8. **Shared Explainability Panel:** Global slide-over drawer showing plain-text conclusion, color-coded confidence gauge, step-by-step reasoning trail, source record chips, and agent/tool attributions.

---

## 🧩 Coherent Narrative Seed Data (`/src/mock`)

The mock data layer is structured around a single cohesive crime narrative in Bengaluru:
- **Case Series:** *The Silver SUV Commercial Robbery Ring*
- **Primary Suspect Vehicle:** `KA-03-MN-4921` (Silver Mahindra XUV700)
- **Key Suspects:** Rajesh Kumar ("Raja"), Vikram Singh, Suresh Gowda
- **Linked Cases:**
  - `FIR-2026-0489` (Whitefield Tech Park Burglary)
  - `FIR-2026-0512` (Indiranagar Gold Heist)
  - `FIR-2026-0534` (Koramangala Warehouse Heist)
  - `FIR-2026-0560` (Marathahalli Cash Van Interception)
- **Predicted Hotspot Zone:** Hoodi / Outer Ring Road Corridor (Risk Score: 88%)

---

## 🔌 Real Backend Integration Plug Points

This repository features a realistic, typed mock service layer (`/src/types` and `/src/mock`). Swapping the mock data layer for a production backend requires minimal changes:

1. **PostgreSQL / pgvector (Case Records & Embeddings):**
   - Replace `/src/mock/fir.ts` with REST/GraphQL endpoints fetching from PostgreSQL `fir_records` and `pgvector` hybrid search tables.
2. **Neo4j (Knowledge Graph Engine):**
   - Replace `/src/mock/entities.ts` and `/src/mock/relationships.ts` with Cypher API calls via Neo4j Bolt driver or FastAPI endpoint (`POST /api/v1/graph/query`).
3. **Analytics Agent (ST-DBSCAN & XGBoost Forecasts):**
   - Replace `/src/mock/hotspots.ts` with geospatial endpoints serving GeoJSON feature collections computed by the Python backend.
4. **Governance & Audit Ledger:**
   - Replace `/src/mock/auditLog.ts` with append-only PostgreSQL ledger triggers or blockchain/immutability log service.

---

## 🎨 Design System & Palette

- **Primary Navy:** `#1B2A56` (Headers, main nav, key cards)
- **Intelligence Teal:** `#0F5C56` (Copilot, analytics, graph node accents)
- **Governance Amber:** `#D97706` (Audit logs, forecast layer alerts, risk badges)
- **Neutral Command Grey:** `#F4F6FB` (Background surface)
- **Bilingual Chrome:** English (Default) and Kannada (ಕನ್ನಡ) UI toggle.
