"""
FastAPI dependency injection module.
"""

from typing import Generator
from conark.inference.predictor import ConstructionIntelligenceEngine
from conark.gemini.service import GeminiService

_engine_instance = None
_gemini_service_instance = None


def get_intelligence_engine() -> ConstructionIntelligenceEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = ConstructionIntelligenceEngine()
        _engine_instance.preload_models()
    return _engine_instance


def get_gemini_service() -> GeminiService:
    global _gemini_service_instance
    if _gemini_service_instance is None:
        _gemini_service_instance = GeminiService()
    return _gemini_service_instance
