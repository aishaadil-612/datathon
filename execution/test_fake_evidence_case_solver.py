import os
import sys
import json

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from core.analytics.event_pattern_solver import event_pattern_solver

def run_simple_english_case_demo():
    print("=" * 85)
    print("  ARGUS EASY-TO-UNDERSTAND AI CASE SOLVER & LEAD GENERATOR")
    print("=" * 85)

    # Simple, plain English input from a victim or junior officer
    victim_name = "Dr. Arishta Mukherjee"
    location = "Indiranagar, Bengaluru"
    
    simple_english_story = (
        "Someone hacked my phone using a fake banking app, did a SIM swap, and stole 18.5 Lakhs "
        "from my bank account. A shopkeeper nearby saw two men with laptops inside a silver sedan "
        "car with plate number MH-12-PQ-8841 near the ATM around 02:15 AM."
    )

    print("\n[INPUT: SIMPLE ENGLISH STORY FROM VICTIM]")
    print(f"  Victim Name: {victim_name}")
    print(f"  Location   : {location}")
    print(f"  Story      : \"{simple_english_story}\"")

    # Run simple text pattern solver
    result = event_pattern_solver.solve_from_simple_text(
        story_text=simple_english_story,
        victim_name=victim_name,
        location=location
    )

    summary = result.get("simple_summary", {})
    print(f"\n[AI AUTOMATIC DETECTION]")
    print(f"  Crime Type Detected    : {summary.get('detected_crime')}")
    print(f"  Primary Evidence Found : {summary.get('key_evidence_detected')}")

    print(f"\n[SIMILAR SOLVED CASES FOUND IN DATABASE]")
    for idx, case in enumerate(result.get("similar_solved_cases", []), 1):
        print(f"  Case #{idx}: {case.get('case_number')} | {case.get('crime_type')}")
        print(f"    Match Level : {case.get('match_percentage')}")
        print(f"    Caught Gang : {case.get('suspect_caught_in_past')}")
        print(f"    Car Used    : {case.get('getaway_vehicle')}")
        print(f"    Why Matched : {case.get('why_it_matched')}")

    print(f"\n[4 SIMPLE STEPS TO FIND NEW LEADS & CATCH THE CULPRIT]")
    for lead in result.get("simple_investigation_leads", []):
        print(f"  {lead}")

    print(f"\n[HOW WE HELP AND PROTECT THE VICTIM IMMEDIATELY]")
    for step in result.get("simple_victim_assistance_plan", []):
        print(f"  {step}")

    print("=" * 85)
    return result

if __name__ == "__main__":
    run_simple_english_case_demo()
