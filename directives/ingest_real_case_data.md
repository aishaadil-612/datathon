# Directive: Ingest Real 1,000+ Case Data into System Databases & Agents

## Goal
Ingest `data/cases_db_1000.json` into `PostgresClient`, `Neo4jClient`, `SeniorDetectiveAgent`, `AnalyticsAgent`, `CaseIntelligenceAgent`, and `RAG Engine`, completely removing all legacy mock data fallback dicts.

## Steps
1. **Load `data/cases_db_1000.json`** into `PostgresClient`'s persistent memory and SQL query handler.
2. **Build Graph Engine** in `Neo4jClient` with 1,000+ case nodes and thousands of directional edges.
3. **Index Knowledge Bank** in `SeniorDetectiveAgent` with all 1,000+ cases and MO signatures.
4. **Configure ST-DBSCAN Hotspot Detector** to run spatial clustering over all 1,000+ case GPS locations.
5. **Configure MO Feature Vector Engine** to calculate cosine similarities across all 1,000+ case vectors.

## Expected Output
- System operates 100% on the 1,000+ real case database without relying on mock data.
