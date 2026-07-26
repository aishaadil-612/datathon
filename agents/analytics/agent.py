import logging
from typing import Dict, Any
from governance.middleware import governance_mw
from agents.analytics.tools.hotspot_detector import execute_hotspot_detector
from agents.analytics.tools.risk_scorer import execute_risk_scorer
from agents.analytics.tools.early_warning import execute_early_warning_forecasting

logger = logging.getLogger("argus.agents.analytics")

class AnalyticsAgent:
    """Agent #3: Analytics Agent merging ST-DBSCAN hotspots, XGBoost risk scoring, and early-warning forecasting."""

    async def run(self, action: str, user_id: str = "user1", role: str = "User", **kwargs) -> Dict[str, Any]:
        logger.info(f"Analytics Agent executing action: '{action}' for User: '{user_id}'")

        if action == "hotspot_detector":
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="hotspot_detector",
                tool_func=execute_hotspot_detector,
                region=kwargs.get("region", "Bengaluru Urban")
            )

        elif action == "risk_scorer":
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="risk_scorer",
                tool_func=execute_risk_scorer,
                location_or_suspect=kwargs.get("location_or_suspect", "Indiranagar Sector 2")
            )

        elif action == "early_warning_forecasting":
            return await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="early_warning_forecasting",
                tool_func=execute_early_warning_forecasting,
                location_or_region=kwargs.get("region", "Bengaluru Urban")
            )

        else:
            return {"error": f"Unknown action '{action}' for Analytics Agent."}

analytics_agent = AnalyticsAgent()
