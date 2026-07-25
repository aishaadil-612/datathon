import os
import sys
import json
import gzip
import logging
from datetime import datetime

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.database.postgres import postgres_client, PSYCOPG2_AVAILABLE

logger = logging.getLogger("argus.execution.build_event_patterns")

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
INPUT_FILE_20K = os.path.join(DATA_DIR, "cases_db_20000.json")
INPUT_FILE_1000 = os.path.join(DATA_DIR, "cases_db_1000.json")

GZ_OUTPUT_FILE = os.path.join(DATA_DIR, "solved_case_events.json.gz")
INDEX_OUTPUT_FILE = os.path.join(DATA_DIR, "solved_case_patterns_index.json")

def generate_victim_relief_action(offense: str, victim_name: str, loss_amount: str = "specified") -> str:
    offense_lower = offense.lower()
    if "cyber" in offense_lower or "fraud" in offense_lower or "skimming" in offense_lower:
        return f"Issue immediate emergency freeze on beneficiary bank wallets; initiate fast-track RBI Cyber Fraud refund claim for victim {victim_name}; issue card/credential replacement advisory."
    elif "robbery" in offense_lower or "extortion" in offense_lower or "snatching" in offense_lower:
        return f"Dispatch victim support liaison unit to {victim_name}; file property recovery lien for recovered valuables; deploy emergency police beat patrol around residential/commercial premises."
    elif "theft" in offense_lower or "vehicle" in offense_lower:
        return f"Issue automated stolen asset alert across interstate transport portals; provide {victim_name} with digital police verification for rapid insurance claim processing."
    return f"Provide comprehensive victim assistance to {victim_name}; file formal charge sheet for restitution and legal advocacy."

def generate_investigative_action(offense: str, evidence_type: str, vehicle_plate: str, suspect_name: str) -> str:
    return (
        f"Cross-reference {evidence_type} digital/physical traces with central criminal database. "
        f"Deploy automatic number plate recognition (ANPR) cameras along getaway corridor for vehicle {vehicle_plate}. "
        f"Execute targeted surveillance on prime suspect {suspect_name}."
    )

def build_event_resolution_patterns():
    input_path = INPUT_FILE_20K if os.path.exists(INPUT_FILE_20K) else INPUT_FILE_1000
    if not os.path.exists(input_path):
        print(f"[ERROR] Master dataset file not found at '{input_path}'", flush=True)
        return False

    print(f"[INFO] Loading master dataset from '{input_path}'...", flush=True)
    with open(input_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    firs = data.get("firs", [])
    print(f"[INFO] Total cases in dataset: {len(firs):,}", flush=True)

    solved_events = []
    index_by_offense = {}
    index_by_evidence = {}
    index_by_mo_tag = {}

    for fir in firs:
        # Include all cases with full resolution timelines
        case_id = fir["id"]
        offense = fir.get("offense", "General Crime")
        city = fir.get("city", "Metropolitan Area")
        status = fir.get("status", "Solved")
        description = fir.get("description", "")
        mo_tags = fir.get("mo_tags", [])
        mo_vector = fir.get("mo_feature_vector", [0.5, 0.5, 0.5, 0.5, 0.5])
        unfold_seq = fir.get("pattern_unfold_sequence", [])

        victim = fir.get("victim", {})
        witness = fir.get("witness", {})
        evidence = fir.get("evidence", {})

        victim_name = victim.get("name", f"Victim of {case_id}")
        witness_name = witness.get("name", "Witness")
        witness_testimony = witness.get("testimony", "Observed suspect activity near scene.")
        evidence_type = evidence.get("type", "Digital Forensic Log")
        evidence_desc = evidence.get("description", "Forensic traces analyzed.")
        
        suspect_name = fir.get("suspect_name", "Unidentified Syndicate Operative")
        suspect_id = fir.get("suspect_id", "P-100")
        vehicle_plate = fir.get("vehicle_plate", "KA-01-XX-0000")
        weapon = fir.get("weapon", "Standard Issue / Tool")

        event_timeline = [
            {
                "step": 1,
                "event_type": "INCIDENT_REPORTED",
                "timestamp_relative": "T+00:00",
                "actor": "VICTIM",
                "details": f"Victim {victim_name} (Age {victim.get('age', 35)}) reported {offense} incident at {fir.get('location', city)}: '{description[:120]}...'"
            },
            {
                "step": 2,
                "event_type": "MO_PATTERN_IDENTIFICATION",
                "timestamp_relative": "T+02:00",
                "actor": "ANALYTICS_ENGINE",
                "details": f"Modus Operandi categorized under tags {mo_tags}. Chronological unfolding phases: " + (" | ".join(unfold_seq[:2]) if unfold_seq else description[:100])
            },
            {
                "step": 3,
                "event_type": "EVIDENCE_DISCOVERY",
                "timestamp_relative": "T+06:00",
                "actor": "FORENSIC_TEAM",
                "evidence_type": evidence_type,
                "details": f"Evidence item {evidence.get('id', 'EVI')} ({evidence_type}): {evidence_desc}"
            },
            {
                "step": 4,
                "event_type": "WITNESS_INTERVIEW",
                "timestamp_relative": "T+12:00",
                "actor": "FIELD_INVESTIGATOR",
                "witness_name": witness_name,
                "details": f"Witness {witness_name} testified: '{witness_testimony}'. Suspect getaway vehicle plate {vehicle_plate} identified."
            },
            {
                "step": 5,
                "event_type": "BREAKTHROUGH_RESOLUTION",
                "timestamp_relative": "T+24:00",
                "actor": "SENIOR_DETECTIVE",
                "suspect_id": suspect_id,
                "suspect_name": suspect_name,
                "details": f"Convergence of {evidence_type} and witness vehicle sighting {vehicle_plate} confirmed prime suspect {suspect_name} ({suspect_id}). Case status: {status}."
            }
        ]

        resolution_blueprint = {
            "key_triggers": f"Evidence Type: '{evidence_type}' + Witness Sighting: Vehicle '{vehicle_plate}'",
            "investigative_action": generate_investigative_action(offense, evidence_type, vehicle_plate, suspect_name),
            "victim_relief_action": generate_victim_relief_action(offense, victim_name)
        }

        event_record = {
            "case_id": case_id,
            "offense": offense,
            "city": city,
            "status": status,
            "incident_date": fir.get("incident_date", "2026-01-01 00:00:00"),
            "location": fir.get("location", city),
            "mo_tags": mo_tags,
            "mo_vector": mo_vector,
            "suspect": {"id": suspect_id, "name": suspect_name},
            "vehicle_plate": vehicle_plate,
            "weapon": weapon,
            "victim_summary": {"name": victim_name, "age": victim.get("age", 35)},
            "evidence_summary": {"type": evidence_type, "description": evidence_desc},
            "witness_summary": {"name": witness_name, "testimony": witness_testimony},
            "event_timeline": event_timeline,
            "resolution_blueprint": resolution_blueprint
        }

        solved_events.append(event_record)

        # Build compressed multi-key lookup index
        if offense not in index_by_offense:
            index_by_offense[offense] = []
        index_by_offense[offense].append(case_id)

        if evidence_type not in index_by_evidence:
            index_by_evidence[evidence_type] = []
        index_by_evidence[evidence_type].append(case_id)

        for tag in mo_tags:
            if tag not in index_by_mo_tag:
                index_by_mo_tag[tag] = []
            index_by_mo_tag[tag].append(case_id)

    # 1. Save compressed Gzip JSON file
    print(f"[INFO] Writing compressed event database ({len(solved_events):,} records) to '{GZ_OUTPUT_FILE}'...", flush=True)
    payload_json = json.dumps({"cases": solved_events, "generated_at": datetime.now().isoformat()}, indent=None)
    with gzip.open(GZ_OUTPUT_FILE, "wt", encoding="utf-8", compresslevel=9) as gz:
        gz.write(payload_json)

    gz_size_mb = os.path.getsize(GZ_OUTPUT_FILE) / (1024 * 1024)
    print(f"[SUCCESS] Compressed event database created successfully! Size: {gz_size_mb:.2f} MB", flush=True)

    # 2. Save pattern index file
    index_payload = {
        "metadata": {
            "total_cases_indexed": len(solved_events),
            "total_offense_types": len(index_by_offense),
            "total_evidence_types": len(index_by_evidence),
            "total_mo_tags": len(index_by_mo_tag),
            "generated_at": datetime.now().isoformat()
        },
        "by_offense": {k: v[:50] for k, v in index_by_offense.items()},
        "by_evidence_type": {k: v[:50] for k, v in index_by_evidence.items()},
        "by_mo_tag": {k: v[:50] for k, v in index_by_mo_tag.items()}
    }
    with open(INDEX_OUTPUT_FILE, "w", encoding="utf-8") as idx_f:
        json.dump(index_payload, idx_f, indent=2)
    print(f"[SUCCESS] Multi-key pattern index saved to '{INDEX_OUTPUT_FILE}'", flush=True)

    # 3. Seed Supabase PostgreSQL table `case_resolution_events`
    if postgres_client.use_supabase and PSYCOPG2_AVAILABLE:
        try:
            print("[INFO] Seeding Supabase PostgreSQL table `case_resolution_events`...", flush=True)
            conn = postgres_client._get_connection()
            conn.autocommit = False
            with conn.cursor() as cur:
                cur.execute("""
                    CREATE TABLE IF NOT EXISTS case_resolution_events (
                        case_id VARCHAR(64) PRIMARY KEY REFERENCES firs(id) ON DELETE CASCADE,
                        offense VARCHAR(255),
                        city VARCHAR(100),
                        status VARCHAR(64),
                        evidence_type VARCHAR(100),
                        suspect_name VARCHAR(255),
                        vehicle_plate VARCHAR(50),
                        mo_tags TEXT[],
                        events JSONB,
                        resolution_blueprint JSONB,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    );
                    CREATE INDEX IF NOT EXISTS idx_cre_offense ON case_resolution_events(offense);
                    CREATE INDEX IF NOT EXISTS idx_cre_evidence_type ON case_resolution_events(evidence_type);
                """)
                conn.commit()

                from psycopg2.extras import execute_values
                BATCH_SIZE = 1000
                print("[INFO] High-speed batch inserting case resolution event timelines...", flush=True)
                for idx in range(0, len(solved_events), BATCH_SIZE):
                    chunk = solved_events[idx:idx + BATCH_SIZE]
                    tuples = [
                        (
                            rec["case_id"],
                            rec["offense"],
                            rec["city"],
                            rec["status"],
                            rec["evidence_summary"]["type"],
                            rec["suspect"]["name"],
                            rec["vehicle_plate"],
                            rec["mo_tags"],
                            json.dumps(rec["event_timeline"]),
                            json.dumps(rec["resolution_blueprint"])
                        )
                        for rec in chunk
                    ]
                    execute_values(cur, """
                        INSERT INTO case_resolution_events (case_id, offense, city, status, evidence_type, suspect_name, vehicle_plate, mo_tags, events, resolution_blueprint)
                        VALUES %s
                        ON CONFLICT (case_id) DO NOTHING;
                    """, tuples, page_size=500)
                    conn.commit()
                    print(f"  [Resolution Events Progress] Ingested {min(idx + BATCH_SIZE, len(solved_events)):,} / {len(solved_events):,} event timelines...", flush=True)

            conn.close()
            print("[SUCCESS] Successfully seeded case_resolution_events in Supabase PostgreSQL!", flush=True)
        except Exception as e:
            print(f"[NOTICE] Database insertion note ({e}). Local compressed storage active.", flush=True)

    return True

if __name__ == "__main__":
    build_event_resolution_patterns()
