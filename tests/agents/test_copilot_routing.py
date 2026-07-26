import pytest
from agents.copilot.orchestrator import query_router_agent

def test_query_router_intent_classification():
    assert query_router_agent.classify_intent("hi") == "GREETING"
    assert query_router_agent.classify_intent("hello") == "GREETING"
    assert query_router_agent.classify_intent("Show crime hotspots in Indiranagar") == "ANALYTICS"
    assert query_router_agent.classify_intent("Find suspect graph network for P-101") == "CASE_INTEL"
    assert query_router_agent.classify_intent("Convert Cypher query MATCH (n) RETURN n") == "NL2CYPHER"
    assert query_router_agent.classify_intent("Find FIR records related to vehicle KA-01") == "NL2SQL"

def test_query_router_kannada_detection():
    assert query_router_agent.is_kannada("ಆರೋಪಿಗಳು ನಕಲಿ ಬ್ಯಾಂಕ್ ಆಪ್ ಬಳಸಿ ವಂಚನೆ ಮಾಡಿದ್ದಾರೆ") is True
    assert query_router_agent.is_kannada("Show crime hotspots in Bengaluru") is False

@pytest.mark.asyncio
async def test_query_router_greeting_processing():
    res = await query_router_agent.process_investigator_query(
        user_id="investigator_user_1",
        role="investigator",
        prompt="hi"
    )
    assert res["intent"] == "GREETING"
    assert "Chief Detective V. R. Rao" in res["response"]
    assert "Greetings, investigator" in res["response"]

@pytest.mark.asyncio
async def test_query_router_kannada_pre_translation():
    res = await query_router_agent.process_investigator_query(
        user_id="investigator1",
        role="Investigator",
        prompt="ಸೈಬರ್ ವಂಚನೆ ಮತ್ತು ಅಕ್ರಮ ವಹಿವಾಟು"
    )
    assert res["intent"] in ["NL2SQL", "ANALYTICS", "CASE_INTEL", "RAG"]
    assert res["tool_result"]["success"] is True
    # Check that IndicTrans2 pre-translation step was recorded
    step_phases = [step["phase"] for step in res["reasoning_steps"]]
    assert "KANNADA_TRANSLATION" in step_phases
