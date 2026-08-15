"""
Pydantic schemas for individual prediction and forecast outputs.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field


class PerformancePredictionResponse(BaseModel):
    prediction: str = Field(..., description="Performance class: Poor, Average, Good, Excellent")
    confidence: float = Field(..., description="Model classification confidence (0.0 to 1.0)")
    probabilities: Dict[str, float] = Field(..., description="Class probability distribution")
    top_factors: List[Dict[str, Any]] = Field(default=[], description="Top contributing feature importances")


class RiskPredictionResponse(BaseModel):
    risk_score: float = Field(..., description="Predicted risk score (0.0 to 100.0)")
    risk_level: str = Field(..., description="Risk level category: Low, Moderate, High, Critical")
    estimated_range: Dict[str, float] = Field(..., description="95% prediction interval [lower, upper]")
    top_factors: List[Dict[str, Any]] = Field(default=[], description="Top contributing feature importances")


class CostForecastResponse(BaseModel):
    predicted_cost_deviation: float = Field(..., description="Forecasted cost deviation in dollars")
    budget_status: str = Field(..., description="Budget status category: Under Budget, On Budget, Over Budget")
    top_factors: List[Dict[str, Any]] = Field(default=[], description="Top contributing feature importances")


class TimeForecastResponse(BaseModel):
    predicted_time_deviation_days: float = Field(..., description="Forecasted schedule deviation in days")
    schedule_status: str = Field(..., description="Schedule status category: Ahead, On Schedule, Delayed")
    top_factors: List[Dict[str, Any]] = Field(default=[], description="Top contributing feature importances")


class OptimizationResponse(BaseModel):
    recommendation: str = Field(..., description="Recommended optimization suggestion")
    confidence: float = Field(..., description="Recommendation confidence")
    supporting_factors: List[str] = Field(..., description="Deterministic operational supporting factors")
    top_factors: List[Dict[str, Any]] = Field(default=[], description="Top feature importances")
