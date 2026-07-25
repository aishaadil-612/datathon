import pytest
from agents.analytics.tools.hotspot_detector import execute_hotspot_detector
from agents.analytics.tools.risk_scorer import execute_risk_scorer
from agents.case_intel.tools.network_analysis import execute_network_analysis
from agents.case_intel.tools.case_similarity import execute_case_similarity
from agents.copilot.tools.translator import execute_kannada_translate

@pytest.mark.asyncio
async def test_hotspot_detector():
    res = await execute_hotspot_detector(region="Bengaluru Urban")
    assert res["region"] == "Bengaluru Urban"
    assert len(res["hotspots"]) > 0
    assert res["hotspots"][0]["density_score"] > 0.5

@pytest.mark.asyncio
async def test_risk_scorer():
    res = await execute_risk_scorer("Central District")
    assert res["risk_category"] == "CRITICAL"
    assert res["risk_score"] > 0.8

@pytest.mark.asyncio
async def test_network_analysis():
    res = await execute_network_analysis(suspect_id="P-101")
    assert res["suspect_id"] == "P-101"
    assert len(res["nodes"]) > 0

@pytest.mark.asyncio
async def test_case_similarity():
    res = await execute_case_similarity(fir_id="FIR-2026-001")
    assert res["target_fir"] == "FIR-2026-001"
    assert len(res["similar_cases"]) > 0
    assert res["similar_cases"][0]["similarity_score"] > 0.8

@pytest.mark.asyncio
async def test_kannada_translate():
    res = await execute_kannada_translate("ಸೈಬರ್ ವಂಚನೆ ಮತ್ತು ಹಣ ಅಕ್ರಮ ಸಾಗಣೆ ಪ್ರಕರಣಗಳನ್ನು ತೋರಿಸಿ")
    assert res["translated_text"] == "Show cyber fraud and money laundering cases"
