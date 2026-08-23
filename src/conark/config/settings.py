"""
Application settings using pydantic-settings.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ConArk Systems"
    APP_ENV: str = "development"
    
    GEMINI_API_KEY: str = "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q"
    GEMINI_API_KEY_PERFORMANCE: str = "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q"
    GEMINI_API_KEY_RISK: str = "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q"
    GEMINI_API_KEY_COST: str = "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q"
    GEMINI_API_KEY_TIME: str = "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q"
    GEMINI_API_KEY_OPTIMIZATION: str = "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q"
    GEMINI_MODEL: str = "gemini-flash-latest"
    GEMINI_TIMEOUT_SECONDS: int = 30
    GEMINI_MAX_RETRIES: int = 2

    # OpenRouter API Integration (google/gemma-4-26b-a4b-it:free)
    OPENROUTER_API_KEY: str = "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"
    OPENROUTER_MODEL: str = "google/gemma-4-26b-a4b-it:free"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"

    # Supabase PostgreSQL & Auth Integration
    SUPABASE_URL: str = "https://fgdlibcsnjsbuwddcklb.supabase.co"
    SUPABASE_ANON_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZnZGxpYmNzbmpzYnV3ZGRja2xiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0ODk1NzYsImV4cCI6MjEwMzA2NTU3Nn0.q4JCUH5tvd70NESc-8UeJuUL4tKLqV94zPn7sxaGw1o"
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    DATABASE_URL: str = "postgresql://postgres:Shubham%40392007@db.fgdlibcsnjsbuwddcklb.supabase.co:5432/postgres"
    
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent.parent
    MODEL_DIR: Path = BASE_DIR / "models"
    DATA_DIR: Path = BASE_DIR / "data"
    REPORTS_DIR: Path = BASE_DIR / "reports"
    
    LOG_LEVEL: str = "INFO"
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    def ensure_directories(self) -> None:
        """Create necessary directories if they do not exist."""
        self.MODEL_DIR.mkdir(parents=True, exist_ok=True)
        self.DATA_DIR.mkdir(parents=True, exist_ok=True)
        (self.DATA_DIR / "raw").mkdir(parents=True, exist_ok=True)
        (self.DATA_DIR / "processed").mkdir(parents=True, exist_ok=True)
        (self.DATA_DIR / "sample").mkdir(parents=True, exist_ok=True)
        (self.MODEL_DIR / "performance").mkdir(parents=True, exist_ok=True)
        (self.MODEL_DIR / "risk").mkdir(parents=True, exist_ok=True)
        (self.MODEL_DIR / "cost").mkdir(parents=True, exist_ok=True)
        (self.MODEL_DIR / "time").mkdir(parents=True, exist_ok=True)
        (self.MODEL_DIR / "optimization").mkdir(parents=True, exist_ok=True)
        (self.MODEL_DIR / "preprocessors").mkdir(parents=True, exist_ok=True)
        (self.REPORTS_DIR / "metrics").mkdir(parents=True, exist_ok=True)
        (self.REPORTS_DIR / "figures").mkdir(parents=True, exist_ok=True)


settings = Settings()
settings.ensure_directories()
