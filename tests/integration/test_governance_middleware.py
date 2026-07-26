import pytest
from governance.middleware import governance_mw
from governance.audit_logger import audit_logger
from agents.analytics.tools.hotspot_detector import execute_hotspot_detector

@pytest.mark.asyncio
async def test_governance_wrapper_permitted():
    res = await governance_mw.execute_governed_tool(
        user_id="investigator1",
        user_role="Investigator",
        tool_name="hotspot_detector",
        tool_func=execute_hotspot_detector,
        region="Bengaluru Urban"
    )
    assert res["success"] is True
    assert res["governance"]["compliance_passed"] is True
    assert "explanation" in res["governance"]
    assert "SHAP_LIME_HYBRID" in res["governance"]["explanation"]["explainability_method"]

@pytest.mark.asyncio
async def test_governance_wrapper_unrestricted():
    res = await governance_mw.execute_governed_tool(
        user_id="user1",
        user_role="User",
        tool_name="manage_users",
        tool_func=execute_hotspot_detector
    )
    assert res["success"] is True
    assert res["governance"]["compliance_passed"] is True

@pytest.mark.asyncio
async def test_audit_logger_7_tuple_schema():
    log_entry = await audit_logger.log(
        user_id="investigator1",
        role="Investigator",
        action="TOOL_EXECUTION",
        tool_name="hotspot_detector",
        query_params={"region": "Bengaluru Urban"},
        explanation={"natural_language_rationale": "ST-DBSCAN hotspot verification."},
        compliance_passed=True,
        query_text="Find crime hotspots in Bengaluru Urban",
        records_accessed=3,
        response_content="Hotspot Koramangala 88% risk"
    )
    assert log_entry["user_id"] == "investigator1"
    assert log_entry["role"] == "Investigator"
    assert log_entry["query_text"] == "Find crime hotspots in Bengaluru Urban"
    assert log_entry["agent_invoked"] == "hotspot_detector"
    assert log_entry["records_accessed"] == 3
    assert "timestamp" in log_entry
    assert len(log_entry["response_hash"]) == 64  # SHA-256 hex string length
