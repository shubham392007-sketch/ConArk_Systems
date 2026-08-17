"""
Application settings using pydantic-settings.
"""

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    APP_NAME: str = "ConArk Systems"
    APP_ENV: str = "development"
    
    GEMINI_API_KEY: str = "AQ.Ab8RN6JFFQ5ouLZZkaqw8uJFfJoWa2p8GI24mV_bOGm_UbqYCg"
    GEMINI_API_KEY_PERFORMANCE: str = "AQ.Ab8RN6IJkVMCvmUS8u7TbtfT83v72y-hcTWyJda_8U38G7nU9A"
    GEMINI_API_KEY_RISK: str = "AQ.Ab8RN6IJkVMCvmUS8u7TbtfT83v72y-hcTWyJda_8U38G7nU9A"
    GEMINI_API_KEY_COST: str = "AQ.Ab8RN6JFFQ5ouLZZkaqw8uJFfJoWa2p8GI24mV_bOGm_UbqYCg"
    GEMINI_API_KEY_TIME: str = "AQ.Ab8RN6JFFQ5ouLZZkaqw8uJFfJoWa2p8GI24mV_bOGm_UbqYCg"
    GEMINI_API_KEY_OPTIMIZATION: str = "AQ.Ab8RN6JsQsJTxgdTBFtuJ3bSBlT3NVhyZmRqOLCYnsG6wEyIwQ"
    GEMINI_MODEL: str = "gemini-1.5-flash"
    GEMINI_TIMEOUT_SECONDS: int = 30
    GEMINI_MAX_RETRIES: int = 2
    
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
