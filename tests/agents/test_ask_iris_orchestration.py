import asyncio
import pytest
from agents.copilot.orchestrator import copilot_orchestrator

def test_ask_iris_two_message_orchestration_flow():
    async def run_flow():
        session_id = "test_session_iris_123"
        
        # -------------------------------------------------------------
        # MESSAGE 1: Complex Cross-Case Analysis Query
        # -------------------------------------------------------------
        msg1_prompt = (
            "Perform cross-case intelligence analysis across active FIRs, vehicle plates, "
            "modus operandi signatures, spatial corridors, and multi-hop criminal networks."
        )
        
        res1 = await copilot_orchestrator.process_investigator_query(
            user_id="test_investigator",
            role="Investigator",
            prompt=msg1_prompt,
            session_id=session_id
        )
        
        # Verifications for Message 1
        assert res1["intent"] != "FIR_ASSISTANT", f"Expected investigator intent, got '{res1['intent']}'"
        assert res1["intent"] in ["CASE_INTEL", "RAG", "NL2CYPHER", "NL2SQL"], f"Unexpected intent: {res1['intent']}"
        assert "INCIDENT COMPLAINT LOGGED" not in res1["response"], "Response incorrectly triggered complaint intake template"
        assert "EVIDENCE REQUESTED FOR MAXIMUM MATCH ACCURACY" not in res1["response"], "Response contained static 99.4% evidence template"
        assert "DATABASE FACTS" in res1["response"], "Response missing DATABASE FACTS section"
        assert res1["confidence"] > 70, f"Expected valid calculated confidence score, got {res1['confidence']}"

        # -------------------------------------------------------------
        # MESSAGE 2: Follow-up Evidence Supply (Containing Fake/Unverified Identifiers)
        # -------------------------------------------------------------
        msg2_prompt = (
            "Here is the additional evidence: getaway vehicle plate KA-01-AB-1234, "
            "transaction reference IMPS-DEMO-847291, and reference FIR-2026-0417. "
            "Validate this evidence against CrimeLens and distinguish investigator evidence from database facts."
        )
        
        res2 = await copilot_orchestrator.process_investigator_query(
            user_id="test_investigator",
            role="Investigator",
            prompt=msg2_prompt,
            session_id=session_id
        )
        
        # Verifications for Message 2
        assert res2["intent"] != "FIR_ASSISTANT", f"Follow-up query incorrectly routed to FIR_ASSISTANT: '{res2['intent']}'"
        assert "INCIDENT COMPLAINT LOGGED" not in res2["response"], "Follow-up response triggered complaint intake template"
        assert "INVESTIGATOR-SUPPLIED EVIDENCE" in res2["response"], "Follow-up response missing INVESTIGATOR-SUPPLIED EVIDENCE section"
        
        # Ensure fake identifier KA-01-AB-1234 is explicitly reported as unverified / not found in CrimeLens
        assert "KA-01-AB-1234" in res2["response"], "KA-01-AB-1234 missing from evidence report"
        assert "no matching vehicle record found" in res2["response"].lower() or "investigator supplied" in res2["response"].lower(), \
            "Unverified identifier was not properly distinguished from database facts"
        
        # -------------------------------------------------------------
        # MESSAGE 3: Identity & Greeting Query
        # -------------------------------------------------------------
        res3 = await copilot_orchestrator.process_investigator_query(
            user_id="test_investigator",
            role="Investigator",
            prompt="who are you? who made you?",
            session_id="test_greeting_session"
        )
        assert res3["intent"] == "GREETING", f"Expected GREETING intent, got '{res3['intent']}'"
        assert "Chief Detective V. R. Rao" in res3["response"]

        return res1, res2, res3

    res1, res2, res3 = asyncio.run(run_flow())
    print("\n========================================================")
    print("REGRESSION TEST PASSED SUCCESSFULLY!")
    print(f"Message 1 Intent: {res1['intent']} | Confidence: {res1['confidence']}%")
    print(f"Message 2 Intent: {res2['intent']} | Session ID: {res2['session_id']}")
    print(f"Message 3 Intent: {res3['intent']} (Greeting/Identity query)")
    print("========================================================\n")
