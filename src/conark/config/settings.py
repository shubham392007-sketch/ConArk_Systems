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

    # OpenRouter API Integration (google/gemma-4-26b-a4b-it:free with auto fallback)
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "google/gemma-4-26b-a4b-it:free"
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    
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
