import logging
from typing import Callable, Any, Dict
from governance.rbac import rbac_engine
from governance.explainability import explainability_engine
from governance.audit_logger import audit_logger

logger = logging.getLogger("argus.governance.middleware")

class GovernanceMiddleware:
    """Non-optional middleware wrapper intercepting all tool calls across reasoning agents."""

    @staticmethod
    async def execute_governed_tool(
        user_id: str,
        user_role: str,
        tool_name: str,
        tool_func: Callable,
        *args,
        **kwargs
    ) -> Dict[str, Any]:
        """Wrapper method enforcing RBAC, explainability, and immutable audit logging."""
        logger.info(f"Governance Wrapper Intercepted Tool: '{tool_name}' for User: '{user_id}' ({user_role})")

        # 1. RBAC Check
        permitted = rbac_engine.check_permission(user_role, tool_name)
        if not permitted:
            err_msg = f"ACCESS DENIED: Role '{user_role}' is not authorized to invoke tool '{tool_name}'"
            logger.warning(err_msg)
            
            # Log policy violation to audit store
            await audit_logger.log(
                user_id=user_id,
                role=user_role,
                action="BLOCKED_EXECUTION",
                tool_name=tool_name,
                query_params=kwargs,
                explanation={"natural_language_rationale": "Execution blocked due to insufficient RBAC authorization privileges."},
                compliance_passed=False
            )
            return {
                "success": False,
                "error": err_msg,
                "compliance_passed": False
            }

        # 2. Execute Deterministic Tool
        try:
            tool_output = await tool_func(*args, **kwargs)
        except Exception as e:
            logger.error(f"Error during execution of tool '{tool_name}': {str(e)}")
            raise e

        # 3. Compute SHAP/LIME Explainability
        explanation = explainability_engine.generate_explanation(
            tool_name=tool_name,
            input_params=kwargs,
            output_data=tool_output
        )

        # 4. Record Immutable 7-Tuple Audit Log
        records_count = len(tool_output.get("results", [])) if isinstance(tool_output, dict) and "results" in tool_output else 1
        query_str = kwargs.get("query_text", kwargs.get("text", kwargs.get("prompt", str(kwargs))))

        await audit_logger.log(
            user_id=user_id,
            role=user_role,
            action="TOOL_EXECUTION",
            tool_name=tool_name,
            query_params=kwargs,
            explanation=explanation,
            compliance_passed=True,
            query_text=query_str,
            records_accessed=records_count,
            response_content=str(tool_output)
        )

        return {
            "success": True,
            "data": tool_output,
            "governance": {
                "compliance_passed": True,
                "explanation": explanation
            }
        }

governance_mw = GovernanceMiddleware()
