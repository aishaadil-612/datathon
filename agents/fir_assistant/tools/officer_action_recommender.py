import logging
from typing import Dict, Any, List

logger = logging.getLogger("argus.agents.fir_assistant.officer_action_recommender")

async def execute_officer_action_recommender(
    fir_draft: Dict[str, Any],
    verification_res: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Generates structured action items for police officers based on the FIR draft and authenticity report.
    """
    logger.info("Executing Officer Action Recommender tool")
    draft_data = fir_draft.get("fir_draft", fir_draft)
    risk_info = verification_res.get("fraud_risk_assessment", {})
    cognizable = draft_data.get("cognizable_offence", True)
    unit = draft_data.get("recommended_routing_unit", "Law & Order Division")
    risk_level = risk_info.get("risk_level", "LOW")

    recommended_actions: List[str] = []

    if cognizable:
        recommended_actions.append("REGISTER_FIR_IMMEDIATELY: Cognizable offence confirmed under legal sections. Proceed with official registration.")
    else:
        recommended_actions.append("START_PRELIMINARY_INQUIRY: Non-cognizable complaint. Conduct preliminary inquiry before filing NCR or seeking Magistrate order.")

    recommended_actions.append(f"ASSIGN_SPECIALIZED_UNIT: Route complaint and draft FIR to '{unit}' for immediate field investigation.")

    if risk_level == "HIGH":
        recommended_actions.append("ESCALATE_EMERGENCY_RISK: High fraud or duplicate risk detected. Officer verification of identity required before approval.")
    elif risk_level == "MEDIUM":
        recommended_actions.append("VERIFY_DIGITAL_EVIDENCE: Validate digital uploads and confirm timestamp details with complainant.")
    else:
        recommended_actions.append("NOTIFY_COMPLAINANT: Issue official digital acknowledgement and Tracking ID once approved.")

    recommended_actions.append("PRESERVE_AUDIT_LOG: Maintain immutable append-only audit trail for all verification and approval decisions.")

    return {
        "status": "RECOMMENDATIONS_GENERATED",
        "officer_actions": recommended_actions,
        "assigned_unit": unit,
        "preliminary_inquiry_required": not cognizable or risk_level == "HIGH",
        "human_in_loop_status": "AWAITING_OFFICER_SIGNATURE"
    }
