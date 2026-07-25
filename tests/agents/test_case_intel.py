import pytest
from agents.case_intel.agent import case_intel_agent

@pytest.mark.asyncio
async def test_case_intel_network_analysis():
    res = await case_intel_agent.run("network_analysis", user_id="investigator1", role="Investigator", suspect_id="P-101")
    assert res["success"] is True
    assert "data" in res
    assert res["data"]["suspect_id"] == "P-101"
    assert len(res["data"]["nodes"]) > 0

@pytest.mark.asyncio
async def test_case_intel_mo_feature_vector():
    res = await case_intel_agent.run("mo_feature_vector", user_id="investigator1", role="Investigator", fir_id="FIR-2026-001")
    assert res["success"] is True
    assert "data" in res
    assert res["data"]["target_fir"] == "FIR-2026-001"
    assert "target_mo_vector" in res["data"]
    assert len(res["data"]["similar_cases"]) > 0
