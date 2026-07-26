import logging
import math
from typing import Dict, Any, List

logger = logging.getLogger("argus.agents.tools.mo_feature_vector")

import os
import json

_CASE_MO_VECTORS: Dict[str, Dict[str, Any]] = {}
_MO_VECTORS_LOADED = False

def _get_case_mo_vectors() -> Dict[str, Dict[str, Any]]:
    global _CASE_MO_VECTORS, _MO_VECTORS_LOADED
    if _MO_VECTORS_LOADED:
        return _CASE_MO_VECTORS
    _MO_VECTORS_LOADED = True
    import gc
    json_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))), "data", "cases_db_1000.json")
    if os.path.exists(json_path):
        with open(json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
            for fir in data.get("firs", []):
                _CASE_MO_VECTORS[fir["id"]] = {
                    "fir_id": fir["id"],
                    "offense": fir["offense"],
                    "entry_method": fir.get("mo_tags", ["entry"])[0],
                    "time_of_day": fir.get("incident_date", "14:00"),
                    "target_type": fir.get("location", "Commercial Hub"),
                    "weapon_used": fir.get("weapon", "Digital Script"),
                    "mo_tags": fir.get("mo_tags", []),
                    "feature_vector": fir.get("mo_feature_vector", [0.80, 0.50, 0.70, 0.30, 0.90])
                }
            logger.info(f"Lazy loaded {len(_CASE_MO_VECTORS)} real case MO Feature Vectors from database.")
            del data
            gc.collect()
    return _CASE_MO_VECTORS

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    dot_product = sum(a * b for a, b in zip(v1, v2))
    norm_v1 = math.sqrt(sum(a * a for a in v1))
    norm_v2 = math.sqrt(sum(b * b for b in v2))
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return dot_product / (norm_v1 * norm_v2)

async def execute_mo_feature_vector(fir_id: str = "FIR-2026-001") -> Dict[str, Any]:
    """Computes fixed-length MO Feature Vector similarity scoring across 1,000+ case database."""
    logger.info(f"Computing MO Feature Vector similarity for case: '{fir_id}'")

    case_vectors = _get_case_mo_vectors()
    target_case = case_vectors.get(fir_id)
    if not target_case:
        for cid, case_data in case_vectors.items():
            if fir_id in cid or cid in fir_id:
                target_case = case_data
                break
    if not target_case and case_vectors:
        target_case = next(iter(case_vectors.values()))

    target_vector = target_case["feature_vector"] if target_case else [0.8, 0.5, 0.7, 0.3, 0.9]

    similar_matches = []
    for cid, case_data in case_vectors.items():
        if cid == fir_id:
            continue
        sim_score = cosine_similarity(target_vector, case_data["feature_vector"])
        similar_matches.append({
            "fir_id": cid,
            "offense": case_data["offense"],
            "entry_method": case_data["entry_method"],
            "weapon_used": case_data["weapon_used"],
            "mo_similarity_score": round(sim_score, 4),
            "common_tags": list(set(target_case["mo_tags"]).intersection(set(case_data["mo_tags"])))
        })

    similar_matches.sort(key=lambda x: x["mo_similarity_score"], reverse=True)

    return {
        "target_fir": fir_id,
        "target_mo_vector": target_case["feature_vector"],
        "target_entry_method": target_case["entry_method"],
        "target_weapon": target_case["weapon_used"],
        "vector_dimensions": ["entry_method", "time_of_day", "target_type", "weapon_type", "behavioral_pattern"],
        "similar_cases": similar_matches,
        "top_match_fir": similar_matches[0]["fir_id"] if similar_matches else None
    }
