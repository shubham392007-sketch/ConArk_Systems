"""
Service layer for Space Optimization Engine.
Orchestrates input feature engineering, SciPy optimization, metric computation,
and Gemini 2.5 Flash space report generation.
"""

import uuid
from typing import Dict, Any
from conark.space.schemas import SpaceOptimizationInput, SpaceOptimizationResponse, SpaceAllocation, SpaceMetrics
from conark.space.features import compute_space_features
from conark.space.optimizer import SpaceOptimizer
from conark.space.metrics import calculate_space_metrics
from conark.gemini.service import GeminiService
from conark.utils.logging import get_logger

logger = get_logger("space_service")


class SpaceOptimizationService:
    """Service orchestrator for construction-site space allocation."""

    def __init__(self):
        self.optimizer = SpaceOptimizer()
        self.gemini_service = GeminiService()

    async def optimize_space_layout(self, input_data: SpaceOptimizationInput) -> SpaceOptimizationResponse:
        """
        Executes end-to-end space allocation optimization and returns SpaceOptimizationResponse.
        """
        request_id = str(uuid.uuid4())
        logger.info(f"Executing space optimization request {request_id} for stage {input_data.construction_stage.value}...")

        # 1. Feature Engineering
        features = compute_space_features(input_data)

        # 2. Optimization Engine Execution
        opt_res = self.optimizer.optimize_space(input_data)
        opt_status = opt_res["status"]

        if opt_status.value == "INFEASIBLE":
            return SpaceOptimizationResponse(
                request_id=request_id,
                status=opt_status,
                reason=opt_res.get("reason"),
                allocation=None,
                metrics=None,
                constraints=opt_res.get("constraints", []),
                spatial_layout=[],
                reasoning=opt_res.get("reasoning", []),
                gemini_report=self.gemini_service.generate_fallback_space_report(opt_res, reason=opt_res.get("reason")).model_dump()
            )

        # 3. Calculate Space Metrics
        allocation_dict = opt_res["allocation"]
        demand_dict = opt_res["demand"]
        metrics = calculate_space_metrics(allocation_dict, demand_dict, input_data)

        # Build payload for Gemini
        space_payload = {
            "request_id": request_id,
            "project": {
                "site_area_sqm": input_data.site_area_sqm,
                "construction_stage": input_data.construction_stage.value,
                "worker_count": input_data.worker_count,
                "machinery_count": input_data.machinery_count,
                "heavy_machinery_count": input_data.heavy_machinery_count,
                "safety_requirement_level": input_data.safety_requirement_level.value
            },
            "features": features,
            "demand": demand_dict,
            "status": opt_status.value,
            "allocation": allocation_dict,
            "metrics": metrics.model_dump(),
            "reasoning": opt_res.get("reasoning", [])
        }

        # 4. Generate AI Explanation Report via Gemini
        gemini_wrapper = await self.gemini_service.generate_space_report(space_payload)

        return SpaceOptimizationResponse(
            request_id=request_id,
            status=opt_status,
            reason=None,
            allocation=SpaceAllocation(**allocation_dict),
            metrics=metrics,
            constraints=opt_res.get("constraints", []),
            spatial_layout=opt_res.get("spatial_layout", []),
            reasoning=opt_res.get("reasoning", []),
            gemini_report=gemini_wrapper.model_dump()
        )
