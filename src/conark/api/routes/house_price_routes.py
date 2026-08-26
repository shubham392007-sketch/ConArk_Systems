"""
FastAPI Routes for House Price Prediction Model (06 House Price Prediction Intelligence).
Accepts property dimensions, runs XGBoost regression pipeline, generates Gemini structured appraisal,
and persists prediction history in Supabase.
"""

from typing import Optional, Dict, Any, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from conark.models.house_price_model import HousePriceModel
from conark.api.dependencies import get_optional_user, get_gemini_service
from conark.gemini.service import GeminiService
from conark.db.services.prediction_service import PredictionService
from conark.utils.logging import get_logger

logger = get_logger("house_price_routes")

router = APIRouter(tags=["House Price Prediction"])
_house_price_model: Optional[HousePriceModel] = None


def get_house_price_model() -> HousePriceModel:
    """Singleton getter for House Price ML Model."""
    global _house_price_model
    if _house_price_model is None:
        _house_price_model = HousePriceModel()
        _house_price_model.load()
    return _house_price_model


class HousePricePredictRequest(BaseModel):
    square_feet: float = Field(..., ge=300, le=10000, description="Gross living area in square feet")
    bedrooms: int = Field(..., ge=1, le=10, description="Number of bedrooms (1-10)")
    bathrooms: float = Field(..., ge=1.0, le=8.0, description="Number of bathrooms (1-8)")
    neighborhood: str = Field(..., description="Neighborhood classification: Urban, Suburb, or Rural")
    year_built: int = Field(..., ge=1950, le=2026, description="Year property was constructed (1950-2026)")
    project_id: Optional[str] = Field(default=None, description="Optional associated workspace project ID")


class PriceRange(BaseModel):
    low: int = Field(..., description="Lower valuation bound")
    high: int = Field(..., description="Upper valuation bound")


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    percentage: float


class HousePricePredictResponse(BaseModel):
    predicted_price: int
    currency: str = "USD"
    confidence: float
    price_per_sqft: float
    price_range: PriceRange
    feature_importance: List[FeatureImportanceItem]
    gemini_explanation: str
    recommendation: str
    gemini_report: Optional[Dict[str, Any]] = None
    prediction_id: Optional[str] = None
    created_at: Optional[str] = None


@router.post(
    "/models/house-price/predict",
    response_model=HousePricePredictResponse,
    summary="Predict Residential House Price via XGBoost + Gemini AI",
    description="Predicts residential property value, price ranges, feature importances, and generates structured AI appraisal report."
)
@router.post(
    "/house-price/predict",
    response_model=HousePricePredictResponse,
    include_in_schema=False
)
async def predict_house_price(
    request: HousePricePredictRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user),
    gemini_svc: GeminiService = Depends(get_gemini_service)
):
    """
    POST /api/v1/models/house-price/predict
    Executes supervised regression on property parameters and synthesizes Gemini intelligence narrative.
    """
    try:
        model = get_house_price_model()
        ml_result = model.predict(
            square_feet=request.square_feet,
            bedrooms=request.bedrooms,
            bathrooms=request.bathrooms,
            neighborhood=request.neighborhood,
            year_built=request.year_built
        )

        # Generate Gemini 2.5 Flash Structured Explanation
        gemini_wrapper = await gemini_svc.generate_house_price_report(ml_result)
        
        gemini_dict = {}
        gemini_explanation_text = ml_result.get("recommendation", "")
        if gemini_wrapper.house_price_report:
            gemini_dict = gemini_wrapper.house_price_report.model_dump()
            gemini_explanation_text = gemini_wrapper.house_price_report.executive_summary

        prediction_id = None
        now_iso = datetime.utcnow().isoformat()

        # Persist prediction to Supabase if user authenticated
        if current_user and current_user.get("id"):
            try:
                saved = PredictionService.save_prediction(
                    user_id=current_user["id"],
                    model_name="house_price_prediction",
                    model_version="v1.0.0",
                    prediction_type="regression",
                    input_data=request.model_dump(),
                    prediction_output={
                        "predicted_price": ml_result["predicted_price"],
                        "confidence": ml_result["confidence"],
                        "price_per_sqft": ml_result["price_per_sqft"],
                        "price_range": ml_result["price_range"],
                        "feature_importance": ml_result["feature_importance"],
                        "recommendation": ml_result["recommendation"],
                        "gemini_report": gemini_dict
                    },
                    explanation=gemini_explanation_text,
                    confidence_score=ml_result["confidence"],
                    project_id=request.project_id
                )
                if saved and "id" in saved:
                    prediction_id = str(saved["id"])
                logger.info(f"Persisted house price prediction for user {current_user['id']}")
            except Exception as save_err:
                logger.warning(f"Could not persist house price prediction to database: {save_err}")

        return HousePricePredictResponse(
            predicted_price=ml_result["predicted_price"],
            currency=ml_result["currency"],
            confidence=ml_result["confidence"],
            price_per_sqft=ml_result["price_per_sqft"],
            price_range=PriceRange(**ml_result["price_range"]),
            feature_importance=[FeatureImportanceItem(**item) for item in ml_result["feature_importance"]],
            gemini_explanation=gemini_explanation_text,
            recommendation=ml_result["recommendation"],
            gemini_report=gemini_dict,
            prediction_id=prediction_id,
            created_at=now_iso
        )
    except Exception as e:
        logger.error(f"House price prediction error: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"House price prediction failed: {str(e)}"
        )
