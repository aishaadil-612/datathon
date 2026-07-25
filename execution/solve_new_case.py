import os
import sys
import json
import logging

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.analytics.event_pattern_solver import event_pattern_solver
from agents.copilot.senior_detective import SeniorDetectiveAgent

def solve_victim_case(
    offense: str = "Financial ATM Skimming & Card Cloning",
    evidence_type: str = "Ballistic Fingerprint",
    witness_statement: str = "Witness observed suspect activity near Bengaluru Sector 7. Vehicle DL-76-ZF-6735 noted.",
    mo_tags: list = None,
    victim_name: str = "Sunita Reddy",
    location: str = "Bengaluru Sector 7"
):
    print("=" * 80)
    print("  ARGUS AI CASE RESOLUTION ENGINE: EVENT-BASED PATTERN MATCHING")
    print("=" * 80)

    mo_tags = mo_tags or ["atm_skimming", "card_cloning", "cyber_fraud"]

    detective = SeniorDetectiveAgent()
    solution = detective.solve_case_for_victim(
        offense=offense,
        evidence_type=evidence_type,
        witness_statement=witness_statement,
        mo_tags=mo_tags,
        victim_name=victim_name,
        location=location
    )

    print(f"\n[VICTIM REPORT]")
    print(f"  Victim Name : {victim_name}")
    print(f"  Location    : {location}")
    print(f"  Offense     : {offense}")
    print(f"  Evidence    : {evidence_type}")
    print(f"  Witness Lead: {witness_statement}")
    print(f"  MO Tags     : {', '.join(mo_tags)}")

    print(f"\n[TOP MATCHED SOLVED CASE PRECEDENTS]")
    for i, prec in enumerate(solution.get("top_matched_precedents", []), 1):
        print(f"  Precedent #{i}: {prec.get('case_id')} | Offense: {prec.get('offense')} | Match Score: {prec.get('match_score')}")
        print(f"    Linked Suspect : {prec.get('suspect_linked')}")
        print(f"    Getaway Vehicle: {prec.get('vehicle_plate')}")
        print(f"    Matching Signal: {', '.join(prec.get('matching_reasons', []))}")

    print(f"\n[AI INVESTIGATION ACTION PLAN FOR DETECTIVES]")
    for step in solution.get("investigation_action_plan", []):
        print(f"  -> {step}")

    print(f"\n[IMMEDIATE VICTIM RELIEF & ASSET RECOVERY STRATEGY]")
    for step in solution.get("victim_relief_strategy", []):
        print(f"  {step}")

    print("=" * 80)
    return solution

if __name__ == "__main__":
    solve_victim_case()
