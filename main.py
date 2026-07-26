import uvicorn
import logging
from config import settings
from gateway.app import app

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("argus.main")

if __name__ == "__main__":
    import os
    port = int(os.getenv("PORT", settings.PORT))
    host = os.getenv("HOST", "0.0.0.0")
    logger.info(f"Starting {settings.APP_NAME} Gateway on http://{host}:{port}")
    uvicorn.run("gateway.app:app", host=host, port=port)
