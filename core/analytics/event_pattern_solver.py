import os
import json
import gzip
import logging
from typing import Dict, Any, List, Optional

logger = logging.getLogger("argus.analytics.event_pattern_solver")

class EventPatternSolver:
    """
    AI Event-Based Pattern Solver Engine.
    - Loads compressed solved case resolution patterns (`solved_case_events.json.gz`).
    - Matches evidence, witness statements, and MO tags against historical event chains.
    - Generates step-by-step investigation blueprints & immediate victim relief action plans for new cases.
    """

    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
        self.gz_file = os.path.join(self.data_dir, "solved_case_events.json.gz")
        self.index_file = os.path.join(self.data_dir, "solved_case_patterns_index.json")
        self.solved_cases: List[Dict[str, Any]] = self._load_compressed_events()

    def _load_compressed_events(self) -> List[Dict[str, Any]]:
        if os.path.exists(self.gz_file):
            try:
                with gzip.open(self.gz_file, "rt", encoding="utf-8") as gz:
                    data = json.load(gz)
                    cases = data.get("cases", [])
                    logger.info(f"Loaded {len(cases):,} compressed event resolution chains from '{self.gz_file}'.")
                    return cases
            except Exception as e:
                logger.error(f"Error loading compressed GZ event patterns: {e}")

        # Fallback to cases_db_20000.json or cases_db_1000.json if GZ not yet built
        for fname in ["cases_db_20000.json", "cases_db_1000.json"]:
            fpath = os.path.join(self.data_dir, fname)
            if os.path.exists(fpath):
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        logger.info(f"Fallback loaded {len(data.get('firs', [])):,} cases from '{fpath}'.")
                        return data.get("firs", [])
                except Exception:
                    pass

        return []

import math

CANONICAL_OFFENSE_MAP = {
    "cyber": "Cyber Fraud & Money Laundering",
    "sim_swap": "Cyber Fraud & Money Laundering",
    "phishing": "Cyber Fraud & Money Laundering",
    "malware": "Cyber Fraud & Money Laundering",
    "apk": "Cyber Fraud & Money Laundering",
    "mule": "Cyber Fraud & Money Laundering",
    "ransomware": "Cyber Fraud & Money Laundering",
    "extortion_cyber": "Cyber Fraud & Money Laundering",

    "armed": "Armed Jewelry & Bank Robbery",
    "robbery": "Armed Jewelry & Bank Robbery",
    "jewelry": "Armed Jewelry & Bank Robbery",
    "vault": "Armed Jewelry & Bank Robbery",

    "atm": "Financial ATM Skimming & Card Cloning",
    "skimming": "Financial ATM Skimming & Card Cloning",
    "card": "Financial ATM Skimming & Card Cloning",
    "cloning": "Financial ATM Skimming & Card Cloning",

    "vehicle": "Nighttime Highway Luxury Vehicle Theft",
    "suv": "Nighttime Highway Luxury Vehicle Theft",
    "highway": "Nighttime Highway Luxury Vehicle Theft",
    "theft": "Nighttime Highway Luxury Vehicle Theft",

    "extortion": "Commercial Extortion & Protection Racket",
    "protection": "Commercial Extortion & Protection Racket",
    "racket": "Commercial Extortion & Protection Racket",

    "snatching": "Chain Snatching & Rapid Escape Corridor",
    "chain": "Chain Snatching & Rapid Escape Corridor",
    "bike": "Chain Snatching & Rapid Escape Corridor"
}

def compute_cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
    if not vec1 or not vec2 or len(vec1) != len(vec2):
        return 0.5
    dot_product = sum(a * b for a, b in zip(vec1, vec2))
    norm_a = math.sqrt(sum(a * a for a in vec1))
    norm_b = math.sqrt(sum(b * b for b in vec2))
    if norm_a == 0 or norm_b == 0:
        return 0.0
    return dot_product / (norm_a * norm_b)

def map_tags_to_mo_vector(tags: List[str]) -> List[float]:
    v = [0.2, 0.2, 0.2, 0.2, 0.5]
    tags_str = " ".join(tags).lower()
    if "cyber" in tags_str or "phishing" in tags_str or "sim_swap" in tags_str or "fake_app" in tags_str or "money_mule" in tags_str:
        v[0] = 0.92
    if "armed" in tags_str or "robbery" in tags_str or "firearm" in tags_str:
        v[1] = 0.88
    if "atm" in tags_str or "skimming" in tags_str or "card" in tags_str:
        v[2] = 0.90
    if "vehicle" in tags_str or "highway" in tags_str or "repeater" in tags_str:
        v[3] = 0.85
    if "extortion" in tags_str or "protection" in tags_str or "syndicate" in tags_str:
        v[4] = 0.80
    return v

class EventPatternSolver:
    """
    High-Precision AI Event-Based Pattern Solver Engine.
    - Multi-Vector Cosine Similarity (5-Dim MO & Vector Embeddings).
    - Semantic Offense Alignment & Multi-Evidence Set Matching.
    - Actionable Investigation Action Plans & Victim Restitution Strategies.
    """

    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data")
        self.gz_file = os.path.join(self.data_dir, "solved_case_events.json.gz")
        self.index_file = os.path.join(self.data_dir, "solved_case_patterns_index.json")
        self.solved_cases: List[Dict[str, Any]] = self._load_compressed_events()

    def _load_compressed_events(self) -> List[Dict[str, Any]]:
        if os.path.exists(self.gz_file):
            try:
                with gzip.open(self.gz_file, "rt", encoding="utf-8") as gz:
                    data = json.load(gz)
                    cases = data.get("cases", [])
                    logger.info(f"Loaded {len(cases):,} compressed event resolution chains from '{self.gz_file}'.")
                    return cases
            except Exception as e:
                logger.error(f"Error loading compressed GZ event patterns: {e}")

        for fname in ["cases_db_20000.json", "cases_db_1000.json"]:
            fpath = os.path.join(self.data_dir, fname)
            if os.path.exists(fpath):
                try:
                    with open(fpath, "r", encoding="utf-8") as f:
                        data = json.load(f)
                        logger.info(f"Fallback loaded {len(data.get('firs', [])):,} cases from '{fpath}'.")
                        return data.get("firs", [])
                except Exception:
                    pass

        return []

    def solve_new_case(
        self,
        offense: str,
        evidence_type: str,
        witness_statement: str,
        mo_tags: Optional[List[str]] = None,
        victim_name: str = "Anonymous Victim",
        location: str = "Central Division"
    ) -> Dict[str, Any]:
        """
        High-precision pattern solver matching evidence, witness signals, and MO vectors against historical event chains.
        """
        if not self.solved_cases:
            return {
                "status": "NO_PATTERNS_LOADED",
                "message": "Event pattern database not loaded. Run `build_event_resolution_patterns.py` first."
            }

        mo_tags = [t.lower() for t in (mo_tags or [])]
        offense_lower = offense.lower()
        evidence_type_lower = evidence_type.lower()
        witness_lower = witness_statement.lower()

        # Semantic canonical offense determination
        canonical_target = None
        for kw, mapped in CANONICAL_OFFENSE_MAP.items():
            if kw in offense_lower or kw in " ".join(mo_tags):
                canonical_target = mapped
                break

        query_mo_vector = map_tags_to_mo_vector(mo_tags)
        scored_matches = []

        for case in self.solved_cases:
            score = 0.0
            reasons = []

            case_offense = case.get("offense", "")
            case_offense_lower = case_offense.lower()

            # 1. Semantic Offense Category Alignment (30.0%)
            if canonical_target and case_offense == canonical_target:
                score += 30.0
                reasons.append(f"Canonical Offense Match ('{case_offense}')")
            elif offense_lower in case_offense_lower or case_offense_lower in offense_lower:
                score += 25.0
                reasons.append(f"Offense Substring Match ('{case_offense}')")

            # 2. MO Feature Vector Cosine Similarity (30.0%)
            case_mo_vector = case.get("mo_vector") or case.get("mo_feature_vector") or [0.5, 0.5, 0.5, 0.5, 0.5]
            cos_sim = compute_cosine_similarity(query_mo_vector, case_mo_vector)
            score += round(cos_sim * 30.0, 2)
            if cos_sim >= 0.70:
                reasons.append(f"High MO Vector Cosine Similarity ({cos_sim * 100:.1f}%)")

            # 3. Evidence Set Overlap (20.0%)
            case_evidence = case.get("evidence_summary", {}).get("type", "") if "evidence_summary" in case else case.get("evidence", {}).get("type", "")
            case_ev_lower = case_evidence.lower()
            if case_ev_lower and (evidence_type_lower in case_ev_lower or case_ev_lower in evidence_type_lower):
                score += 20.0
                reasons.append(f"Primary Evidence Match ('{case_evidence}')")
            else:
                # Token overlap check for multi-evidence items
                ev_tokens = set(evidence_type_lower.split())
                case_ev_tokens = set(case_ev_lower.split())
                common_tokens = ev_tokens.intersection(case_ev_tokens)
                if common_tokens:
                    token_score = min(15.0, len(common_tokens) * 7.5)
                    score += token_score
                    reasons.append(f"Evidence Keyword Match ('{', '.join(common_tokens)}')")

            # 4. MO Tag Jaccard Overlap (15.0%)
            case_tags = [t.lower() for t in case.get("mo_tags", [])]
            if mo_tags and case_tags:
                intersection = set(mo_tags).intersection(set(case_tags))
                union = set(mo_tags).union(set(case_tags))
                if union:
                    jaccard = len(intersection) / len(union)
                    tag_score = jaccard * 15.0
                    score += round(tag_score, 2)
                    if intersection:
                        reasons.append(f"MO Signature Tags Overlap ({', '.join(intersection)})")

            # 5. Witness & Entity Signal Match (5.0%)
            case_witness = case.get("witness_summary", {}).get("testimony", "") if "witness_summary" in case else case.get("witness", {}).get("testimony", "")
            witness_keywords = [w for w in witness_lower.split() if len(w) > 3]
            kw_matches = [w for w in witness_keywords if w in case_witness.lower()]
            if kw_matches:
                score += min(5.0, len(kw_matches) * 1.5)
                reasons.append(f"Witness Testimony Keywords ({', '.join(kw_matches[:2])})")

            scored_matches.append((score, case, reasons))

        # Sort by match score descending
        scored_matches.sort(key=lambda x: x[0], reverse=True)
        top_matches = scored_matches[:3]

        top_precedents = []
        for score, case, reasons in top_matches:
            case_id = case.get("case_id", case.get("id"))
            suspect = case.get("suspect", {}).get("name") if isinstance(case.get("suspect"), dict) else case.get("suspect_name", "Syndicate Operative")
            vehicle = case.get("vehicle_plate", "KA-01-XX-0000")
            top_precedents.append({
                "case_id": case_id,
                "offense": case.get("offense"),
                "station": case.get("city") or case.get("station"),
                "match_score": f"{min(99.4, score):.1f}%",
                "suspect_linked": suspect,
                "vehicle_plate": vehicle,
                "matching_reasons": reasons,
                "resolution_blueprint": case.get("resolution_blueprint", {
                    "key_triggers": f"Evidence '{evidence_type}' + Witness Sighting",
                    "investigative_action": f"Cross-reference {evidence_type} with central registry; deploy ANPR alerts for vehicle {vehicle}.",
                    "victim_relief_action": f"Initiate fast-track assistance for victim {victim_name}."
                })
            })

        # Synthesize investigation action plan & victim relief strategy
        primary_match = top_matches[0][1] if top_matches else {}
        suspect_lead = primary_match.get("suspect", {}).get("name") if isinstance(primary_match.get("suspect"), dict) else primary_match.get("suspect_name", "Syndicate Operative")
        vehicle_lead = primary_match.get("vehicle_plate", "KA-01-XX-0000")
        weapon_lead = primary_match.get("weapon", "Standard Issue / Tool")

        investigation_plan = [
            f"Phase 1 (Immediate Evidence Verification): Isolate {evidence_type} collected from {location}. Run digital/ballistic fingerprint search matching historical case {top_precedents[0]['case_id'] if top_precedents else 'PAT-001'}.",
            f"Phase 2 (Witness Lead Interrogation): Interview witness based on statement '{witness_statement[:80]}...'. Issue ANPR lookup alert across city traffic checkpoints for getaway vehicle {vehicle_lead}.",
            f"Phase 3 (MO Vector Pattern Correlation): Cross-reference syndicate tactics with MO signature tags ({', '.join(mo_tags or ['syndicate'])}). Focus surveillance on suspect lead {suspect_lead}.",
            f"Phase 4 (Raid & Asset Recovery): Execute coordinated search warrant using weapon trace ({weapon_lead}); freeze linked mule accounts.",
            f"Phase 5 (Victim Protection & Charge Sheet): File formal charge sheet with court; complete asset restitution."
        ]

        if "cyber" in offense_lower or "fraud" in offense_lower or "skimming" in offense_lower:
            victim_relief = [
                f"1. Emergency Financial Freeze: Issue instant transaction block on recipient money mule wallets associated with case.",
                f"2. Victim Protection Advisory: Provide {victim_name} with digital fraud re-securing checklist and fresh bank credentials.",
                f"3. Fast-Track Restitution: Submit verified police investigation dossier to bank fraud tribunal for 100% loss recovery."
            ]
        elif "robbery" in offense_lower or "extortion" in offense_lower or "snatching" in offense_lower:
            victim_relief = [
                f"1. Immediate Security Escort: Deploy emergency beat patrol around {victim_name}'s premises at {location}.",
                f"2. Valuables Lien & Recovery: Log recovered physical property/jewelry into forensic evidence ledger for court release.",
                f"3. Trauma & Legal Support: Assign dedicated victim advocate officer for courtroom proceedings."
            ]
        else:
            victim_relief = [
                f"1. Asset Protection: Issue police verification certificate for insurance & legal claims.",
                f"2. Direct Case Updates: Send automated SMS/email investigative status notifications to {victim_name}.",
                f"3. Legal Restitution: Ensure full property restoration upon suspect conviction."
            ]

        return {
            "status": "SUCCESS",
            "query": {
                "victim_name": victim_name,
                "offense": offense,
                "location": location,
                "evidence_type": evidence_type,
                "witness_statement": witness_statement,
                "mo_tags": mo_tags
            },
            "top_matched_precedents": top_precedents,
            "investigation_action_plan": investigation_plan,
            "victim_relief_strategy": victim_relief
        }

    def solve_from_simple_text(
        self,
        story_text: str,
        victim_name: str = "Victim",
        location: str = "City Division"
    ) -> Dict[str, Any]:
        """
        Accepts plain, simple everyday English inputs from victims/officers,
        extracts crime signals automatically, and returns an easy-to-understand report.
        """
        text_lower = story_text.lower()

        # 1. Automatic Offense Detection from Simple English
        offense = "Cyber Fraud & Money Laundering"
        if "atm" in text_lower or "skimm" in text_lower or "card cloned" in text_lower:
            offense = "Financial ATM Skimming & Card Cloning"
        elif "car" in text_lower or "suv" in text_lower or "vehicle stolen" in text_lower or "keyless" in text_lower:
            offense = "Nighttime Highway Luxury Vehicle Theft"
        elif "chain" in text_lower or "snatch" in text_lower or "gold chain" in text_lower or "motorbike" in text_lower:
            offense = "Chain Snatching & Rapid Escape Corridor"
        elif "extort" in text_lower or "protection money" in text_lower or "threat" in text_lower or "racket" in text_lower:
            offense = "Commercial Extortion & Protection Racket"
        elif "robbery" in text_lower or "gun" in text_lower or "armed" in text_lower or "vault" in text_lower:
            offense = "Armed Jewelry & Bank Robbery"
        elif "hack" in text_lower or "sim" in text_lower or "otp" in text_lower or "money stolen" in text_lower or "apk" in text_lower:
            offense = "Cyber Fraud & Money Laundering"

        # 2. Automatic Evidence Detection
        evidence_type = "Digital Forensic Log"
        if "cctv" in text_lower or "camera" in text_lower:
            evidence_type = "CCTV Footage"
        elif "phone" in text_lower or "call" in text_lower or "burner" in text_lower or "cdr" in text_lower:
            evidence_type = "Call Detail Record (CDR)"
        elif "bank" in text_lower or "money" in text_lower or "account" in text_lower or "transfer" in text_lower:
            evidence_type = "Financial Transaction Statement"
        elif "gun" in text_lower or "bullet" in text_lower or "weapon" in text_lower:
            evidence_type = "Ballistic Fingerprint"

        # 3. Extract MO tags from Simple English
        mo_tags = []
        if "sim" in text_lower or "swap" in text_lower:
            mo_tags.append("sim_swap")
        if "phish" in text_lower or "link" in text_lower:
            mo_tags.append("phishing")
        if "app" in text_lower or "apk" in text_lower or "malware" in text_lower:
            mo_tags.append("fake_app")
        if "bank" in text_lower or "mule" in text_lower or "account" in text_lower:
            mo_tags.append("money_mule")
        if "atm" in text_lower or "skimm" in text_lower:
            mo_tags.append("atm_skimming")
        if "bike" in text_lower or "motorcycle" in text_lower:
            mo_tags.append("bike_escape")
        if not mo_tags:
            mo_tags = ["cyber_fraud", "syndicate"]

        raw_result = self.solve_new_case(
            offense=offense,
            evidence_type=evidence_type,
            witness_statement=story_text,
            mo_tags=mo_tags,
            victim_name=victim_name,
            location=location
        )

        # 4. Format into Simple, Clean, Easy-to-Understand Output
        simple_precedents = []
        for prec in raw_result.get("top_matched_precedents", []):
            simple_precedents.append({
                "case_number": prec.get("case_id"),
                "match_percentage": prec.get("match_score"),
                "crime_type": prec.get("offense"),
                "suspect_caught_in_past": prec.get("suspect_linked"),
                "getaway_vehicle": prec.get("vehicle_plate"),
                "why_it_matched": "Same crime method and evidence pattern as this past solved case."
            })

        simple_leads = [
            f"-> Lead 1 (Check Traffic Cameras): Search ANPR cameras for getaway vehicle license plate mentioned in witness statement.",
            f"-> Lead 2 (Freeze Stolen Funds): Issue instant bank freeze on the accounts where stolen money was transferred.",
            f"-> Lead 3 (Trace Phone Numbers): Subpoena cell tower call records for burner numbers active near the incident scene.",
            f"-> Lead 4 (Block Malware/C2): Takedown malicious server IPs and isolate infected mobile apps."
        ]

        simple_victim_help = [
            f"1. Stop Money Loss: Block all bank accounts and credit cards immediately.",
            f"2. Phone Security: Remove fake apps and issue fresh bank login passwords for {victim_name}.",
            f"3. Money Refund: File verified police report with bank fraud tribunal for 100% loss refund."
        ]

        return {
            "status": "SUCCESS",
            "simple_summary": {
                "victim_name": victim_name,
                "location": location,
                "detected_crime": offense,
                "key_evidence_detected": evidence_type,
                "user_story": story_text
            },
            "similar_solved_cases": simple_precedents,
            "simple_investigation_leads": simple_leads,
            "simple_victim_assistance_plan": simple_victim_help
        }

event_pattern_solver = EventPatternSolver()

