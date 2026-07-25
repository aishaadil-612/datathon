import logging
import json
from config.settings import settings, BASE_DIR
from gateway.routers.auth import LoginRequest, authenticate_user
from gateway.routers.copilot import CopilotQueryRequest, handle_copilot_query
from gateway.routers.dashboard import get_dashboard_summary

from pathlib import Path

try:
    from fastapi import FastAPI, HTTPException, Depends
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse, HTMLResponse, FileResponse
    USE_FASTAPI = True
except ImportError:
    USE_FASTAPI = False

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("argus.gateway")

DASHBOARD_FILE = Path(BASE_DIR) / "dashboard" / "index.html"

if USE_FASTAPI:
    app = FastAPI(
        title=settings.APP_NAME,
        description="ARGUS Intelligence & Investigation Platform API Gateway",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/", response_class=HTMLResponse)
    @app.get("/dashboard", response_class=HTMLResponse)
    async def root():
        if DASHBOARD_FILE.exists():
            return FileResponse(DASHBOARD_FILE)
        return HTMLResponse("<h1>ARGUS Platform Gateway Running</h1>")

    @app.get("/health")
    @app.get("/api/v1/health")
    async def health():
        return {
            "app": settings.APP_NAME,
            "status": "HEALTHY",
            "environment": settings.ENV,
            "governance_mode": "SHAP_LIME_ENABLED",
            "postgres": "CONNECTED (Mock Fallback)",
            "neo4j": "CONNECTED (Mock Fallback)"
        }

    @app.post("/api/v1/auth/login")
    async def login(req: LoginRequest):
        res = await authenticate_user(req)
        if not res.get("success"):
            raise HTTPException(status_code=401, detail=res.get("error"))
        return res

    @app.post("/api/v1/copilot/query")
    async def copilot_query(req: CopilotQueryRequest):
        return await handle_copilot_query(req)

    @app.get("/api/v1/dashboard/summary")
    async def dashboard_summary():
        return await get_dashboard_summary()

else:
    logger.warning("FastAPI not detected in environment. Application running in fallback mode.")

