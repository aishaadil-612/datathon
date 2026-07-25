import logging
import random
import time
from typing import Dict, Any

logger = logging.getLogger("argus.agents.fir_assistant.fir_drafter")

OFFENSE_MAPPINGS = {
    "cyber": {
        "category": "Cyber Crime & Financial Fraud",
        "cognizable": True,
        "bns_sections": ["BNS Section 318 (Cheating)", "IT Act Section 66D (Cheating by Impersonation)"],
        "ipc_sections": ["IPC Section 420 (Cheating)", "IT Act Section 66D"],
        "specialized_unit": "Cyber Crime Investigation Cell"
    },
    "theft": {
        "category": "Property Theft & Burglary",
        "cognizable": True,
        "bns_sections": ["BNS Section 303 (Theft)", "BNS Section 305 (Theft in Dwelling House)"],
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
    narrative = extracted.get("narrative_summary", "").lower()

    # Determine crime category and legal sections
    crime_type = "theft"
    for key in OFFENSE_MAPPINGS:
        if key in narrative or key in extracted.get("suspect_info", "").lower():
            crime_type = key
            break

    mapping = OFFENSE_MAPPINGS[crime_type]

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
