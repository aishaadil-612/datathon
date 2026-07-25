import pytest
from agents.analytics.agent import analytics_agent

@pytest.mark.asyncio
async def test_analytics_hotspots():
    res = await analytics_agent.run("hotspot_detector", user_id="investigator1", role="Investigator", region="Bengaluru Urban")
    assert res["success"] is True
    assert res["data"]["region"] == "Bengaluru Urban"
    assert len(res["data"]["hotspots"]) > 0

@pytest.mark.asyncio
async def test_analytics_risk_scorer():
    res = await analytics_agent.run("risk_scorer", user_id="investigator1", role="Investigator", location_or_suspect="Central District")
    assert res["success"] is True
    assert res["data"]["risk_category"] == "CRITICAL"

@pytest.mark.asyncio
async def test_analytics_early_warning_forecasting():
    res = await analytics_agent.run("early_warning_forecasting", user_id="investigator1", role="Investigator", region="Bengaluru Urban")
    assert res["success"] is True
    assert "forecasting_periods" in res["data"]
    assert len(res["data"]["forecasting_periods"]) == 3
    assert res["data"]["model_used"].startswith("XGBoost")
