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
from typing import Optional, Dict, Any
from conark.api.dependencies import get_intelligence_engine, get_gemini_service, get_optional_user
from conark.db.services.prediction_service import PredictionService
from conark.inference.predictor import ConstructionIntelligenceEngine
from conark.gemini.service import GeminiService
from conark.utils.logging import get_logger

logger = get_logger("intelligence_route")

router = APIRouter(prefix="/intelligence", tags=["Construction Intelligence"])


@router.post("/analyze", response_model=MasterIntelligenceResponse, summary="Analyze Construction Intelligence")
async def analyze_construction_site(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine),
    gemini_service: GeminiService = Depends(get_gemini_service),
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Primary ConArk intelligence endpoint.
    Accepts operational site measurements, evaluates 5 ML models, runs rule alerts,
    computes project health score, and passes results to Gemini 2.5 Flash for structured AI summary.
    If authenticated, automatically persists prediction history to Supabase PostgreSQL.
    """
    request_id = str(uuid.uuid4())
    logger.info(f"Received /analyze request {request_id} (User: {current_user['id'] if current_user else 'Guest'})")
    
    try:
        # 1. Run ML Engine & Deterministic Rules
        intelligence_result = engine.run_intelligence(payload.model_dump())
        
        # 2. Call Gemini 2.5 Flash Explanation Layer (with fallback guarantee)
        gemini_wrapper = await gemini_service.generate_construction_report(intelligence_result)
        
        timestamp_str = payload.timestamp or datetime.now().isoformat()
        
        # 3. Persist prediction to Supabase if user is authenticated
        if current_user and current_user.get("id"):
            try:
                target_model = payload.target_model or "all_models"
                explanation_text = None
                if gemini_wrapper:
                    if hasattr(gemini_wrapper, "report") and gemini_wrapper.report and hasattr(gemini_wrapper.report, "executive_summary"):
                        explanation_text = gemini_wrapper.report.executive_summary
                    elif hasattr(gemini_wrapper, "executive_summary"):
                        explanation_text = gemini_wrapper.executive_summary
                    elif isinstance(gemini_wrapper, dict):
                        explanation_text = gemini_wrapper.get("report", {}).get("executive_summary") or gemini_wrapper.get("executive_summary")

                PredictionService.save_prediction(
                    user_id=current_user["id"],
                    model_name=target_model,
                    model_version="v1.0.0",
                    prediction_type="multivariate_intelligence",
                    input_data=payload.model_dump(),
                    prediction_output=intelligence_result["ml_results"],
                    explanation=explanation_text,
                    confidence_score=intelligence_result.get("health", {}).get("overall_score"),
                    project_id=payload.project_id
                )
                logger.info(f"Persisted intelligence prediction for user {current_user['id']} (model: {target_model})")
            except Exception as save_err:
                logger.error(f"Could not persist prediction to Supabase: {save_err}", exc_info=True)

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

