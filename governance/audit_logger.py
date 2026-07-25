import logging
import uuid
from datetime import datetime, timezone
from typing import Dict, Any
from core.database.postgres import postgres_client

logger = logging.getLogger("argus.governance.audit_logger")

import hashlib

class AuditLogger:
    """Immutable Append-Only Audit Logging Service."""

    @staticmethod
    async def log(
        user_id: str,
        role: str,
        action: str,
        tool_name: str,
        query_params: Dict[str, Any],
        explanation: Dict[str, Any],
        compliance_passed: bool = True,
        query_text: str = "",
        records_accessed: int = 1,
        response_content: str = ""
    ) -> Dict[str, Any]:
        
        # Calculate SHA-256 response hash for immutable verification
        hash_input = response_content or f"{tool_name}:{query_text}:{user_id}"
        response_hash = hashlib.sha256(hash_input.encode("utf-8")).hexdigest()

        log_entry = {
            "id": f"AUDIT-{uuid.uuid4().hex[:8].upper()}",
            "user_id": user_id,
            "role": role,
            "query_text": query_text or str(query_params),
            "agent_invoked": tool_name,
            "records_accessed": records_accessed,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "response_hash": response_hash,
            "action": action,
            "explanation": explanation.get("natural_language_rationale", "") if explanation else "",
            "feature_attributions": explanation.get("feature_attributions", {}) if explanation else {},
            "compliance_passed": compliance_passed
        }

        # Persist to append-only audit store in PostgreSQL
        await postgres_client.insert_audit_log(log_entry)
        logger.info(f"IMMUTABLE AUDIT ENTRY: {log_entry['id']} | User: {user_id} | Agent: {tool_name} | Hash: {response_hash[:10]}")
        return log_entry

audit_logger = AuditLogger()
