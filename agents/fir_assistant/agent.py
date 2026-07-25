import logging
from typing import Dict, Any, Optional
from governance.middleware import governance_mw
from agents.fir_assistant.tools.complaint_intake import execute_complaint_intake
from agents.fir_assistant.tools.fir_drafter import execute_fir_drafter
from agents.fir_assistant.tools.authenticity_verifier import execute_authenticity_verifier
from agents.fir_assistant.tools.officer_action_recommender import execute_officer_action_recommender
from agents.fir_assistant.tools.aadhaar_ocr import execute_aadhaar_ocr_verification

logger = logging.getLogger("argus.agents.fir_assistant")

async def execute_full_fir_pipeline(
    complaint_text: str,
    station: str = "Central Police Station",
    aadhaar_input: Optional[str] = None
) -> Dict[str, Any]:
    intake = await execute_complaint_intake(complaint_text, aadhaar_input=aadhaar_input)
    draft = await execute_fir_drafter(intake, station=station)
    verifier = await execute_authenticity_verifier(draft, aadhaar_ocr_res=intake.get("aadhaar_ocr_verification"))
    recommender = await execute_officer_action_recommender(draft, verifier)

    return {
        "intake": intake,
        "draft": draft,
        "verifier": verifier,
        "recommender": recommender
    }

class FIRAssistantAgent:
    """
    Agent #4: AI FIR Assistant Agent.
    Handles complaint intake, Aadhaar card OCR identity verification, FIR drafting (IPC/BNS sections),
    authenticity verification (duplicate check, fraud risk scoring), and officer action recommendation.
    """

    async def run(self, action: str, user_id: str, role: str, **kwargs) -> Dict[str, Any]:
        logger.info(f"FIR Assistant Agent executing action: '{action}' for User: '{user_id}' ({role})")

        if action == "aadhaar_ocr":
            aadhaar_input = kwargs.get("aadhaar_input") or kwargs.get("document") or kwargs.get("text")
            complainant_name = kwargs.get("complainant_name", "Citizen")
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="aadhaar_ocr",
                tool_func=execute_aadhaar_ocr_verification,
                aadhaar_input=aadhaar_input,
                complainant_name=complainant_name
            )

        elif action == "complaint_intake":
            complaint_text = kwargs.get("complaint_text") or kwargs.get("prompt", "Complaint statement submitted.")
            aadhaar_input = kwargs.get("aadhaar_input")
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="complaint_intake",
                tool_func=execute_complaint_intake,
                complaint_text=complaint_text,
                channel=kwargs.get("channel", "web_portal"),
                aadhaar_input=aadhaar_input
            )

        elif action == "fir_drafter":
            complaint_text = kwargs.get("complaint_text") or kwargs.get("prompt", "Complaint statement submitted.")
            intake_res = kwargs.get("intake_res")
            if not intake_res:
                intake_res = await execute_complaint_intake(complaint_text, aadhaar_input=kwargs.get("aadhaar_input"))

            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="fir_drafter",
                tool_func=execute_fir_drafter,
                intake_result=intake_res,
                station=kwargs.get("station", "Central Police Station")
            )

        elif action == "authenticity_verifier":
            fir_draft = kwargs.get("fir_draft")
            intake_res = kwargs.get("intake_res")
            if not fir_draft:
                complaint_text = kwargs.get("complaint_text") or kwargs.get("prompt", "Complaint statement submitted.")
                intake_res = await execute_complaint_intake(complaint_text, aadhaar_input=kwargs.get("aadhaar_input"))
                fir_draft = await execute_fir_drafter(intake_res)

            aadhaar_res = kwargs.get("aadhaar_ocr_res") or (intake_res.get("aadhaar_ocr_verification") if intake_res else None)

            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="authenticity_verifier",
                tool_func=execute_authenticity_verifier,
                fir_draft=fir_draft,
                otp_verified=kwargs.get("otp_verified", True),
                govt_id_verified=kwargs.get("govt_id_verified", True),
                gps_validated=kwargs.get("gps_validated", True),
                aadhaar_ocr_res=aadhaar_res
            )

        elif action == "officer_action_recommender":
            fir_draft = kwargs.get("fir_draft")
            verification_res = kwargs.get("verification_res")
            complaint_text = kwargs.get("complaint_text") or kwargs.get("prompt", "Complaint statement submitted.")

            if not fir_draft:
                intake_res = await execute_complaint_intake(complaint_text, aadhaar_input=kwargs.get("aadhaar_input"))
                fir_draft = await execute_fir_drafter(intake_res)
            if not verification_res:
                verification_res = await execute_authenticity_verifier(fir_draft)

            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="officer_action_recommender",
                tool_func=execute_officer_action_recommender,
                fir_draft=fir_draft,
                verification_res=verification_res
            )

        elif action == "full_fir_pipeline":
            complaint_text = kwargs.get("complaint_text") or kwargs.get("prompt", "Complaint statement submitted.")
            station = kwargs.get("station", "Central Police Station")
            aadhaar_input = kwargs.get("aadhaar_input")

            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="full_fir_pipeline",
                tool_func=execute_full_fir_pipeline,
                complaint_text=complaint_text,
                station=station,
                aadhaar_input=aadhaar_input
            )

        else:
            return {"error": f"Unknown action '{action}' for FIR Assistant Agent."}

fir_assistant_agent = FIRAssistantAgent()
