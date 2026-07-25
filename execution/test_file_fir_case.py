import os
import sys
import asyncio
import json

# Ensure UTF-8 output formatting for Windows terminal
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

# Ensure project root is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agents.fir_assistant.agent import fir_assistant_agent
from agents.copilot.orchestrator import copilot_orchestrator
from gateway.routers.fir import handle_fir_approve, FIRApproveRequest

async def run_file_fir_case_test():
    print("=" * 85)
    print("  ARGUS AI FIR ASSISTANT — CASE REGISTRATION & AADHAAR OCR TEST")
    print("=" * 85)

    complaint_text = (
        "My name is Vikram Malhotra. On yesterday night at Koramangala 5th Block, two unidentified "
        "suspects on a black Pulsar motorcycle broke into my commercial warehouse, stole laptop computers "
        "and electronics worth 4 Lakhs, and exfiltrated towards Outer Ring Road. CCTV clip uploaded."
    )

    aadhaar_document_text = (
        "Government of India\n"
        "Unique Identification Authority of India\n"
        "Name: Vikram Malhotra\n"
        "DOB: 14/05/1988\n"
        "Gender: Male\n"
        "Address: #42, Koramangala 5th Block, Bengaluru - 560095\n"
        "Aadhaar Number: 6839 2019 4921"
    )

    print("\n1. [CITIZEN COMPLAINT INTAKE & AADHAAR CARD OCR SCAN]")
    print(f"   Raw Complaint Text : \"{complaint_text[:100]}...\"")
    print(f"   Uploaded Aadhaar Card OCR Scan Text:\n   \"{aadhaar_document_text}\"")

    # Step 1: Complaint Intake with Aadhaar Card OCR
    intake_res = await fir_assistant_agent.run(
        "complaint_intake",
        user_id="citizen_vikram",
        role="Investigator",
        complaint_text=complaint_text,
        channel="kiosk_mobile_app",
        aadhaar_input=aadhaar_document_text
    )

    print("\n   Intake & Aadhaar OCR Output:")
    intake_data = intake_res.get("data", {})
    extracted = intake_data.get("extracted_entities", {})
    aadhaar_ocr = intake_data.get("aadhaar_ocr_verification", {})

    print(f"     • Complainant      : {extracted.get('complainant')}")
    print(f"     • Location         : {extracted.get('location')}")
    print(f"     • Aadhaar Verified : {aadhaar_ocr.get('aadhaar_verified')}")
    print(f"     • Masked Aadhaar # : {aadhaar_ocr.get('masked_aadhaar_number')}")
    print(f"     • OCR Extracted    : {aadhaar_ocr.get('name_on_aadhaar')}")
    print(f"     • OCR Match Score  : {aadhaar_ocr.get('name_match_score')*100:.0f}%")
    print(f"     • Evidence Items   : {', '.join(extracted.get('evidence_items', []))}")
    print(f"     • Is Complete      : {intake_data.get('is_complete')}")

    # Step 2: FIR Drafting & Legal Classification
    print("\n2. [AUTOMATED FIR DRAFTING & LEGAL CLASSIFICATION]")
    draft_res = await fir_assistant_agent.run(
        "fir_drafter",
        user_id="officer_rao",
        role="Investigator",
        intake_res=intake_data,
        station="Koramangala Police Station"
    )

    draft_data = draft_res.get("data", {}).get("fir_draft", {})
    print(f"     • Draft ID           : {draft_data.get('draft_id')}")
    print(f"     • Status             : {draft_data.get('status')}")
    print(f"     • Crime Category     : {draft_data.get('crime_category')}")
    print(f"     • Cognizable Offence : {draft_data.get('cognizable_offence')}")
    print(f"     • BNS Sections       : {', '.join(draft_data.get('applicable_legal_sections', {}).get('bns_sections', []))}")
    print(f"     • IPC Sections       : {', '.join(draft_data.get('applicable_legal_sections', {}).get('ipc_sections', []))}")

    # Step 3: Authenticity & Fraud Detection
    print("\n3. [AUTHENTICITY & AI FRAUD RISK VERIFICATION]")
    verify_res = await fir_assistant_agent.run(
        "authenticity_verifier",
        user_id="officer_rao",
        role="Investigator",
        fir_draft=draft_data,
        otp_verified=True,
        govt_id_verified=True,
        gps_validated=True,
        aadhaar_ocr_res=aadhaar_ocr
    )

    verify_data = verify_res.get("data", {})
    metrics = verify_data.get("authenticity_metrics", {})
    fraud = verify_data.get("fraud_risk_assessment", {})

    print(f"     • Identity Verified : {metrics.get('identity_verified')}")
    print(f"     • Aadhaar OCR Status: {metrics.get('aadhaar_ocr_status')} ({metrics.get('masked_aadhaar_number')})")
    print(f"     • GPS Geo-Stamp     : {metrics.get('gps_location_valid')}")
    print(f"     • Duplicate Check   : {fraud.get('duplicate_detected')}")
    print(f"     • AI Fraud Risk     : Level '{fraud.get('risk_level')}' (Score: {fraud.get('risk_score')})")

    # Step 4: Police Officer Action Recommendations
    print("\n4. [POLICE OFFICER ACTION RECOMMENDATIONS]")
    rec_res = await fir_assistant_agent.run(
        "officer_action_recommender",
        user_id="officer_rao",
        role="Investigator",
        fir_draft=draft_data,
        verification_res=verify_data
    )

    rec_data = rec_res.get("data", {})
    for idx, act in enumerate(rec_data.get("officer_actions", []), 1):
        print(f"     Action #{idx}: {act}")

    # Step 5: Query Router & Senior Detective Synthesis
    print("\n5. [QUERY ROUTER & SENIOR DETECTIVE BRIEFING INTEGRATION]")
    query_res = await copilot_orchestrator.process_investigator_query(
        user_id="officer_rao",
        role="Investigator",
        prompt="Draft FIR for commercial warehouse robbery at Koramangala 5th Block with verified Aadhaar card"
    )

    print(f"     • Classified Intent : {query_res.get('intent')}")
    print(f"     • Detective Persona : {query_res.get('detective_persona', {}).get('badge_title')}")
    print(f"     • Field Summary     : {query_res.get('brain_summary')}")
    print("\n   [SENIOR DETECTIVE BRIEFING OUTPUT]")
    print(query_res.get("response"))

    # Step 6: Final Officer Verification & Registration Approval
    print("\n6. [OFFICER APPROVAL & OFFICIAL FIR REGISTRATION]")
    approve_req = FIRApproveRequest(
        user_id="officer_rao",
        role="Supervisor",
        draft_id=draft_data.get("draft_id", "DRAFT-FIR-2026-9999"),
        police_officer_badge="INSP-8831",
        approval_notes="Aadhaar OCR verified (XXXX-XXXX-4921), complainant identity matches Vikram Malhotra. Approved for registration."
    )
    registration = await handle_fir_approve(approve_req)

    print(f"     • Final Status   : {registration.get('status')}")
    print(f"     • Registered FIR : {registration.get('official_fir_id')}")
    print(f"     • Approved By    : {registration.get('approved_by')}")
    print(f"     • Tracking ID    : {registration.get('tracking_id')}")
    print(f"     • System Message : {registration.get('message')}")

    print("=" * 85)

if __name__ == "__main__":
    asyncio.run(run_file_fir_case_test())
