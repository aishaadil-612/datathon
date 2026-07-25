import pytest
import pytest_asyncio
from agents.copilot.senior_detective import senior_detective_agent, SeniorDetectiveAgent
from agents.copilot.orchestrator import copilot_orchestrator

def test_senior_detective_initialization():
    agent = SeniorDetectiveAgent()
    assert agent.badge_title == "Chief Detective V. R. Rao"
    assert "Solved Cases" in agent.cases_solved
    assert len(agent.historical_cases_bank) >= 1000

def test_crime_pattern_matching_cyber():
    prompt = "Find money mule accounts and cyber phishing payment gateway links"
    tool_result = {"data": {"result": "phishing link found"}}
    matches = senior_detective_agent.match_crime_patterns(prompt, tool_result)
    assert len(matches) > 0
    assert matches[0]["pattern_id"] == "PAT-842"
    assert "Phishing" in matches[0]["title"]

def test_crime_pattern_matching_vehicle_theft():
    prompt = "Stolen luxury SUV along highway night corridor"
    tool_result = {"data": {"theft_type": "vehicle"}}
    matches = senior_detective_agent.match_crime_patterns(prompt, tool_result)
    assert len(matches) > 0
    assert matches[0]["pattern_id"] == "PAT-619"

def test_subagent_field_report_formatting():
    tool_result = {
        "data": {"hotspots": [{"location_name": "Koramangala", "density_score": 0.92}]},
        "governance": {"status": "APPROVED", "explanation": {"natural_language_rationale": "RBAC Passed"}}
    }
    report = senior_detective_agent.format_subagent_field_report("ANALYTICS", "Analytics Unit", tool_result)
    assert report["subagent_name"] == "Analytics Unit"
    assert report["intent_layer"] == "ANALYTICS"
    assert "ST-DBSCAN" in report["findings_summary"]
    assert report["shap_governance_verified"] is True

def test_detective_briefing_synthesis():
    prompt = "Who are the key associates of suspect P-101 in money mule graph?"
    field_report = {
        "subagent_name": "Case Intelligence Unit",
        "findings_summary": "Mapped 2-hop network graph around suspect 'P-101'."
    }
    matches = senior_detective_agent.match_crime_patterns(prompt, {})
    briefing = senior_detective_agent.synthesize_detective_briefing(prompt, "CASE_INTEL", field_report, matches, role="Investigator")
    
    assert briefing["detective_name"] == "Chief Detective V. R. Rao"
    assert "Solved Cases" in briefing["cases_solved"]
    assert "Chief Detective V. R. Rao" in briefing["detective_speech"]
    assert "Case Pattern Match" in briefing["detective_speech"]

@pytest.mark.asyncio
async def test_copilot_orchestrator_with_senior_detective():
    result = await copilot_orchestrator.process_investigator_query(
        user_id="test_inv",
        role="Investigator",
        prompt="Show me network associates of suspect P-101"
    )
    assert result["intent"] == "CASE_INTEL"
    assert "Chief Detective V. R. Rao" in result["response"]
    assert "detective_persona" in result
    assert result["detective_persona"]["badge_title"] == "Chief Detective V. R. Rao"
    assert len(result["matched_patterns"]) > 0
    assert result["field_report"]["status"] == "REPORT_SUBMITTED"
