import logging
import json
from config.settings import settings, BASE_DIR
from gateway.routers.auth import LoginRequest, authenticate_user
from gateway.routers.copilot import CopilotQueryRequest, handle_copilot_query
from gateway.routers.dashboard import get_dashboard_summary
from gateway.routers.fir import (
    ComplaintIntakeRequest, handle_complaint_intake,
    AadhaarOCRRequest, handle_aadhaar_ocr,
    FIRDraftRequest, handle_fir_draft,
    AuthenticityVerifyRequest, handle_verify_authenticity,
    FIRApproveRequest, handle_fir_approve
)

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

    # CORS must list explicit origins when allow_credentials=True.
    # Using ["*"] with credentials=True is invalid per RFC and browsers reject it.
    ALLOWED_ORIGINS = [
        "https://crimelens-ksp.netlify.app",
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=ALLOWED_ORIGINS,
        allow_credentials=False,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "Accept", "X-Requested-With"],
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

    # FIR Assistant Routes
    @app.post("/api/v1/fir/intake")
    async def fir_intake(req: ComplaintIntakeRequest):
        return await handle_complaint_intake(req)

    @app.post("/api/v1/fir/verify-aadhaar")
    async def fir_verify_aadhaar(req: AadhaarOCRRequest):
        return await handle_aadhaar_ocr(req)

    @app.post("/api/v1/fir/draft")
    async def fir_draft(req: FIRDraftRequest):
        return await handle_fir_draft(req)

    @app.post("/api/v1/fir/verify-authenticity")
    async def fir_verify_authenticity(req: AuthenticityVerifyRequest):
        return await handle_verify_authenticity(req)

    @app.post("/api/v1/fir/approve")
    async def fir_approve(req: FIRApproveRequest):
        return await handle_fir_approve(req)

else:
    logger.warning("FastAPI not detected in environment. Application running in fallback mode.")
