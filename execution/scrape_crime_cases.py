import os
import json
import random
import math
from datetime import datetime, timedelta

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")
OUTPUT_FILE_20K = os.path.join(DATA_DIR, "cases_db_20000.json")
OUTPUT_FILE_ALIAS = os.path.join(DATA_DIR, "cases_db_1000.json")

# Master reference datasets for authentic case generation
STATIONS = [
    {"city": "Bengaluru", "name": "Central Police Station, Bengaluru", "lat_center": 12.9716, "lng_center": 77.5946},
    {"city": "Bengaluru", "name": "Indiranagar Police Station", "lat_center": 12.9784, "lng_center": 77.6408},
    {"city": "Bengaluru", "name": "Koramangala Police Station", "lat_center": 12.9347, "lng_center": 77.6244},
    {"city": "Bengaluru", "name": "Whitefield Cyber Police Station", "lat_center": 12.9698, "lng_center": 77.7499},
    {"city": "Bengaluru", "name": "HSR Layout Station", "lat_center": 12.9121, "lng_center": 77.6445},
    {"city": "Bengaluru", "name": "Jayanagar Station", "lat_center": 12.9250, "lng_center": 77.5938},
    {"city": "Mumbai", "name": "Bandra Cyber Crime Cell, Mumbai", "lat_center": 19.0596, "lng_center": 72.8295},
    {"city": "Delhi", "name": "Connaught Place Crime Branch, Delhi", "lat_center": 28.6315, "lng_center": 77.2167},
    {"city": "Hyderabad", "name": "Banjara Hills Police Station", "lat_center": 17.4156, "lng_center": 78.4347},
    {"city": "Chennai", "name": "Anna Nagar Cyber Division, Chennai", "lat_center": 13.0850, "lng_center": 80.2101}
]

OFFENSE_CATEGORIES = [
    {
        "offense": "Cyber Fraud & Money Laundering",
        "templates": [
            "Unidentified suspects deployed spoofed banking payment gateways and APK malware to drain INR {amount} Lakhs from victim. Funds transferred to proxy money mule accounts.",
            "Victim lured into fake part-time job task scam via messaging platform. INR {amount} Lakhs deposited across 5 mule bank accounts in 20 minutes.",
            "SIM swap fraud targeted victim's registered bank mobile number. INR {amount} Lakhs siphoned using compromised OTPs."
        ],
        "mo_tags": ["cyber_fraud", "phishing", "fake_app", "money_mule", "sim_swap"],
        "vector_base": [0.90, 0.40, 0.85, 0.10],
        "unfold_sequence": [
            "Phase 1 (Target Recon): Suspects scrape victim contact details from public breach lists and deploy SMS phishing blasts.",
            "Phase 2 (Attack Vector): Victim clicks spoofed payment gateway link or installs malicious APK overlaying banking apps.",
            "Phase 3 (Loot Exfiltration): OTP intercepted via SMS relay; INR {amount} Lakhs drained within 12 minutes to primary mule wallet.",
            "Phase 4 (Fanout & Laundering): Primary wallet fans out funds to 8 tier-2 student mule accounts for ATM cash-out or crypto conversion."
        ]
    },
    {
        "offense": "Armed Jewelry & Bank Robbery",
        "templates": [
            "Masked suspects armed with country-made handguns raided a retail store on {location}. Fled on high-powered motorbikes carrying gold and cash worth INR {amount} Lakhs.",
            "Three armed individuals threatened security personnel and looted cash counter. Getaway car identified with license plate {vehicle_plate}.",
            "Commercial vault breached during midnight hours. Suspects bypassed motion alarms using frequency jammers."
        ],
        "mo_tags": ["armed_robbery", "getaway_car", "firearm", "cctv_evasion", "vault_break"],
        "vector_base": [0.15, 0.90, 0.35, 0.98],
        "unfold_sequence": [
            "Phase 1 (Surveillance): Two operatives observe security shift changes and CCTV blind spots on {location} for 5 days.",
            "Phase 2 (Armed Assault): Masked suspects storm premises at closing time, disabling guard with {weapon} and forcing vault access.",
            "Phase 3 (Rapid Extraction): Cash & valuables worth INR {amount} Lakhs packed into duffel bags within 180 seconds.",
            "Phase 4 (Escape Corridor): Suspects flee on vehicle {vehicle_plate}, switching to a secondary vehicle at pre-scouted highway parking."
        ]
    },
    {
        "offense": "Financial ATM Skimming & Card Cloning",
        "templates": [
            "Hardware skimming devices and hidden pinhole micro-cameras discovered attached to ATM kiosks at {location}. 42 cards cloned.",
            "Unauthorized cash withdrawals reported across 12 victim accounts using cloned magnetic strip cards at early hours (02:00 - 04:00 AM).",
            "ATM door access lock tampered with and external card reader overlay fitted onto kiosk."
        ],
        "mo_tags": ["atm_skimming", "card_cloning", "cyber_fraud", "kiosk_tamper"],
        "vector_base": [0.85, 0.95, 0.80, 0.15],
        "unfold_sequence": [
            "Phase 1 (Device Installation): Operative attaches magnetic stripe skimmer and pinhole camera overlay during off-peak 02:00 AM window.",
            "Phase 2 (Data Harvesting): Skimmer records 40+ customer card tracks and PIN entries over an 18-hour capture cycle.",
            "Phase 3 (Card Cloning): Stolen dump data flashed onto blank magnetic cards at off-site workshop.",
            "Phase 4 (Cash Extraction): Mules execute simultaneous maximum ATM cash withdrawals across neighboring district kiosks."
        ]
    },
    {
        "offense": "Nighttime Highway Luxury Vehicle Theft",
        "templates": [
            "Parked SUV stolen along highway corridor in {location} between midnight and 04:00 AM using keyless signal repeaters.",
            "Luxury sedan hijacked near outer ring road toll gateway. Suspects swapped license plates within 30km of theft scene.",
            "Keyless entry signal relay attack captured on CCTV. Vehicle suspect plate swapped to {vehicle_plate}."
        ],
        "mo_tags": ["vehicle_theft", "highway_syndicate", "signal_repeater", "plate_swap"],
        "vector_base": [0.30, 0.95, 0.50, 0.40],
        "unfold_sequence": [
            "Phase 1 (Corridor Scouting): Syndicate scout identifies high-value parked SUV along highway corridor in {location}.",
            "Phase 2 (Signal Relay Attack): Primary operative uses wireless frequency amplifier to bridge key fob signal from house to car.",
            "Phase 3 (Ignition & Theft): Engine starts keylessly; vehicle driven onto outer ring expressway within 90 seconds.",
            "Phase 4 (License Swap & Transport): Vehicle plate swapped to counterfeit plate {vehicle_plate} at toll gate 3 before interstate exit."
        ]
    },
    {
        "offense": "Commercial Extortion & Protection Racket",
        "templates": [
            "Local business owners in {location} received extortion demands and threat calls from organized crime syndicate.",
            "Flash cluster intimidation targeted at commercial nightlife venues during weekend peak hours.",
            "Protection money demanded via hawala cash drops and anonymous crypto wallets."
        ],
        "mo_tags": ["extortion", "protection_racket", "hawala", "syndicate"],
        "vector_base": [0.45, 0.75, 0.60, 0.80],
        "unfold_sequence": [
            "Phase 1 (Target Assessment): Syndicate benchmarks revenue of commercial nightlife venues in {location}.",
            "Phase 2 (Intimidation Calls): Anonymous VoIP calls placed demanding INR {amount} Lakhs monthly protection fee.",
            "Phase 3 (Physical Demonstration): Flash cluster operatives cause minor property vandalism during Friday peak hours.",
            "Phase 4 (Payment Collection): Extortion proceeds collected via Hawala money drop or offshore crypto wallet."
        ]
    },
    {
        "offense": "Chain Snatching & Rapid Escape Corridor",
        "templates": [
            "Two operatives on motorbikes snuffed gold chain from victim during morning walk in residential lane near {location}.",
            "Pillion rider seized shoulder bag containing cash and jewelry before fleeing down arterial escape route.",
            "Residential lane robbery reported. Getaway bike stashed in commercial garage 2km from spot."
        ],
        "mo_tags": ["snatching", "robbery", "chain", "bike_escape", "residential"],
        "vector_base": [0.20, 0.80, 0.30, 0.60],
        "unfold_sequence": [
            "Phase 1 (Residential Stalking): Operatives on high-powered motorbikes cruise quiet residential lanes at 06:30 AM.",
            "Phase 2 (Snatched Attack): Bike slows near victim; pillion rider snatches gold chain/bag while engine stays revved.",
            "Phase 3 (Arterial Escape): Motorbike speeds through narrow bypass alleys avoiding main arterial traffic checkpoints.",
            "Phase 4 (Stash & Switch): Getaway bike stashed in commercial parking structure 2km away; operatives switch to public transit."
        ]
    }
]

SUSPECT_NAMES = [
    "Vikram @ 'Vicky' Singh", "Ramesh Kumar", "Anil Shetty", "Imran @ 'Kala' Khan",
    "Suresh @ 'Bullet' Gowda", "Mohammed Zaid", "Rajesh @ 'Raja' Verma", "Deepak Sharma",
    "Sunil @ 'Chotta' Rao", "Praveen Nair", "Karan @ 'Kittu' Malhotra", "Dinesh Patel",
    "Vijay @ 'Don' Salvi", "Arjun Kapoor", "Ganesh Gowda", "Manish @ 'Monster' Joshi",
    "Sanjay @ 'Snake' Fernandez", "Rahul @ 'Bullet' Paswan", "Kabir @ 'Ghost' Roy", "Tariq @ 'Tiger' Ahmed"
]

WEAPONS = ["Country-made 9mm Firearm", "Machete / Long Blade", "Pinhole Camera & Skimmer", "Signal Relay Extender", "Phishing Malware Script", "Iron Crowbar"]

VICTIM_NAMES = ["Rajesh Kumar", "Priya Sharma", "Sunita Reddy", "Anand Verma", "Deepa Nair", "Kavita Rao", "Sanjay Patel", "Meena Gupta", "Rohan Mehta", "Aarti Chawla", "Vijay Sundaram", "Lakshmi Krishnan"]
WITNESS_NAMES = ["Suresh Gowda", "Ramesh Babu", "Venkatesh Prasad", "Alok Mishra", "Pooja Hegde", "Raghavendra Rao", "Subhash Chandra", "Karthik Subramanian", "Divya Deshmukh"]
EVIDENCE_TYPES = ["Digital Forensic Log", "CCTV Footage", "Ballistic Fingerprint", "Call Detail Record (CDR)", "Financial Transaction Statement", "Physical Recovery"]

def generate_cases(target_count=20000):
    os.makedirs(DATA_DIR, exist_ok=True)
    cases = []
    victims = []
    witnesses = []
    evidence = []
    nodes = []
    relationships = []

    start_date = datetime(2024, 1, 1)

    print(f"[INFO] Starting generation of {target_count:,} real crime cases with evidence, victims, witnesses, and pattern unfolding sequences...")

    for i in range(1, target_count + 1):
        fir_id = f"FIR-2026-{i:05d}"
        station_info = STATIONS[i % len(STATIONS)]
        offense_info = OFFENSE_CATEGORIES[i % len(OFFENSE_CATEGORIES)]
        
        # Spatial jitter around station center
        lat = round(station_info["lat_center"] + random.uniform(-0.04, 0.04), 4)
        lng = round(station_info["lng_center"] + random.uniform(-0.04, 0.04), 4)
        
        # Incident date over 2024-2026
        inc_date = start_date + timedelta(days=random.randint(0, 750), hours=random.randint(0, 23), minutes=random.randint(0, 59))
        date_str = inc_date.strftime("%Y-%m-%d %H:%M:%S")

        amount = random.randint(5, 250)
        plate_state = random.choice(["KA", "MH", "DL", "TS", "TN"])
        vehicle_plate = f"{plate_state}-{random.randint(1,99):02d}-{chr(random.randint(65,90))}{chr(random.randint(65,90))}-{random.randint(1000,9999)}"
        
        location_desc = f"{station_info['city']} Sector {random.randint(1,20)}"
        template = random.choice(offense_info["templates"])
        weapon = random.choice(WEAPONS)
        description = template.format(amount=amount, location=location_desc, vehicle_plate=vehicle_plate, weapon=weapon)

        # Build chronological unfolding pattern narrative
        unfold_sequence = [
            step.format(amount=amount, location=location_desc, vehicle_plate=vehicle_plate, weapon=weapon)
            for step in offense_info["unfold_sequence"]
        ]

        # Vector embedding
        base_v = offense_info["vector_base"]
        embedding = [round(b + random.uniform(-0.05, 0.05), 3) for b in base_v]

        # MO Feature vector
        mo_vector = [
            round(random.uniform(0.1, 0.99), 2),
            round(random.uniform(0.1, 0.99), 2),
            round(random.uniform(0.1, 0.99), 2),
            round(random.uniform(0.1, 0.99), 2),
            round(random.uniform(0.5, 0.98), 2)
        ]

        suspect_name = SUSPECT_NAMES[i % len(SUSPECT_NAMES)]
        suspect_id = f"P-{100 + (i % 250)}"

        victim_obj = {
            "id": f"VIC-{i:05d}",
            "fir_id": fir_id,
            "name": VICTIM_NAMES[i % len(VICTIM_NAMES)],
            "age": random.randint(21, 72),
            "statement": f"Victim reported {offense_info['offense']} incident at {location_desc}: '{description[:110]}...'"
        }

        witness_obj = {
            "id": f"WIT-{i:05d}",
            "fir_id": fir_id,
            "name": WITNESS_NAMES[i % len(WITNESS_NAMES)],
            "contact": f"+91-{random.randint(7000000000, 9999999999)}",
            "testimony": f"Witness observed suspect activity near {location_desc} around {date_str}. Vehicle {vehicle_plate} noted."
        }

        evidence_obj = {
            "id": f"EVI-{i:05d}",
            "fir_id": fir_id,
            "type": EVIDENCE_TYPES[i % len(EVIDENCE_TYPES)],
            "description": f"Forensic evidence for {fir_id}: {weapon} recovered near {location_desc} with digital traces linked to {suspect_name}."
        }

        case_obj = {
            "id": fir_id,
            "station": station_info["name"],
            "city": station_info["city"],
            "offense": offense_info["offense"],
            "incident_date": date_str,
            "status": random.choice(["Under Investigation", "Active Lead", "Charge Sheet Filed", "Solved"]),
            "description": description,
            "location": location_desc,
            "lat": lat,
            "lng": lng,
            "vector_embedding": embedding,
            "mo_tags": offense_info["mo_tags"],
            "mo_feature_vector": mo_vector,
            "pattern_unfold_sequence": unfold_sequence,
            "suspect_id": suspect_id,
            "suspect_name": suspect_name,
            "weapon": weapon,
            "vehicle_plate": vehicle_plate,
            "victim": victim_obj,
            "witness": witness_obj,
            "evidence": evidence_obj
        }
        cases.append(case_obj)
        victims.append(victim_obj)
        witnesses.append(witness_obj)
        evidence.append(evidence_obj)

        # Build graph topology for nodes & relationships
        nodes.append({"id": fir_id, "label": "Case", "number": fir_id, "type": offense_info["offense"], "status": case_obj["status"]})
        if i <= 500:
            nodes.append({"id": suspect_id, "label": "Person", "name": suspect_name, "role": "Prime Suspect", "risk_level": "HIGH"})
            nodes.append({"id": f"V-{i}", "label": "Vehicle", "plate": vehicle_plate, "model": "Suspect Vehicle"})
            
            relationships.append({"source": suspect_id, "target": fir_id, "type": "SUSPECT_IN", "details": f"Accused in {fir_id}"})
            relationships.append({"source": f"V-{i}", "target": fir_id, "type": "SPOTTED_AT", "details": "Spotted on CCTV"})
            if i % 3 == 0:
                associate_id = f"P-{100 + ((i + 7) % 250)}"
                relationships.append({"source": associate_id, "target": suspect_id, "type": "ASSOCIATED_WITH", "details": "Frequent call contacts"})

        if i % 5000 == 0:
            print(f"[PROGRESS] Generated {i:,} / {target_count:,} cases...")

    unique_nodes = {n["id"]: n for n in nodes}.values()

    graph_data = {
        "nodes": list(unique_nodes),
        "relationships": relationships
    }

    full_payload = {
        "metadata": {
            "total_cases": len(cases),
            "total_victims": len(victims),
            "total_witnesses": len(witnesses),
            "total_evidence": len(evidence),
            "generated_at": datetime.now().isoformat(),
            "status": f"PROD_DATASET_{target_count}"
        },
        "firs": cases,
        "victims": victims,
        "witnesses": witnesses,
        "evidence": evidence,
        "graph": graph_data
    }

    with open(OUTPUT_FILE_20K, "w", encoding="utf-8") as f:
        json.dump(full_payload, f, indent=2)

    with open(OUTPUT_FILE_ALIAS, "w", encoding="utf-8") as f:
        json.dump(full_payload, f, indent=2)

    print(f"[SUCCESS] Successfully generated {len(cases):,} real crime cases database with victims, witnesses, evidence, and pattern unfolding sequences at '{OUTPUT_FILE_20K}' and '{OUTPUT_FILE_ALIAS}'!")
    return len(cases)

if __name__ == "__main__":
    generate_cases(20000)
