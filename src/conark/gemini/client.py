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
    """Wrapper around official google-genai Client."""

    def __init__(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model_name or settings.GEMINI_MODEL
        self._client: Optional[genai.Client] = None

    @property
    def client(self) -> genai.Client:
        if self._client is None:
            if not self.api_key:
                raise ValueError("GEMINI_API_KEY is not configured.")
            self._client = genai.Client(api_key=self.api_key)
        return self._client

    def is_available(self) -> bool:
        """Check if Gemini API key is configured."""
        return bool(self.api_key and self.api_key.strip())
