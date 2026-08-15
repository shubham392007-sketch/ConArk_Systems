"""
Alert engine endpoint.
"""

from typing import List
from fastapi import APIRouter, Depends
from conark.api.schemas.input import InferenceInput
from conark.api.schemas.response import AlertItem
from conark.api.dependencies import get_intelligence_engine
from conark.inference.predictor import ConstructionIntelligenceEngine

router = APIRouter(tags=["Alerts"])


@router.post("/alerts", response_model=List[AlertItem], summary="Get Prioritized Alerts")
def get_alerts(
    payload: InferenceInput,
    engine: ConstructionIntelligenceEngine = Depends(get_intelligence_engine)
):
    """Evaluates site operational data and returns prioritized safety, material, equipment, and schedule alerts."""
    res = engine.run_intelligence(payload.model_dump())
    return res["alerts"]
