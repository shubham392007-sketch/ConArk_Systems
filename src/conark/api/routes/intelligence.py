"""
Master Intelligence Analysis Endpoint.
POST /api/v1/intelligence/analyze
Integrates 5 ML Models + Alert Engine + Health Score + Gemini 2.5 Flash Structured Report.
"""

import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.response import MasterIntelligenceResponse
from conark.api.dependencies import get_intelligence_engine, get_gemini_service
from conark.inference.predictor import ConstructionIntelligenceEngine
from conark.gemini.service import GeminiService
from conark.utils.logging import get_logger

logger = get_logger("intelligence_route")

router = APIRouter(prefix="/intelligence", tags=["Construction Intelligence"])


@router.post("/analyze", response_model=MasterIntelligenceResponse, summary="Analyze Construction Intelligence")
async def analyze_construction_site(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine),
    gemini_service: GeminiService = Depends(get_gemini_service)
):
    """
    Primary ConArk intelligence endpoint.
    Accepts operational site measurements, evaluates 5 ML models, runs rule alerts,
    computes project health score, and passes results to Gemini 2.5 Flash for structured AI summary.
    """
    request_id = str(uuid.uuid4())
    logger.info(f"Received /analyze request {request_id}")
    
    try:
        # 1. Run ML Engine & Deterministic Rules
        intelligence_result = engine.run_intelligence(payload.model_dump())
        
        # 2. Call Gemini 2.5 Flash Explanation Layer (with fallback guarantee)
        gemini_wrapper = await gemini_service.generate_construction_report(intelligence_result)
        
        timestamp_str = payload.timestamp or datetime.now().isoformat()
        
        response = MasterIntelligenceResponse(
            request_id=request_id,
            system="ConArk Systems",
            timestamp=timestamp_str,
            ml_results=intelligence_result["ml_results"],
            alerts=intelligence_result["alerts"],
            health=intelligence_result["health"],
            gemini_report=gemini_wrapper,
            system_status="success"
        )
        
        return response
        
    except Exception as e:
        logger.error(f"Error processing /analyze request {request_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal Intelligence Processing Error: {str(e)}")
