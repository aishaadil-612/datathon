import logging
from typing import Dict, Any, List
from agents.analytics.tools.risk_scorer import execute_risk_scorer

logger = logging.getLogger("argus.agents.tools.early_warning")

async def execute_early_warning_forecasting(location_or_region: str = "Bengaluru Urban") -> Dict[str, Any]:
    """Reuses single XGBoost gradient-boosted risk scoring model output for early-warning forecasting."""
    logger.info(f"Generating Early-Warning Crime Forecast for region: '{location_or_region}'")

    # Reuse XGBoost risk scorer model output
    risk_output = await execute_risk_scorer(location_or_region)
    base_score = risk_output.get("risk_score", 0.85)

    forecast_periods = [
        {"period": "Next 24 Hours", "projected_risk_score": round(base_score, 2), "alert_level": "HIGH"},
        {"period": "Next 7 Days", "projected_risk_score": round(min(1.0, base_score * 1.05), 2), "alert_level": "CRITICAL"},
        {"period": "Next 30 Days", "projected_risk_score": round(min(1.0, base_score * 1.10), 2), "alert_level": "CRITICAL"}
    ]

    return {
        "region": location_or_region,
        "model_used": "XGBoost Gradient Boosted Classifier (Reused for Early-Warning Forecasting)",
        "base_risk_score": base_score,
        "forecasting_periods": forecast_periods,
        "recommended_action": "Deploy high-density patrol in Koramangala 5th Block and monitor bank ATM kiosks."
    }
