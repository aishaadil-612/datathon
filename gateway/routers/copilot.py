from typing import Dict, Any, Optional
from pydantic import BaseModel
from agents.copilot.orchestrator import copilot_orchestrator

class CopilotQueryRequest(BaseModel):
    user_id: str = "investigator1"
    role: str = "Investigator"
    prompt: str
    session_id: str = "default_session"

async def handle_copilot_query(request: CopilotQueryRequest) -> Dict[str, Any]:
    return await copilot_orchestrator.process_investigator_query(
        user_id=request.user_id,
        role=request.role,
        prompt=request.prompt,
        session_id=request.session_id
    )
