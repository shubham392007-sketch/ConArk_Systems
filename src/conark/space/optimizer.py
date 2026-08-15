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

        x0 = np.array([demand[k] for k in zone_keys], dtype=float)
        bounds = [(demand[k], site_area) for k in zone_keys]
        scipy_constraints = build_hard_constraints(site_area, demand)

        obj_func = self.objective_evaluator.build_objective_function(
            site_area,
            demand,
            input_data.worker_count,
            input_data.machinery_count
        )

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
            sol_x = np.round(x0, 2)

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

        constraint_items = evaluate_constraint_items(allocation_dict, demand)

        # 5. Spatial 2D rectangular layout positioning
        site_l = float(input_data.site_length_m) if (input_data.site_length_m and input_data.site_length_m > 0) else 40.0
        site_w = float(input_data.site_width_m) if (input_data.site_width_m and input_data.site_width_m > 0) else 30.0

        spatial_layout = self._generate_2d_layout(allocation_dict, site_l, site_w)

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
        """
        Generates structured 3-tier grid layout for 2D spatial map visualization.
        Packs all 8 operational site zones into non-overlapping proportional rectangles.
        """
        layout = []

        # Tier 1: Main Work Zones (Top Row)
        # Material Storage & Equipment Area
        mat_area = allocation.get("material_storage_area_sqm", 320.0)
        eq_area = allocation.get("equipment_area_sqm", 180.0)
        t1_total = mat_area + eq_area
        t1_h = round(site_width * 0.40, 2)
        
        mat_w = round(site_length * (mat_area / max(t1_total, 1.0)), 2)
        eq_w = round(site_length - mat_w, 2)

        layout.append(ZoneLayout(zone="Material Storage", x=0.0, y=0.0, width=mat_w, height=t1_h))
        layout.append(ZoneLayout(zone="Equipment Area", x=mat_w, y=0.0, width=eq_w, height=t1_h))

        # Tier 2: Circulation & Staging (Middle Row)
        # Worker Movement & Staging Area
        wrk_area = allocation.get("worker_movement_area_sqm", 150.0)
        stg_area = allocation.get("staging_area_sqm", 100.0)
        t2_total = wrk_area + stg_area
        t2_h = round(site_width * 0.35, 2)
        t2_y = t1_h

        wrk_w = round(site_length * (wrk_area / max(t2_total, 1.0)), 2)
        stg_w = round(site_length - wrk_w, 2)

        layout.append(ZoneLayout(zone="Worker Movement", x=0.0, y=t2_y, width=wrk_w, height=t2_h))
        layout.append(ZoneLayout(zone="Staging Area", x=wrk_w, y=t2_y, width=stg_w, height=t2_h))

        # Tier 3: Logistics & Safety (Bottom Rows)
        # Safety Buffer, Loading/Unloading, Waste Dump (Bottom Row 1)
        safe_area = allocation.get("safety_buffer_area_sqm", 120.0)
        load_area = allocation.get("loading_area_sqm", 80.0)
        waste_area = allocation.get("waste_area_sqm", 40.0)
        t3_total = safe_area + load_area + waste_area
        t3_h = round(site_width * 0.18, 2)
        t3_y = round(t1_h + t2_h, 2)

        safe_w = round(site_length * (safe_area / max(t3_total, 1.0)), 2)
        load_w = round(site_length * (load_area / max(t3_total, 1.0)), 2)
        waste_w = round(site_length - safe_w - load_w, 2)

        layout.append(ZoneLayout(zone="Safety Buffer", x=0.0, y=t3_y, width=safe_w, height=t3_h))
        layout.append(ZoneLayout(zone="Loading / Unloading", x=safe_w, y=t3_y, width=load_w, height=t3_h))
        layout.append(ZoneLayout(zone="Waste Dump", x=round(safe_w + load_w, 2), y=t3_y, width=waste_w, height=t3_h))

        # Tier 4: Emergency Access Corridor (Full Width Strip at Bottom)
        t4_h = round(site_width - (t1_h + t2_h + t3_h), 2)
        t4_h = max(t4_h, round(site_width * 0.07, 2))
        t4_y = round(site_width - t4_h, 2)

        layout.append(ZoneLayout(zone="Emergency Access Corridor", x=0.0, y=t4_y, width=site_length, height=t4_h))

        return layout

    def _generate_reasoning(
        self,
        input_data: SpaceOptimizationInput,
        demand: Dict[str, float],
        allocation: Dict[str, float]
    ) -> List[str]:
        """Generates clear, deterministic reasoning statements based on inputs and results."""
        reasons = []

        reasons.append(
            f"Material storage allocated {allocation['material_storage_area_sqm']:.1f} sqm based on {input_data.material_quantity_kg:.0f} kg material volume for stage {input_data.construction_stage.value}."
        )

        if input_data.machinery_count > 0:
            reasons.append(
                f"Equipment area allocated {allocation['equipment_area_sqm']:.1f} sqm accommodating {input_data.machinery_count} machines ({input_data.heavy_machinery_count} heavy units)."
            )

        reasons.append(
            f"Safety buffer allocated {allocation['safety_buffer_area_sqm']:.1f} sqm to enforce {input_data.safety_requirement_level.value} safety protocol level."
        )

        if input_data.emergency_access_required:
            reasons.append(
                f"Emergency access corridor allocated {allocation['emergency_access_area_sqm']:.1f} sqm preserving unimpeded emergency evacuation channels."
            )

        return reasons
