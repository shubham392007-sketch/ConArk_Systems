"""
Gemini API Speech-to-Text (STT) Service.
Uses GEMINI_API_KEY_OPTIMIZATION to transcribe construction voice audio into clean text.
"""

import base64
from typing import Dict, Any, Optional
from google import genai
from google.genai import types

from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("gemini_stt_service")


class GeminiSTTService:
    """Service layer for speech-to-text audio transcription using Gemini API."""

    CANDIDATE_MODELS = [
        "gemini-flash-latest",
        "gemini-2.5-flash",
        "gemini-3.5-flash"
    ]

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or settings.GEMINI_API_KEY_OPTIMIZATION or settings.GEMINI_API_KEY

    def _get_client(self) -> genai.Client:
        key_to_use = self.api_key or settings.GEMINI_API_KEY_OPTIMIZATION or settings.GEMINI_API_KEY
        if not key_to_use:
            raise ValueError("GEMINI_API_KEY_OPTIMIZATION is not configured.")
        return genai.Client(api_key=key_to_use)

    async def transcribe_audio_bytes(
        self,
        audio_bytes: bytes,
        mime_type: str = "audio/webm"
    ) -> Dict[str, Any]:
        """Transcribes raw audio bytes into clean text using Gemini API."""
        if not audio_bytes or len(audio_bytes) == 0:
            return {
                "success": False,
                "error": "Empty audio payload received.",
                "transcript": ""
            }

        try:
            client = self._get_client()
            prompt = "Transcribe the following spoken construction audio prompt accurately into clear text. Output ONLY the transcribed text, with no extra commentary or conversational preamble."

            audio_part = types.Part.from_bytes(
                data=audio_bytes,
                mime_type=mime_type
            )

            # Try candidate Gemini models
            for model_name in self.CANDIDATE_MODELS:
                try:
                    logger.info(f"Attempting STT transcription with model: {model_name}")
                    response = client.models.generate_content(
                        model=model_name,
                        contents=[prompt, audio_part]
                    )

                    if response and response.text:
                        clean_text = response.text.strip()
                        logger.info(f"STT transcription successful with {model_name}: '{clean_text[:60]}...'")
                        return {
                            "success": True,
                            "transcript": clean_text,
                            "model": model_name
                        }
                except Exception as e:
                    logger.warning(f"Gemini STT model {model_name} failed: {e}")
                    continue

            return {
                "success": False,
                "error": "All Gemini API STT models were unavailable.",
                "transcript": ""
            }

        except Exception as global_err:
            logger.error(f"Gemini STT Service exception: {global_err}")
            return {
                "success": False,
                "error": str(global_err),
                "transcript": ""
            }
