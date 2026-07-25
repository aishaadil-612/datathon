import pytest
from agents.fir_assistant.agent import fir_assistant_agent
from agents.copilot.orchestrator import query_router_agent

@pytest.mark.asyncio
async def test_fir_assistant_aadhaar_ocr():
    aadhaar_text = "Government of India Name: Rajesh Kumar DOB: 15/08/1990 Male 5839 2910 4921"
    res = await fir_assistant_agent.run(
        "aadhaar_ocr",
        user_id="citizen1",
        role="Investigator",
        aadhaar_input=aadhaar_text,
        complainant_name="Rajesh Kumar"
    )
    assert res["success"] is True
    data = res["data"]
    assert data["aadhaar_verified"] is True
    assert data["masked_aadhaar_number"] == "XXXX-XXXX-4921"
    assert data["name_match_score"] >= 0.5

@pytest.mark.asyncio
async def test_fir_assistant_complaint_intake():
    res = await fir_assistant_agent.run(
        "complaint_intake",
        user_id="citizen1",
        role="Investigator",
        complaint_text="My name is Rajesh Kumar. On yesterday night at Indiranagar, two men on a motorbike stole my gold chain and wallet.",
        aadhaar_input="Government of India Name: Rajesh Kumar DOB: 15/08/1990 Male 5839 2910 4921"
    )
    assert res["success"] is True
    data = res["data"]
    assert data["status"] == "COMPLAINT_PARSED"
    assert data["extracted_entities"]["complainant"] == "Rajesh Kumar"
    assert data["extracted_entities"]["location"] == "Indiranagar"
    assert data["aadhaar_ocr_verification"]["aadhaar_verified"] is True

@pytest.mark.asyncio
async def test_fir_assistant_fir_drafter():
    res = await fir_assistant_agent.run(
        "fir_drafter",
        user_id="officer1",
        role="Investigator",
        complaint_text="Cyber phishing scam via fake UPI refund link."
    )
    assert res["success"] is True
    draft = res["data"]["fir_draft"]
    assert draft["status"] == "PENDING_POLICE_APPROVAL"
    assert draft["cognizable_offence"] is True
    assert "Cyber Crime & Financial Fraud" in draft["crime_category"]
    assert "BNS Section 318 (Cheating)" in draft["applicable_legal_sections"]["bns_sections"]

@pytest.mark.asyncio
async def test_fir_assistant_authenticity_verifier():
    res = await fir_assistant_agent.run(
        "authenticity_verifier",
        user_id="officer1",
        role="Investigator",
        complaint_text="Standard theft incident at MG Road."
    )
    assert res["success"] is True
    data = res["data"]
    assert data["status"] == "VERIFICATION_COMPLETE"
    assert data["fraud_risk_assessment"]["risk_level"] in ["LOW", "MEDIUM", "HIGH"]

@pytest.mark.asyncio
async def test_fir_assistant_full_pipeline():
    res = await fir_assistant_agent.run(
        "full_fir_pipeline",
        user_id="officer1",
        role="Investigator",
        complaint_text="Draft FIR for stolen SUV KA-03-MN-4921 at Whitefield Tech Park.",
        aadhaar_input="Government of India Name: Citizen DOB: 01/01/1990 1234 5678 9012"
    )
    assert res["success"] is True
    data = res["data"]
    assert "intake" in data
    assert "draft" in data
    assert "verifier" in data
    assert "recommender" in data

def test_query_router_fir_intent():
    assert query_router_agent.classify_intent("Draft FIR for cyber phishing fraud") == "FIR_ASSISTANT"
    assert query_router_agent.classify_intent("File FIR complaint regarding stolen vehicle") == "FIR_ASSISTANT"
    assert query_router_agent.classify_intent("First Information Report registration for theft") == "FIR_ASSISTANT"

@pytest.mark.asyncio
async def test_query_router_fir_assistant_execution():
    res = await query_router_agent.process_investigator_query(
        user_id="investigator1",
        role="Investigator",
        prompt="Draft FIR for cyber phishing scam using fake UPI link"
    )
    assert res["intent"] == "FIR_ASSISTANT"
    assert res["tool_result"]["success"] is True
    assert "AI FIR Assistant" in res["brain_summary"] or "PENDING_POLICE_APPROVAL" in res["brain_summary"]
