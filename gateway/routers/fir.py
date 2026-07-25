import logging
from typing import Dict, Any, Optional
from pydantic import BaseModel
from agents.fir_assistant.agent import fir_assistant_agent

logger = logging.getLogger("argus.gateway.fir")

class ComplaintIntakeRequest(BaseModel):
    user_id: str = "citizen1"
    role: str = "Investigator"
    complaint_text: str
    channel: str = "web_portal"
    aadhaar_input: Optional[str] = None

class AadhaarOCRRequest(BaseModel):
    user_id: str = "citizen1"
    role: str = "Investigator"
    complainant_name: str = "Citizen"
    aadhaar_input: str

class FIRDraftRequest(BaseModel):
    user_id: str = "officer1"
    role: str = "Investigator"
    complaint_text: str
    police_station: str = "Central Police Station"
    aadhaar_input: Optional[str] = None

class AuthenticityVerifyRequest(BaseModel):
    user_id: str = "officer1"
    role: str = "Investigator"
    fir_draft: Dict[str, Any]
    otp_verified: bool = True
    govt_id_verified: bool = True
    gps_validated: bool = True
    aadhaar_input: Optional[str] = None

class FIRApproveRequest(BaseModel):
    user_id: str = "officer1"
    role: str = "Supervisor"
    draft_id: str
    police_officer_badge: str = "OFF-4029"
    approval_notes: str = "Verified complainant identity and evidence logs. Approved for FIR registration."

async def handle_complaint_intake(req: ComplaintIntakeRequest) -> Dict[str, Any]:
    return await fir_assistant_agent.run(
        "complaint_intake",
        req.user_id,
        req.role,
        complaint_text=req.complaint_text,
        channel=req.channel,
        aadhaar_input=req.aadhaar_input
    )

async def handle_aadhaar_ocr(req: AadhaarOCRRequest) -> Dict[str, Any]:
    return await fir_assistant_agent.run(
        "aadhaar_ocr",
        req.user_id,
        req.role,
        aadhaar_input=req.aadhaar_input,
        complainant_name=req.complainant_name
    )

async def handle_fir_draft(req: FIRDraftRequest) -> Dict[str, Any]:
    return await fir_assistant_agent.run(
        "fir_drafter",
        req.user_id,
        req.role,
        complaint_text=req.complaint_text,
        station=req.police_station,
        aadhaar_input=req.aadhaar_input
    )

async def handle_verify_authenticity(req: AuthenticityVerifyRequest) -> Dict[str, Any]:
    return await fir_assistant_agent.run(
        "authenticity_verifier",
        req.user_id,
        req.role,
        fir_draft=req.fir_draft,
        otp_verified=req.otp_verified,
        govt_id_verified=req.govt_id_verified,
        gps_validated=req.gps_validated,
        aadhaar_input=req.aadhaar_input
    )

async def handle_fir_approve(req: FIRApproveRequest) -> Dict[str, Any]:
    logger.info(f"Officer '{req.police_officer_badge}' ({req.user_id}) approving FIR Draft '{req.draft_id}'")
    return {
        "status": "REGISTERED",
        "draft_id": req.draft_id,
        "official_fir_id": req.draft_id.replace("DRAFT-", ""),
        "approved_by": req.police_officer_badge,
        "officer_user_id": req.user_id,
        "approval_notes": req.approval_notes,
        "tracking_id": f"TRK-{req.draft_id[-4:]}-2026",
        "message": f"FIR '{req.draft_id.replace('DRAFT-', '')}' has been officially registered and dispatched to station active queue."
    }
