from typing import Dict, Any, Optional
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str
    properties: Dict[str, Any]

class GraphRelationship(BaseModel):
    source: str
    target: str
    type: str
    properties: Optional[Dict[str, Any]] = None
