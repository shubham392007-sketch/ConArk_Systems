"""
FastAPI Main Application Entrypoint for ConArk Systems.
Exposes REST APIs, Swagger UI (/docs), ReDoc (/redoc), and preloads ML models on startup.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from conark.config.settings import settings
from conark.api.dependencies import get_intelligence_engine
from conark.api.routes import health, prediction, forecasting, recommendation, alerts, intelligence, space_optimization
from conark.utils.logging import get_logger

logger = get_logger("fastapi_main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Preloads ML models once on application startup."""
    logger.info("Initializing ConArk Systems FastAPI Lifespan...")
    engine = get_intelligence_engine()
    logger.info("ConArk Systems initialization complete. Ready for API requests.")
    yield
    logger.info("Shutting down ConArk Systems FastAPI application.")


app = FastAPI(
    title=settings.APP_NAME,
    description="Complete Construction AI Intelligence Platform powered by 5 ML Models, Space Optimization Engine, Alert Engine, and Gemini 2.5 Flash.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 Routers
prefix_v1 = "/api/v1"
app.include_router(health.router, prefix=prefix_v1)
app.include_router(prediction.router, prefix=prefix_v1)
app.include_router(forecasting.router, prefix=prefix_v1)
app.include_router(recommendation.router, prefix=prefix_v1)
app.include_router(alerts.router, prefix=prefix_v1)
app.include_router(intelligence.router, prefix=prefix_v1)
app.include_router(space_optimization.router, prefix=prefix_v1)



@app.get("/", include_in_schema=False)
def root():
    return {
        "message": "Welcome to ConArk Systems – Construction AI Intelligence Platform",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("conark.api.main:app", host="0.0.0.0", port=8000, reload=True)
