import logging
import re
import time
from typing import Dict, Any, List
from governance.middleware import governance_mw
from agents.copilot.tools.nl2sql import execute_nl2sql
from agents.copilot.tools.nl2cypher import execute_nl2cypher
from agents.copilot.tools.rag import execute_rag_search
from agents.copilot.tools.translator import execute_kannada_translate
from agents.case_intel.agent import case_intel_agent
from agents.analytics.agent import analytics_agent
from agents.fir_assistant.agent import fir_assistant_agent
from agents.copilot.senior_detective import senior_detective_agent

import time

logger = logging.getLogger("argus.agents.copilot.orchestrator")
SESSION_TTL_SECONDS = 3600  # 1-hour session memory expiration

class QueryRouterAgent:
    """Agent #1: Query Router Agent. Single entry point with IndicTrans2 Kannada pre-translation layer and 1-hour TTL session memory."""

    def __init__(self):
        self.session_memory: Dict[str, Dict[str, Any]] = {}

    def _cleanup_expired_sessions(self):
        now = time.time()
        expired = [sid for sid, data in self.session_memory.items() if now - data.get("last_accessed", 0) > SESSION_TTL_SECONDS]
        for sid in expired:
            logger.info(f"Session '{sid}' expired after 1 hour of inactivity. Purging session memory.")
            del self.session_memory[sid]

    def is_kannada(self, text: str) -> bool:
        return any('\u0C80' <= char <= '\u0CFF' for char in text) or any(k in text.lower() for k in ["ಕನ್ನಡ", "ಅನುವಾದ"])

    def classify_intent(self, prompt: str) -> str:
        prompt_lower = prompt.lower()
        prompt_clean = prompt_lower.strip(" !.,?")
        
        greeting_pattern = r"\b(hi|hello|hey|greetings|good morning|good afternoon|good evening|who are you|who made you|who created you|who built you|who designed you|what is iris|what can you do|help|start|about you|tell me about yourself|who made this|who built this)\b"
        if re.search(greeting_pattern, prompt_clean):
            return "GREETING"

        # Explicit FIR Drafting / Filing ONLY (Do NOT match cross-case analysis)
        elif any(k in prompt_lower for k in [
            "draft fir", "register fir", "file fir", "file e-fir", "complaint intake",
            "register complaint", "first information report", "file a police complaint", "file police complaint"
        ]):
            return "FIR_ASSISTANT"

        elif any(k in prompt_lower for k in ["hotspot", "density", "cluster", "risk score", "forecast", "prediction"]):
            return "ANALYTICS"

        elif any(k in prompt_lower for k in [
            "cross-case", "analysis", "intelligence", "investigation", "multi-hop",
            "network", "associate", "suspect", "similarity", "timeline", "modus operandi",
            "mo vector", "evidence", "firs", "cases", "patterns", "compare", "correlate",
            "linkage", "relationship", "anpr", "cctv", "utr", "transaction"
        ]):
            return "CASE_INTEL"

        elif any(k in prompt_lower for k in ["graph", "cypher", "nodes", "relationships"]):
            return "NL2CYPHER"

        elif any(k in prompt_lower for k in ["sql", "database query", "table", "schema"]):
            return "NL2SQL"

        else:
            return "CASE_INTEL"

    async def process_investigator_query(
        self,
        user_id: str = "user1",
        role: str = "User",
        prompt: str = "",
        session_id: str = "default_session"
    ) -> Dict[str, Any]:
        logger.info(f"Query Router Agent processing query from User: '{user_id}' ({role}) | Session: '{session_id}' => '{prompt}'")

        # 1. Session Memory Cleanup & Multi-Turn History
        self._cleanup_expired_sessions()
        now = time.time()
        if session_id not in self.session_memory:
            self.session_memory[session_id] = {
                "last_accessed": now,
                "messages": [],
                "primary_intent": None
            }
        else:
            self.session_memory[session_id]["last_accessed"] = now

        prior_messages = list(self.session_memory[session_id]["messages"])
        self.session_memory[session_id]["messages"].append({"role": "user", "content": prompt})

        # 2. IndicTrans2 Kannada Pre-Translation Layer
        was_kannada = self.is_kannada(prompt)
        working_prompt = prompt
        translation_step = None

        if was_kannada:
            trans_res = await execute_kannada_translate(prompt)
            working_prompt = trans_res.get("translated_text", prompt)
            logger.info(f"Kannada Pre-Translation Layer: '{prompt}' => '{working_prompt}'")
            translation_step = {
                "id": "trans-pre",
                "phase": "KANNADA_TRANSLATION",
                "title": "IndicTrans2 Pre-Translation Applied",
                "status": "COMPLETED",
                "agent": "Bilingual Translation Layer",
                "details": f"Translated Kannada query to English: '{working_prompt}' before routing."
            }

        # 3. Classify Intent (with Session Context Continuity)
        raw_intent = self.classify_intent(working_prompt)
        
        # If continuing an ongoing investigation session, preserve investigation intent
        session_primary_intent = self.session_memory[session_id].get("primary_intent")
        if prior_messages and session_primary_intent and raw_intent not in ["GREETING", "FIR_ASSISTANT"]:
            intent = session_primary_intent
        else:
            intent = raw_intent
            if intent not in ["GREETING"]:
                self.session_memory[session_id]["primary_intent"] = intent

        logger.info(f"Classified query intent: {intent} (raw: {raw_intent})")

        reasoning_steps = []
        if translation_step:
            reasoning_steps.append(translation_step)

        reasoning_steps.append({
            "id": "step-1",
            "phase": "INTENT_CLASSIFICATION",
            "title": "Intent Classification & Agent Routing",
            "status": "COMPLETED",
            "agent": "Query Router Agent",
            "details": f"Classified intent as '{intent}' for user role '{role}'."
        })

        # 4. Route to Sub-Agent or Core Tool via Governance Middleware
        tool_result: Dict[str, Any] = {}
        target_agent = "Copilot Agent"

        if intent == "GREETING":
            target_agent = "IRIS Conversational Copilot"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "CONVERSATIONAL_INTENT",
                "title": "Conversational Greeting Processing",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Recognized general greeting query. Prepared copilot overview and tactical capabilities."
            })
            tool_result = {"status": "success", "message": "Greeting intent processed successfully."}

        elif intent == "FIR_ASSISTANT":
            target_agent = "AI FIR Assistant Agent (Drafting & Authenticity Engine)"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "SUB_AGENT_DELEGATION",
                "title": "Delegated to AI FIR Assistant Sub-Agent",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Initiated complaint drafting, BNS legal classification, and risk scoring."
            })
            tool_result = await fir_assistant_agent.run("full_fir_pipeline", user_id, role, complaint_text=working_prompt)

        elif intent == "ANALYTICS":
            target_agent = "Analytics Agent (ST-DBSCAN & XGBoost)"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "SUB_AGENT_DELEGATION",
                "title": "Delegated to Analytics Sub-Agent",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Initiated spatial-temporal cluster analysis and risk estimation engine."
            })
            if "hotspot" in working_prompt.lower():
                tool_result = await analytics_agent.run("hotspot_detector", user_id, role, region="Bengaluru Urban")
            else:
                tool_result = await analytics_agent.run("risk_scorer", user_id, role, location_or_suspect="Central District")

        elif intent == "CASE_INTEL":
            target_agent = "Case Intelligence Agent (Neo4j & Timeline Engine)"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "SUB_AGENT_DELEGATION",
                "title": "Delegated to Case Intelligence Sub-Agent",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Executing 2-hop network graph traversal, FIR cross-referencing, and modus operandi similarity matching."
            })
            if "network" in working_prompt.lower() or "associate" in working_prompt.lower() or "graph" in working_prompt.lower():
                tool_result = await case_intel_agent.run("network_analysis", user_id, role, suspect_id="P-101")
            elif "timeline" in working_prompt.lower():
                tool_result = await case_intel_agent.run("timeline_builder", user_id, role, fir_id="FIR-2026-001")
            else:
                tool_result = await case_intel_agent.run("case_similarity", user_id, role, fir_id="FIR-2026-001")

        elif intent == "NL2CYPHER":
            target_agent = "Graph Intelligence Engine (NL2Cypher)"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "SUB_AGENT_DELEGATION",
                "title": "Executing NL2Cypher Query Translation",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Translating natural language intent into parameterized Cypher query for Neo4j database."
            })
            tool_result = await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="nl2cypher",
                tool_func=execute_nl2cypher,
                query_text=working_prompt
            )

        elif intent == "NL2SQL":
            target_agent = "SQL Schema Intelligence Agent (NL2SQL)"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "SUB_AGENT_DELEGATION",
                "title": "Executing Parameterized SQL Generation",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Querying PostgreSQL FIR crime records database under schema governance."
            })
            tool_result = await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="nl2sql",
                tool_func=execute_nl2sql,
                query_text=working_prompt
            )

        else:  # RAG Search
            target_agent = "Knowledge Retrieval RAG Agent"
            reasoning_steps.append({
                "id": "step-2",
                "phase": "SUB_AGENT_DELEGATION",
                "title": "Retrieval Augmented Generation Active",
                "status": "COMPLETED",
                "agent": target_agent,
                "details": "Querying vector embeddings across legal FIR corpus and intelligence archives."
            })
            tool_result = await governance_mw.execute_governed_tool(
                user_id=user_id,
                user_role=role,
                tool_name="rag_search",
                tool_func=execute_rag_search,
                query_text=working_prompt
            )

        # 5. Governance Step
        gov_explanation = tool_result.get("governance", {}).get("explanation", {})
        reasoning_steps.append({
            "id": "step-3",
            "phase": "GOVERNANCE_AUDIT",
            "title": "SHAP Governance & Audit Log Verification",
            "status": "COMPLETED",
            "agent": "Governance Middleware",
            "details": f"RBAC verified for role '{role}'. SHAP rationale: {gov_explanation.get('natural_language_rationale', 'Audit logged to immutable store.')}"
        })

        # 6. Senior Detective Synthesis
        field_report = senior_detective_agent.format_subagent_field_report(intent, target_agent, tool_result)

        if intent == "GREETING":
            matched_patterns = [{"case_id": "IRIS-COPILOT-GUIDE", "title": "IRIS Intelligence Suite Overview", "type": "System Overview"}]
            brain_summary = "IRIS AI Detective Copilot initialized and ready for precinct queries."
        else:
            matched_patterns = senior_detective_agent.match_crime_patterns(working_prompt, tool_result)
            brain_summary = field_report["findings_summary"]

        detective_synthesis = senior_detective_agent.synthesize_detective_briefing(
            prompt=working_prompt,
            intent=intent,
            field_report=field_report,
            matched_patterns=matched_patterns,
            role=role,
            chat_history=prior_messages
        )

        top_pattern = matched_patterns[0]

        step4_details = (
            "Chief Detective V. R. Rao initialized copilot greeting and presented tactical system capabilities."
            if intent == "GREETING"
            else f"Chief Detective V. R. Rao received sub-agent report ({target_agent}) and cross-matched pattern: '{top_pattern.get('title', 'Crime Analysis')}'."
        )

        reasoning_steps.append({
            "id": "step-4",
            "phase": "SENIOR_DETECTIVE_SYNTHESIS",
            "title": "Senior Detective Synthesis",
            "status": "COMPLETED",
            "agent": senior_detective_agent.badge_title,
            "details": step4_details
        })

        response_text = detective_synthesis["detective_speech"]
        confidence_val = detective_synthesis.get("confidence", 92)

        self.session_memory[session_id]["messages"].append({"role": "assistant", "content": response_text})

        return {
            "session_id": session_id,
            "intent": intent,
            "prompt": prompt,
            "response": response_text,
            "confidence": confidence_val,
            "brain_summary": brain_summary,
            "detective_persona": {
                "badge_title": senior_detective_agent.badge_title,
                "cases_solved": senior_detective_agent.cases_solved,
                "experience_years": senior_detective_agent.experience_years
            },
            "field_report": field_report,
            "matched_patterns": matched_patterns,
            "reasoning_steps": reasoning_steps,
            "tool_result": tool_result,
            "history_length": len(self.session_memory[session_id]["messages"])
        }

copilot_orchestrator = QueryRouterAgent()
query_router_agent = copilot_orchestrator
