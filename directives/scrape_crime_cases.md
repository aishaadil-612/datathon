# Directive: Scrape & Build 1,000+ Real Crime Cases Dataset

## Goal
Fetch, scrape, clean, and build a comprehensive database of **1,000+ real crime cases & FIR records** with full metadata, spatial coordinates, modus operandi feature vectors, graph node topologies, and text embeddings.

## Inputs
- Web crime data sources / legal FIR archives / Kaggle crime datasets / open API endpoints.
- Police station jurisdiction master list (Bengaluru Urban, Delhi NCR, Mumbai City, Hyderabad, Chennai).

## Steps for Execution Script (`execution/scrape_crime_cases.py`)
1. **Scrape / Fetch Raw Crime Records**:
   - Retrieve 1,000+ distinct crime case entries spanning Cyber Fraud, Armed Robbery, ATM Skimming, Extortion, Vehicle Theft, Homicide, Narcotics, and Chain Snatching.
2. **Standardize Schema Fields**:
   - `id`: FIR unique identifier (e.g. `FIR-2026-0001` to `FIR-2026-1050`).
   - `station`: Police station jurisdiction.
   - `offense`: Primary legal offense classification.
   - `incident_date`: Timestamp formatted ISO (`YYYY-MM-DD HH:MM:SS`).
   - `status`: Legal status (`Under Investigation`, `Charge Sheet Filed`, `Active Lead`, `Solved`).
   - `description`: Detailed investigative incident report.
   - `location`: Neighborhood / Landmark / Street address.
   - `lat` / `lng`: Real spatial GPS coordinates.
   - `vector_embedding`: 4-dim normalized vector representation.
   - `mo_tags`: Modus Operandi category tags.
   - `suspects`: Associated suspect profiles (ID, name, role, risk_level).
   - `victims`: Victim details.
   - `evidence`: Physical and digital evidence items.
   - `vehicles`: Linked getaway or stolen vehicle license plates.
3. **Generate Graph Topology**:
   - Construct graph nodes (`Person`, `Case`, `Vehicle`, `Weapon`, `Location`) and relationships (`SUSPECT_IN`, `ASSOCIATED_WITH`, `MONEY_TRAIL`, `SPOTTED_AT`, `LINKED_TO`).
4. **Save Target Output**:
   - Export formatted JSON database to `data/cases_db_1000.json`.

## Expected Output
- `data/cases_db_1000.json` containing >= 1000 fully validated case records.
