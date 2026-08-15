"""
FastAPI Main Application Entrypoint for ConArk Systems.
Exposes REST APIs, Swagger UI (/docs), ReDoc (/redoc), preloads ML models on startup,
and serves built React SPA frontend when running in production (Render / Docker).
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
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

# Resolve production frontend SPA static directory
possible_dist_paths = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "frontend", "dist")),
    os.path.abspath("frontend/dist"),
    os.path.abspath("../frontend/dist"),
    "/opt/render/project/src/frontend/dist"
]

frontend_dist = None
for p in possible_dist_paths:
    if os.path.exists(p) and os.path.isdir(p) and os.path.exists(os.path.join(p, "index.html")):
        frontend_dist = p
        break

if frontend_dist:
    logger.info(f"Frontend production dist found at {frontend_dist}. Mounting static SPA files.")
    assets_dir = os.path.join(frontend_dist, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="static_assets")

    @app.get("/", include_in_schema=False)
    async def serve_root_spa():
        return FileResponse(os.path.join(frontend_dist, "index.html"))

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        if full_path.startswith("api/") or full_path in ["docs", "redoc", "openapi.json"]:
            return None
        target = os.path.join(frontend_dist, full_path)
        if os.path.exists(target) and os.path.isfile(target):
            return FileResponse(target)
        return FileResponse(os.path.join(frontend_dist, "index.html"))
else:
    logger.info("Frontend dist directory not found. Running in standalone API mode.")

    @app.get("/", include_in_schema=False)
    def root():
        return {
            "message": "Welcome to ConArk Systems – Construction AI Intelligence Platform",
            "docs": "/docs",
            "health": "/api/v1/health"
        }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("conark.api.main:app", host="0.0.0.0", port=port, reload=False)
