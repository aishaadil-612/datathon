import logging
import random
import time
from typing import Dict, Any

logger = logging.getLogger("argus.agents.fir_assistant.fir_drafter")

import re

OFFENSE_KEYWORDS = {
    "cyber": [
        "cyber", "bank", "otp", "app", "apk", "qr", "upi", "pin", "transaction",
        "phishing", "link", "scam", "online", "fake call", "impersonat", "disappeared",
        "account", "transfer", "card", "credit", "debit", "netbanking", "hacked",
        "crypto", "hawala", "security verification", "buyer", "sold", "sale", "received a call"
    ],
    "theft": [
        "theft", "stolen", "stole", "stolen vehicle", "burglary", "broken into",
        "housebreak", "locked house", "gold", "jewelry", "watch", "laptop", "cash", "robbed"
    ],
    "robbery": [
        "robbery", "extortion", "blackmail", "threaten", "at gunpoint", "knife",
        "weapon", "snatching", "chain snatch"
    ],
    "assault": [
        "assault", "attack", "beat", "beaten", "injured", "injury", "bleed",
        "hit", "punched", "fight", "hurt"
    ],
    "women": [
        "women", "harassment", "stalking", "stalker", "molest", "outrag", "abuse", "domestic"
    ],
    "missing": [
        "missing", "kidnap", "abduct", "untraceable", "disappeared person"
    ]
}

OFFENSE_MAPPINGS = {
    "cyber": {
        "category": "Cyber Crime & Financial Fraud",
        "cognizable": True,
        "bns_sections": ["BNS Section 318(4) (Cheating by Impersonation)", "IT Act Section 66D (Cheating using Computer Resource)"],
        "ipc_sections": ["IPC Section 420 (Cheating & Dishonestly Inducing Delivery)", "IT Act Section 66D"],
        "specialized_unit": "Cyber Crime Investigation Cell"
    },
    "theft": {
        "category": "Property Theft & Burglary",
        "cognizable": True,
        "bns_sections": ["BNS Section 303(2) (Theft)", "BNS Section 305 (Theft in Dwelling House)"],
        "ipc_sections": ["IPC Section 379 (Theft)", "IPC Section 380"],
        "specialized_unit": "Anti-Theft Squad / Detective Department"
    },
    "robbery": {
        "category": "Extortion & Highway Robbery",
        "cognizable": True,
        "bns_sections": ["BNS Section 308 (Extortion)", "BNS Section 309 (Robbery)"],
        "ipc_sections": ["IPC Section 392 (Robbery)", "IPC Section 384"],
        "specialized_unit": "Organized Crime & Crime Branch"
    },
    "assault": {
        "category": "Physical Assault & Violence",
        "cognizable": True,
        "bns_sections": ["BNS Section 115 (Voluntarily Causing Hurt)", "BNS Section 117 (Grievous Hurt)"],
        "ipc_sections": ["IPC Section 323", "IPC Section 325 (Grievous Hurt)"],
        "specialized_unit": "Law & Order Division"
    },
    "women": {
        "category": "Offences Against Women & Children",
        "cognizable": True,
        "bns_sections": ["BNS Section 74 (Outraging Modesty)", "BNS Section 79 (Insulting Modesty)"],
        "ipc_sections": ["IPC Section 354", "IPC Section 509"],
        "specialized_unit": "Women Protection Cell / Crime Branch"
    },
    "missing": {
        "category": "Missing Persons & Kidnapping",
        "cognizable": True,
        "bns_sections": ["BNS Section 137 (Kidnapping)", "BNS Section 140"],
        "ipc_sections": ["IPC Section 363 (Kidnapping)"],
        "specialized_unit": "Missing Persons Bureau"
    }
}

async def execute_fir_drafter(intake_result: Dict[str, Any], station: str = "Central Police Station") -> Dict[str, Any]:
    """
    Generates a legally structured FIR draft from complaint intake data.
    Classifies cognizable status, applies BNS/IPC sections, and assigns draft FIR ID.
    """
    logger.info("Executing FIR Drafter tool")
    extracted = intake_result.get("extracted_entities", {})
    raw_text = intake_result.get("raw_complaint", "") or extracted.get("narrative_summary", "")
    text_lower = (raw_text + " " + extracted.get("suspect_info", "")).lower()

    # Determine crime category using multi-keyword scoring
    crime_type = "cyber"
    best_matches = 0

    for category, keywords in OFFENSE_KEYWORDS.items():
        count = sum(1 for kw in keywords if kw in text_lower)
        if count > best_matches:
            best_matches = count
            crime_type = category

    if best_matches == 0:
        if any(w in text_lower for w in ["money", "account", "₹", "rs", "rupees", "bank", "upi"]):
            crime_type = "cyber"
        else:
            crime_type = "theft"

    mapping = OFFENSE_MAPPINGS[crime_type]

    # Extract financial loss amount
    amt_match = re.search(r"(₹\s*[\d,]+|Rs\.?\s*[\d,]+|INR\s*[\d,]+|[\d,]+\s*rupees)", raw_text, re.IGNORECASE)
    financial_loss = amt_match.group(1) if amt_match else extracted.get("financial_loss", "Unspecified Amount")

    draft_id = f"DRAFT-FIR-2026-{random.randint(1000, 9999)}"
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S IST")

    fir_draft_payload = {
        "draft_id": draft_id,
        "status": "PENDING_POLICE_APPROVAL",
        "created_at": timestamp,
        "police_station": station,
        "cognizable_offence": mapping["cognizable"],
        "crime_category": mapping["category"],
        "applicable_legal_sections": {
            "bns_sections": mapping["bns_sections"],
            "ipc_sections": mapping["ipc_sections"]
        },
        "complainant_details": {
            "name": extracted.get("complainant", "Citizen"),
            "contact_verified": True
        },
        "incident_details": {
            "location": extracted.get("location", "Central District"),
            "time": extracted.get("incident_time", "Recent"),
            "financial_loss": financial_loss,
            "narrative": extracted.get("narrative_summary", "Standard complaint report.")
        },
        "suspect_details": extracted.get("suspect_info", "Under Investigation"),
        "evidence_summary": extracted.get("evidence_items", ["Complaint Statement"]),
        "recommended_routing_unit": mapping["specialized_unit"],
        "officer_approval_required": True
    }

    return {
        "status": "DRAFT_GENERATED",
        "fir_draft": fir_draft_payload,
        "summary": f"Draft FIR '{draft_id}' generated under {mapping['category']} ({mapping['bns_sections'][0]}). Awaiting officer approval."
    }
