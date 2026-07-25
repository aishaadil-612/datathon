import uvicorn
import logging
from config import settings
from gateway.app import app

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("argus.main")

if __name__ == "__main__":
    logger.info(f"Starting {settings.APP_NAME} Gateway on http://{settings.HOST}:{settings.PORT}")
    logger.info(f"Dashboard available at http://localhost:{settings.PORT}/dashboard")
    uvicorn.run(app, host=settings.HOST, port=settings.PORT)
