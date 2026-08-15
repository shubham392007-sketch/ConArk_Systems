"""
Unified Master Response Pydantic Schema for ConArk Systems REST APIs.
"""

from typing import Dict, List, Any, Optional
from pydantic import BaseModel, Field
from conark.api.schemas.prediction import (
    PerformancePredictionResponse,
    RiskPredictionResponse,
    CostForecastResponse,
    TimeForecastResponse,
    OptimizationResponse,
)
from conark.gemini.schemas import GeminiReportWrapper


class AlertItem(BaseModel):
    type: str = Field(..., description="Alert domain: SAFETY, MATERIAL, EQUIPMENT, SCHEDULE, RISK, COST")
    severity: str = Field(..., description="Severity level: LOW, MEDIUM, HIGH, CRITICAL")
    title: str = Field(..., description="Short alert headline")
    message: str = Field(..., description="Detailed alert description")
    source: str = Field(default="rule_engine", description="Source component")
    priority: int = Field(..., description="Alert priority integer: 1 (Critical) to 4 (Low)")


class HealthScoreResponse(BaseModel):
    overall_health_score: int = Field(..., description="ConArk overall project health score (0 to 100)")
    health_status: str = Field(..., description="Overall health status: Excellent, Good, Needs Attention, Critical")
    components: Dict[str, float] = Field(..., description="Normalized component scores")


class MLResultsPayload(BaseModel):
    performance: PerformancePredictionResponse
    risk: RiskPredictionResponse
    cost_forecast: CostForecastResponse
    time_forecast: TimeForecastResponse
    optimization: OptimizationResponse


class MasterIntelligenceResponse(BaseModel):
    request_id: str = Field(..., description="Unique UUID request identifier")
    system: str = Field(default="ConArk Systems", description="System identifier")
    timestamp: str = Field(..., description="ISO request timestamp")
    ml_results: MLResultsPayload = Field(..., description="Aggregated predictions from all 5 ML models")
    alerts: List[AlertItem] = Field(default=[], description="Prioritized operational alerts list")
    health: HealthScoreResponse = Field(..., description="Unified project health score")
    gemini_report: GeminiReportWrapper = Field(..., description="Structured AI report or fallback from Gemini 2.5 Flash")
    system_status: str = Field(default="success", description="System operational status")
