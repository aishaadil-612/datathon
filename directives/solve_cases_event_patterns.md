# Directive: Build Event-Based Solved Case Resolution Patterns & AI Solver Engine

## Goal
Extract resolution event timelines from 10,000+ solved and charge-sheeted crime cases, compress and index the event streams (`.json.gz` + Supabase PostgreSQL `case_resolution_events`), and provide an AI pattern matching engine to solve new victim cases using evidence and witness testimonies.

## Inputs
- Master case database (`data/cases_db_20000.json` or Supabase PostgreSQL database).
- Fields: `id`, `offense`, `city`, `status`, `description`, `location`, `mo_tags`, `mo_feature_vector`, `pattern_unfold_sequence`, `suspect_id`, `suspect_name`, `vehicle_plate`, `weapon`, `victim`, `witness`, `evidence`.

## Steps for Builder Script (`execution/build_event_resolution_patterns.py`)
1. **Filter Solved Cases**: Filter all cases where status is `Solved` or `Charge Sheet Filed` (~10,000+ cases).
2. **Transform into Event Timeline**:
   Convert each case into a 5-step event sequence:
   - `EVT-1: INCIDENT_REPORTED` (Victim details & crime description)
   - `EVT-2: MO_SYNTACTIC_PATTERN` (Unfolding phase sequence & MO vectors)
   - `EVT-3: EVIDENCE_DISCOVERY` (Forensic, CCTV, CDR, or physical recovery details)
   - `EVT-4: WITNESS_SIGHTING` (Witness testimony, getaway vehicle, observed suspect activity)
   - `EVT-5: BREAKTHROUGH_RESOLUTION` (Suspect link, charge sheet filing, asset recovery & victim assistance actions)
3. **Generate Resolution Blueprints**:
   Derive actionable rules for each offense category:
   - `key_triggers`: Primary evidence item + witness lead combination.
   - `investigative_action`: Step-by-step directives for detectives.
   - `victim_relief_action`: Emergency asset freeze, fraud protection, or security measures to protect victims.
4. **Compress & Index Output**:
   - Write compressed event stream to `data/solved_case_events.json.gz` using gzip compression.
   - Build multi-key index `data/solved_case_patterns_index.json`.
   - Seed `case_resolution_events` table in Supabase PostgreSQL with `JSONB` event columns and GIN indexes.

## Steps for AI Pattern Solver (`core/analytics/event_pattern_solver.py`)
1. Load compressed event database (`solved_case_events.json.gz`).
2. Accept new victim case details (offense type, evidence type, witness description, MO tags).
3. Compute cosine & keyword similarity across historical event timelines.
4. Output matched precedents, recommended investigation milestones, and victim assistance strategies.

## Expected Output
- `data/solved_case_events.json.gz` (<4 MB compressed).
- `data/solved_case_patterns_index.json`
- Supabase PostgreSQL `case_resolution_events` table populated.
- Working AI pattern engine and CLI test script `execution/solve_new_case.py`.
