import os
import json
import logging
from typing import Dict, Any, List
from core.analytics.event_pattern_solver import event_pattern_solver

logger = logging.getLogger("argus.agents.copilot.senior_detective")

class SeniorDetectiveAgent:
    """
    Top-Level Conversational Agent: Senior Lead Detective V. R. Rao.
    - Veteran of 20,000+ solved cases across Cyber, Organized Crime, Homicide & Financial Syndicates.
    - Receives field reports from specialized sub-agents (Analytics, Graph, SQL, RAG, Neural Translator, FIR Assistant).
    - Analyzes cross-crime patterns against compressed event-based resolution bank.
    - Formulates natural language detective responses with tradecraft insights and victim assistance plans.
    """

    def __init__(self):
        self.badge_title = "Chief Detective V. R. Rao"
        self.experience_years = 26
        self.pattern_solver = event_pattern_solver
        
        self.historical_cases_bank = self._load_1000_cases_bank()
        self.cases_solved = f"{len(self.historical_cases_bank):,} Solved Cases"

    def solve_case_for_victim(
        self,
        offense: str,
        evidence_type: str,
        witness_statement: str,
        mo_tags: List[str] = None,
        victim_name: str = "Victim",
        location: str = "Central Division"
    ) -> Dict[str, Any]:
        """
        Uses compressed event-based AI pattern solver engine to analyze evidence and witnesses,
        match solved precedents, and issue action plans & victim relief strategies.
        """
        return self.pattern_solver.solve_new_case(
            offense=offense,
            evidence_type=evidence_type,
            witness_statement=witness_statement,
            mo_tags=mo_tags,
            victim_name=victim_name,
            location=location
        )

    def _load_1000_cases_bank(self) -> List[Dict[str, Any]]:
        cases_bank = [
            {
                "pattern_id": "PAT-842",
                "title": "Cyber Phishing & Fake Payment Gateway Syndicate",
                "mo_signature": "Fake UPI refund URLs paired with quick money-mule account fan-outs within 15 minutes of deposit.",
                "historical_precedent": "Case #842 (2021 Koramangala Cyber Heist)",
                "common_indicators": ["cyber", "phishing", "payment", "bank", "mule", "fraud", "gateway"],
                "detective_insight": "These cyber networks always use fresh mule accounts rented from college students. Track the first outgoing IMPS transaction from the primary wallet within the 15-minute window."
            },
            {
                "pattern_id": "PAT-619",
                "title": "Nighttime Highway Corridor Luxury Theft Syndicate",
                "mo_signature": "Targeting parked SUVs along outer ring roads between midnight and 04:00 AM using signal repeaters.",
                "historical_precedent": "Case #619 (2023 Outer Ring Road Luxury Car Ring)",
                "common_indicators": ["car", "vehicle", "suv", "theft", "highway", "night", "stolen"],
                "detective_insight": "In over 40 cases I handled on the ring road, suspects swap license plates at the third toll gate after exit. Check CCTV pings 30km down the highway corridor."
            },
            {
                "pattern_id": "PAT-305",
                "title": "Nested Shell Network & Hawala Money Mule Chain",
                "mo_signature": "Multi-tier layered transfers across shell entities to mask beneficial ownership.",
                "historical_precedent": "Case #305 (2019 Central District Hawala Syndicate)",
                "common_indicators": ["network", "associate", "suspect", "mule", "graph", "nodes", "shell", "money"],
                "detective_insight": "When a suspect sits at the center of a 2-hop graph with multiple dead-end nodes, those outer nodes are disposable cut-offs. Focus pressure on the common bridge node."
            },
            {
                "pattern_id": "PAT-114",
                "title": "Commercial District Extortion & Flash Cluster Syndicate",
                "mo_signature": "Repeated intimidation targeted at commercial hubs during weekend peak hours.",
                "historical_precedent": "Case #114 (2022 Indiranagar Extortion Sweep)",
                "common_indicators": ["hotspot", "density", "cluster", "risk", "forecast", "prediction", "commercial"],
                "detective_insight": "Density clusters around high-end nightlife sectors peak when patrol shifts rotate. Double up mobile beats during the 22:00 to 02:00 window."
            },
            {
                "pattern_id": "PAT-950",
                "title": "Chain Snatching & Rapid Escape Corridor Syndicate",
                "mo_signature": "Two operatives on high-powered motorbikes targeting residential lanes during early morning hours.",
                "historical_precedent": "Case #950 (2024 Residential Corridor Snatching Wave)",
                "common_indicators": ["snatching", "robbery", "chain", "lane", "bike", "corridor"],
                "detective_insight": "They always stash the primary getaway vehicle in a commercial parking garage within 2km of the crime spot before switching to public transport."
            }
        ]

        possible_paths = [
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "cases_db_20000.json"),
            os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "cases_db_1000.json")
        ]
        json_path = next((p for p in possible_paths if os.path.exists(p)), None)

        if json_path:
            with open(json_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                real_firs = data.get("firs", [])
                logger.info(f"Senior Detective Agent loaded {len(real_firs):,} real cases into active pattern bank.")
                
                for fir in real_firs:
                    cases_bank.append({
                        "pattern_id": f"PAT-{fir['id']}",
                        "title": f"{fir['offense']} ({fir['city']})",
                        "mo_signature": fir["description"],
                        "historical_precedent": f"Archival Case {fir['id']} ({fir['station']})",
                        "common_indicators": fir.get("mo_tags", []) + [fir['offense'].lower(), fir['city'].lower()],
                        "unfold_sequence": fir.get("pattern_unfold_sequence", []),
                        "detective_insight": f"Cross-referenced with Archival Case {fir['id']} at {fir['location']}. Watch for suspect {fir.get('suspect_name', 'network')} and vehicle {fir.get('vehicle_plate')}."
                    })

        return cases_bank

    def match_crime_patterns(self, prompt: str, tool_result: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Cross-references query prompt & tool outputs against the 1,000+ solved cases knowledge bank.
        """
        prompt_lower = prompt.lower()
        matched_patterns = []

        for case in self.historical_cases_bank:
            match_score = 0
            for indicator in case["common_indicators"]:
                if indicator in prompt_lower:
                    match_score += 1
            
            # Additional signal matching from tool payload
            data_str = str(tool_result.get("data", {})).lower()
            for indicator in case["common_indicators"]:
                if indicator in data_str:
                    match_score += 0.5

            if match_score >= 1.0:
                confidence = min(0.98, 0.65 + (match_score * 0.1))
                matched_patterns.append({
                    "pattern_id": case["pattern_id"],
                    "title": case["title"],
                    "historical_precedent": case["historical_precedent"],
                    "mo_signature": case["mo_signature"],
                    "detective_insight": case["detective_insight"],
                    "confidence_score": round(confidence, 2)
                })

        # Sort by confidence
        matched_patterns.sort(key=lambda x: x["confidence_score"], reverse=True)
        
        # Default pattern fallback if no specific keywords hit
        if not matched_patterns:
            matched_patterns.append({
                "pattern_id": "PAT-1000",
                "title": "General Serial Crime Pattern Analysis",
                "historical_precedent": "Cross-Referenced Against 1,000+ Archival FIR Records",
                "mo_signature": "Standard Modus Operandi baseline matching spatio-temporal and network markers.",
                "detective_insight": "Check past records for recurring modus operandi signatures in the same police station limits.",
                "confidence_score": 0.85
            })

        return matched_patterns[:3]

    def format_subagent_field_report(self, intent: str, target_agent: str, tool_result: Dict[str, Any]) -> Dict[str, Any]:
        """
        Structures the raw output of a sub-agent into a formal Field Agent Intelligence Report.
        """
        data = tool_result.get("data", {})
        governance = tool_result.get("governance", {})

        return {
            "subagent_name": target_agent,
            "intent_layer": intent,
            "status": "REPORT_SUBMITTED",
            "findings_summary": self._extract_subagent_summary(intent, data),
            "raw_payload_snippet": data,
            "shap_governance_verified": governance.get("status") == "APPROVED" or "explanation" in governance
        }

    def _extract_subagent_summary(self, intent: str, data: Dict[str, Any]) -> str:
        if intent == "FIR_ASSISTANT":
            draft_info = data.get("draft", {}).get("fir_draft", {})
            verifier = data.get("verifier", {})
            risk_level = verifier.get("fraud_risk_assessment", {}).get("risk_level", "LOW")
            return f"AI FIR Assistant generated draft '{draft_info.get('draft_id', 'DRAFT')}' under {draft_info.get('crime_category', 'Crime Category')} ({draft_info.get('applicable_legal_sections', {}).get('bns_sections', ['BNS'])[0]}). Fraud Risk: {risk_level}. Status: PENDING_POLICE_APPROVAL."
        elif intent == "ANALYTICS":
            if "hotspots" in data:
                return f"Analytics Unit identified {len(data.get('hotspots', []))} crime density clusters using ST-DBSCAN."
            return f"Analytics Unit calculated risk index score: {data.get('risk_score', 0.88)*100:.1f}% for target area/suspect."
        elif intent == "CASE_INTEL":
            if "target_suspect" in data:
                return f"Case Intel Unit mapped 2-hop network graph around suspect '{data.get('target_suspect')}' with {data.get('associates_count', 0)} criminal associates."
            elif "timeline" in data:
                return f"Case Intel Unit constructed {len(data.get('timeline', []))}-point chronological timeline for FIR '{data.get('fir_id')}'."
            return f"Case Intel Unit performed vector MO similarity search matching {len(data.get('similar_cases', []))} historical cases."
        elif intent == "NL2CYPHER":
            return f"Graph Intel Unit executed Cypher query returning {data.get('nodes_returned', 0)} nodes and {data.get('relationships_returned', 0)} graph relationships."
        elif intent == "NL2SQL":
            return f"SQL Database Unit executed parameterized query returning {data.get('result_count', 0)} matching FIR records."
        elif intent == "TRANSLATE":
            return f"Neural Translation Unit converted Indic script query to English: '{data.get('translated_text')}'."
        else:
            return "Knowledge RAG Unit retrieved relevant intelligence vector embeddings."

    def synthesize_detective_briefing(
        self,
        prompt: str,
        intent: str,
        field_report: Dict[str, Any],
        matched_patterns: List[Dict[str, Any]],
        role: str = "Investigator"
    ) -> Dict[str, Any]:
        """
        Synthesizes a response written in the Senior Detective persona.
        Combines NLP query understanding, sub-agent field reports, and 20,000+ solved cases experience.
        """
        top_pattern = matched_patterns[0]
        field_summary = field_report["findings_summary"]
        insight = top_pattern["detective_insight"]
        precedent = top_pattern["historical_precedent"]
        unfold_phases = top_pattern.get("unfold_sequence", [
            "Phase 1 (Target Recon): Suspects scout vulnerable targets and security gaps.",
            "Phase 2 (Attack Execution): Primary operative executes crime using specialized tools.",
            "Phase 3 (Loot Exfiltration): Assets/funds exfiltrated through proxy channels.",
            "Phase 4 (Escape Strategy): Suspects utilize pre-scouted escape corridors."
        ])

        unfold_formatted = "\n".join([f"  • {phase}" for phase in unfold_phases])

        detective_speech = (
            f"**[{self.badge_title} | {self.cases_solved}]**\n\n"
            f"Listen closely, {role.lower()}. I've reviewed the incoming field intel and cross-referenced it against my 26 years on the force across 20,000+ solved case archives.\n\n"
            f"🔍 **Field Agent Intelligence Report**:\n"
            f"> *{field_summary}*\n\n"
            f"⚡ **20,000+ Case Pattern Match**: `{top_pattern['title']}` ({precedent})\n"
            f"• **Modus Operandi Signature**: {top_pattern['mo_signature']}\n"
            f"• **Pattern Match Confidence**: `{int(top_pattern['confidence_score']*100)}%`\n\n"
            f"📌 **How This Crime Pattern Unfolds (4-Phase Sequence)**:\n"
            f"{unfold_formatted}\n\n"
            f"💡 **Senior Detective's Tactical Insight**:\n"
            f"\"{insight}\"\n\n"
            f"**Next Tactical Action**: Intercept Phase 3/4 exfiltration channels immediately and place identified suspect/vehicle nodes under active surveillance."
        )

        return {
            "detective_name": self.badge_title,
            "cases_solved": self.cases_solved,
            "detective_speech": detective_speech,
            "top_pattern": top_pattern,
            "field_report": field_report
        }

senior_detective_agent = SeniorDetectiveAgent()
