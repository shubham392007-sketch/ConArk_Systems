"""
Core SciPy Optimization Engine for ConArk Systems Space Allocation.
Solves mathematical constrained optimization for 8 operational site zones and 2D spatial layouts.
"""

from typing import Dict, List, Tuple, Any, Optional
import numpy as np
from scipy.optimize import minimize

from conark.space.schemas import (
    SpaceOptimizationInput,
    SpaceAllocation,
    OptimizationStatusEnum,
    ZoneLayout
)
from conark.space.demand_estimator import SpaceDemandEstimator
from conark.space.ml_demand import SpaceDemandPredictor
from conark.space.constraints import build_hard_constraints, evaluate_constraint_items
from conark.space.objective import MultiObjectiveEvaluator
from conark.utils.logging import get_logger

logger = get_logger("space_optimizer")


class SpaceOptimizer:
    """Mathematical constrained optimizer for construction-site space allocation."""

    def __init__(self):
        self.demand_estimator = SpaceDemandEstimator()
        self.demand_predictor = SpaceDemandPredictor()
        self.objective_evaluator = MultiObjectiveEvaluator()

    def optimize_space(
        self,
        input_data: SpaceOptimizationInput
    ) -> Dict[str, Any]:
        """
        Executes constrained space allocation optimization.
        Returns dictionary with status, allocations, constraints, and optional 2D spatial layout.
        """
        site_area = float(input_data.site_area_sqm)

        # 1. Estimate required zone demand (sqm)
        demand = self.demand_estimator.estimate_demand(input_data)
        total_req_sqm = demand["total_required_sqm"]

        # 2. Check hard feasibility: If total required area > available site area
        if total_req_sqm > site_area:
            violation_msg = (
                f"Required minimum operational space ({total_req_sqm:.1f} sqm) "
                f"exceeds total available site area ({site_area:.1f} sqm) by {total_req_sqm - site_area:.1f} sqm."
            )
            logger.warning(f"Optimization INFEASIBLE: {violation_msg}")
            
            # Return INFEASIBLE response without inventing allocations
            constraint_items = evaluate_constraint_items({}, demand)
            for item in constraint_items:
                item.status = "VIOLATED" if item.required_sqm > (site_area / 8.0) else "SATISFIED"

            return {
                "status": OptimizationStatusEnum.INFEASIBLE,
                "reason": violation_msg,
                "demand": demand,
                "allocation": None,
                "constraints": [c.model_dump() for c in constraint_items],
                "spatial_layout": [],
                "reasoning": [
                    f"Infeasible site layout: Site size of {site_area:.1f} sqm cannot fit required operational demand of {total_req_sqm:.1f} sqm.",
                    "Reduce worker count, machinery density, or material inventory to make allocation feasible."
                ]
            }

        # 3. Setup SciPy optimization problem
        # Zone order: [material, equipment, worker, safety, loading, waste, emergency, staging]
        zone_keys = [
            "material_storage",
            "equipment",
            "worker_movement",
            "safety_buffer",
            "loading",
            "waste",
            "emergency_access",
            "staging"
        ]

        # Initial guess: x0 = required demand values
        x0 = np.array([demand[k] for k in zone_keys], dtype=float)

        # Bounds for each zone: [required, site_area]
        bounds = [(demand[k], site_area) for k in zone_keys]

        # Hard inequality constraints
        scipy_constraints = build_hard_constraints(site_area, demand)

        # Multi-objective loss function
        obj_func = self.objective_evaluator.build_objective_function(
            site_area,
            demand,
            input_data.worker_count,
            input_data.machinery_count
        )

        # 4. Run SciPy SLSQP optimization
        res = minimize(
            fun=obj_func,
            x0=x0,
            method="SLSQP",
            bounds=bounds,
            constraints=scipy_constraints,
            options={"maxiter": 200, "ftol": 1e-4}
        )

        if res.success or res.fun < 1e5:
            opt_status = OptimizationStatusEnum.OPTIMAL if res.success else OptimizationStatusEnum.FEASIBLE
            sol_x = np.round(res.x, 2)
        else:
            opt_status = OptimizationStatusEnum.FEASIBLE
            sol_x = np.round(x0, 2)  # Fallback to minimum required demand vector

        # Build SpaceAllocation object
        allocation_dict = {
            "material_storage_area_sqm": float(sol_x[0]),
            "equipment_area_sqm": float(sol_x[1]),
            "worker_movement_area_sqm": float(sol_x[2]),
            "safety_buffer_area_sqm": float(sol_x[3]),
            "loading_area_sqm": float(sol_x[4]),
            "waste_area_sqm": float(sol_x[5]),
            "emergency_access_area_sqm": float(sol_x[6]),
            "staging_area_sqm": float(sol_x[7])
        }

        # Evaluate constraints
        constraint_items = evaluate_constraint_items(allocation_dict, demand)

        # 5. Spatial 2D rectangular layout positioning (if site dimensions provided)
        spatial_layout = []
        if input_data.site_length_m and input_data.site_width_m and input_data.site_length_m > 0 and input_data.site_width_m > 0:
            spatial_layout = self._generate_2d_layout(
                allocation_dict,
                float(input_data.site_length_m),
                float(input_data.site_width_m)
            )

        # 6. Generate deterministic reasoning statements
        reasoning = self._generate_reasoning(input_data, demand, allocation_dict)

        return {
            "status": opt_status,
            "reason": None,
            "demand": demand,
            "allocation": allocation_dict,
            "constraints": [c.model_dump() for c in constraint_items],
            "spatial_layout": [z.model_dump() for z in spatial_layout],
            "reasoning": reasoning
        }

    def _generate_2d_layout(
        self,
        allocation: Dict[str, float],
        site_length: float,
        site_width: float
    ) -> List[ZoneLayout]:
        """Simple rectangular grid packing layout generator for 2D visualization."""
        layout = []
        curr_x = 0.0
        curr_y = 0.0
        row_max_h = 0.0

        zone_names = [
            ("Material Storage", allocation["material_storage_area_sqm"]),
            ("Equipment Parking", allocation["equipment_area_sqm"]),
            ("Worker Circulation", allocation["worker_movement_area_sqm"]),
            ("Safety Buffer", allocation["safety_buffer_area_sqm"]),
            ("Loading/Unloading", allocation["loading_area_sqm"]),
            ("Waste Area", allocation["waste_area_sqm"]),
            ("Emergency Access Corridor", allocation["emergency_access_area_sqm"]),
            ("Staging Area", allocation["staging_area_sqm"]),
        ]

        for label, area in zone_names:
            if area <= 0.1:
                continue
            # Aspect ratio 1.5 for rectangular zones
            w = round(min(np.sqrt(area * 1.5), site_length - curr_x), 2)
            if w <= 0.5:
                w = round(site_length / 2.0, 2)
            h = round(area / w, 2)

            if curr_x + w > site_length + 0.1:
                curr_x = 0.0
                curr_y += row_max_h
                row_max_h = 0.0

            layout.append(ZoneLayout(
                zone=label,
                x=round(curr_x, 2),
                y=round(curr_y, 2),
                width=w,
                height=h
            ))

            curr_x += w
            row_max_h = max(row_max_h, h)

        return layout

    def _generate_reasoning(
        self,
        input_data: SpaceOptimizationInput,
        demand: Dict[str, float],
        allocation: Dict[str, float]
    ) -> List[str]:
        """Generates clear, deterministic reasoning statements based on inputs and results."""
        reasons = []

        # Material reason
        reasons.append(
            f"Material storage allocated {allocation['material_storage_area_sqm']:.1f} sqm based on {input_data.material_quantity_kg:.0f} kg material volume for stage {input_data.construction_stage.value}."
        )

        # Equipment reason
        if input_data.machinery_count > 0:
            reasons.append(
                f"Equipment area allocated {allocation['equipment_area_sqm']:.1f} sqm accommodating {input_data.machinery_count} machines ({input_data.heavy_machinery_count} heavy units)."
            )

        # Safety reason
        reasons.append(
            f"Safety buffer allocated {allocation['safety_buffer_area_sqm']:.1f} sqm to enforce {input_data.safety_requirement_level.value} safety protocol level."
        )

        # Emergency corridor reason
        if input_data.emergency_access_required:
            reasons.append(
                f"Emergency access corridor allocated {allocation['emergency_access_area_sqm']:.1f} sqm preserving unimpeded emergency evacuation channels."
            )

        return reasons
