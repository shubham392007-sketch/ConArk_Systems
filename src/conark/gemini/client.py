"""
Gemini API client wrapper using official google-genai SDK.
"""

from typing import Optional
from google import genai
from google.genai import types
from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("gemini_client")


class GeminiClient:
    """Wrapper around official google-genai Client supporting model-specific API keys."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL
        self._client: Optional[genai.Client] = None

    @classmethod
    def for_model(cls, model_type: str) -> "GeminiClient":
        """Factory method to return a client initialized with model-specific API key."""
        m_lower = (model_type or "").lower()
        if "performance" in m_lower:
            key = settings.GEMINI_API_KEY_PERFORMANCE
        elif "risk" in m_lower:
            key = settings.GEMINI_API_KEY_RISK
        elif "cost" in m_lower:
            key = settings.GEMINI_API_KEY_COST
        elif "time" in m_lower:
            key = settings.GEMINI_API_KEY_TIME
        elif "optim" in m_lower or "space" in m_lower or "recommend" in m_lower:
            key = settings.GEMINI_API_KEY_OPTIMIZATION
        else:
            key = settings.GEMINI_API_KEY
            
        return cls(api_key=key)

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            key_to_use = self.api_key or settings.GEMINI_API_KEY
            if not key_to_use:
                raise ValueError("GEMINI_API_KEY is not configured.")
            self._client = genai.Client(api_key=key_to_use)
        return self._client

    def is_available(self) -> bool:
        """Check if Gemini API key is configured."""
        key_to_use = self.api_key or settings.GEMINI_API_KEY
        return bool(key_to_use and key_to_use.strip())
