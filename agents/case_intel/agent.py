import logging
from typing import Dict, Any
from governance.middleware import governance_mw
from agents.case_intel.tools.network_analysis import execute_network_analysis
from agents.case_intel.tools.case_similarity import execute_case_similarity
from agents.case_intel.tools.mo_feature_vector import execute_mo_feature_vector
from agents.case_intel.tools.timeline_builder import execute_timeline_builder

logger = logging.getLogger("argus.agents.case_intel")

class CaseIntelligenceAgent:
    """Agent #2: Case Intelligence Agent merging explicit relationships (Neo4j) + MO Feature Vector vector similarity."""

    async def run(self, action: str, user_id: str, role: str, **kwargs) -> Dict[str, Any]:
        logger.info(f"Case Intelligence Agent executing action: '{action}' for User: '{user_id}'")

        if action == "network_analysis":
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="network_analysis",
                tool_func=execute_network_analysis,
                suspect_id=kwargs.get("suspect_id", "P-101")
            )

        elif action in ["mo_feature_vector", "case_similarity"]:
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="mo_feature_vector",
                tool_func=execute_mo_feature_vector,
                fir_id=kwargs.get("fir_id", "FIR-2026-001")
            )

        elif action == "timeline_builder":
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="timeline_builder",
                tool_func=execute_timeline_builder,
                fir_id=kwargs.get("fir_id", "FIR-2026-001")
            )

        else:
            return {"error": f"Unknown action '{action}' for Case Intelligence Agent."}

case_intel_agent = CaseIntelligenceAgent()
