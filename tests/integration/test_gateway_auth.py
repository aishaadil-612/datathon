import pytest
from gateway.routers.auth import LoginRequest, authenticate_user, decode_access_token

@pytest.mark.asyncio
async def test_auth_success():
    req = LoginRequest(username="investigator1", password="password123", role="Investigator")
    res = await authenticate_user(req)
    assert res["success"] is True
    assert "access_token" in res
    
    decoded = decode_access_token(res["access_token"])
    assert decoded["sub"] == "investigator1"
    assert decoded["role"] == "Investigator"

@pytest.mark.asyncio
async def test_auth_invalid_password():
    req = LoginRequest(username="investigator1", password="wrongpassword")
    res = await authenticate_user(req)
    assert res["success"] is False
    assert "Invalid username" in res["error"]
