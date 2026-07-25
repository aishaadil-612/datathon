from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field

class FIRModel(BaseModel):
    id: str
    station: str
    offense: str
    incident_date: str
    status: str
    description: str
    location: str
    lat: float
    lng: float
    vector_embedding: Optional[List[float]] = None

class VictimModel(BaseModel):
    id: str
    fir_id: str
    name: str
    age: int
    statement: str

class WitnessModel(BaseModel):
    id: str
    fir_id: str
    name: str
    contact: str
    testimony: str

class EvidenceModel(BaseModel):
    id: str
    fir_id: str
    type: str
    description: str

class AuditLogEntry(BaseModel):
    id: str
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    user_id: str
    role: str
    action: str
    tool_name: str
    query_params: dict
    explanation: Optional[str] = None
    compliance_passed: bool = True
