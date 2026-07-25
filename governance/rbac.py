import logging
from enum import Enum
from typing import Dict, List, Set

logger = logging.getLogger("argus.governance.rbac")

class Role(str, Enum):
    INVESTIGATOR = "Investigator"
    SUPERVISOR = "Supervisor"
    ADMIN = "Admin"

FIR_TOOLS = {
    "complaint_intake", "fir_drafter", "authenticity_verifier",
    "officer_action_recommender", "full_fir_pipeline", "aadhaar_ocr"
}

ROLE_PERMISSIONS: Dict[Role, Set[str]] = {
    Role.INVESTIGATOR: {
        "query_router", "case_intel", "analytics",
        "nl2sql", "nl2cypher", "rag_search", "kannada_translate",
        "network_analysis", "mo_feature_vector", "timeline_builder",
        "hotspot_detector", "risk_scorer", "early_warning_forecasting"
    } | FIR_TOOLS,
    Role.SUPERVISOR: {
        "query_router", "case_intel", "analytics",
        "nl2sql", "nl2cypher", "rag_search", "kannada_translate",
        "network_analysis", "mo_feature_vector", "timeline_builder",
        "hotspot_detector", "risk_scorer", "early_warning_forecasting",
        "financial_crime_linkage", "override_risk_threshold", "audit_query"
    } | FIR_TOOLS,
    Role.ADMIN: {
        "query_router", "case_intel", "analytics",
        "nl2sql", "nl2cypher", "rag_search", "kannada_translate",
        "network_analysis", "mo_feature_vector", "timeline_builder",
        "hotspot_detector", "risk_scorer", "early_warning_forecasting",
        "financial_crime_linkage", "override_risk_threshold", "audit_query",
        "manage_users", "system_config"
    } | FIR_TOOLS
}

class RBACEngine:
    """Role-Based Access Control Engine."""
    @staticmethod
    def check_permission(user_role: str, tool_name: str) -> bool:
        try:
            role_enum = Role(user_role)
        except ValueError:
            logger.warning(f"Invalid user role provided: {user_role}")
            return False

        allowed_tools = ROLE_PERMISSIONS.get(role_enum, set())
        has_perm = tool_name in allowed_tools
        logger.info(f"RBAC Check: Role='{user_role}' | Tool='{tool_name}' => Granted={has_perm}")
        return has_perm

rbac_engine = RBACEngine()
