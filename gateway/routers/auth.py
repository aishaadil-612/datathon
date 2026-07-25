import jwt
from datetime import datetime, timedelta, timezone
from typing import Dict, Any
from pydantic import BaseModel
from config import settings

class LoginRequest(BaseModel):
    username: str
    password: str
    role: str = "Investigator"

MOCK_USERS = {
    "investigator1": {"password": "password123", "role": "Investigator", "name": "Inspector Vijay Kumar"},
    "supervisor1": {"password": "password123", "role": "Supervisor", "name": "ACP Ananya Rao"},
    "admin1": {"password": "password123", "role": "Admin", "name": "System Administrator"}
}

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)

def decode_access_token(token: str) -> Dict[str, Any]:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except Exception:
        return {}

async def authenticate_user(login_data: LoginRequest) -> Dict[str, Any]:
    user_info = MOCK_USERS.get(login_data.username)
    if not user_info or user_info["password"] != login_data.password:
        return {"success": False, "error": "Invalid username or password"}

    role = login_data.role if login_data.role in ["Investigator", "Supervisor", "Admin"] else user_info["role"]
    token = create_access_token({"sub": login_data.username, "role": role, "name": user_info["name"]})

    return {
        "success": True,
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "username": login_data.username,
            "role": role,
            "name": user_info["name"]
        }
    }
