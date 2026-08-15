"""
Space Demand Estimator module.
Dynamically computes minimum required area for all 8 construction zones
using YAML coefficient configurations.
"""

from pathlib import Path
from typing import Dict, Any
import yaml
from conark.config.settings import settings
from conark.space.schemas import SpaceOptimizationInput
from conark.utils.logging import get_logger

logger = get_logger("demand_estimator")


class SpaceDemandEstimator:
    """Estimates required area (sqm) for each of the 8 construction site zones."""

    def __init__(self, config_path: Path = None):
        self.config_path = config_path or (settings.BASE_DIR / "config" / "space_coefficients.yaml")
        self.config = self._load_config()

    def _load_config(self) -> Dict[str, Any]:
        """Loads coefficient configuration from YAML file."""
        if not self.config_path.exists():
            logger.warning(f"Coefficients file not found at {self.config_path}. Using fallback default coefficients.")
            return self._fallback_config()
            
        with open(self.config_path, "r", encoding="utf-8") as f:
            return yaml.safe_load(f)

    def _fallback_config(self) -> Dict[str, Any]:
        return {
            "base_coefficients": {
                "material_space_per_1000kg": 15.0,
                "equipment_space_per_machine": 20.0,
                "heavy_equipment_space_per_machine": 45.0,
                "worker_space_per_person": 3.5,
                "loading_space_per_truck": 35.0,
                "waste_space_per_100kg": 5.0,
                "min_emergency_access_sqm": 80.0,
                "base_staging_sqm": 60.0
            },
            "stage_multipliers": {
                stage: {"equipment": 1.0, "material": 1.0, "heavy_equipment": 1.0, "staging": 1.0}
                for stage in ["FOUNDATION", "STRUCTURE", "MASONRY", "ELECTRICAL", "PLUMBING", "FINISHING", "MIXED", "OTHER"]
            },
            "safety_multipliers": {
                "LOW": {"buffer_percentage": 0.10, "emergency_multiplier": 1.0},
                "MEDIUM": {"buffer_percentage": 0.15, "emergency_multiplier": 1.15},
                "HIGH": {"buffer_percentage": 0.22, "emergency_multiplier": 1.30},
                "CRITICAL": {"buffer_percentage": 0.30, "emergency_multiplier": 1.50}
            }
        }

    def estimate_demand(self, input_data: SpaceOptimizationInput) -> Dict[str, float]:
        """
        Calculates required minimum area for:
        [material, equipment, worker, safety, loading, waste, emergency, staging]
        """
        base = self.config.get("base_coefficients", self._fallback_config()["base_coefficients"])
        stages = self.config.get("stage_multipliers", self._fallback_config()["stage_multipliers"])
        safeties = self.config.get("safety_multipliers", self._fallback_config()["safety_multipliers"])

        stage_str = str(input_data.construction_stage.value)
        safety_str = str(input_data.safety_requirement_level.value)

        stg_mult = stages.get(stage_str, {"equipment": 1.0, "material": 1.0, "heavy_equipment": 1.0, "staging": 1.0})
        sft_mult = safeties.get(safety_str, {"buffer_percentage": 0.20, "emergency_multiplier": 1.2})

        # 1. Material Storage Area Required
        req_material = (input_data.material_quantity_kg / 1000.0) * base.get("material_space_per_1000kg", 15.0) * stg_mult.get("material", 1.0)
        req_material = max(20.0, req_material)

        # 2. Equipment Area Required
        std_machines = max(0, input_data.machinery_count - input_data.heavy_machinery_count)
        req_equipment = (
            (std_machines * base.get("equipment_space_per_machine", 20.0) * stg_mult.get("equipment", 1.0)) +
            (input_data.heavy_machinery_count * base.get("heavy_equipment_space_per_machine", 45.0) * stg_mult.get("heavy_equipment", 1.0))
        )
        req_equipment = max(15.0 if input_data.machinery_count > 0 else 0.0, req_equipment)

        # 3. Worker Movement Area Required
        req_worker = input_data.worker_count * base.get("worker_space_per_person", 3.5)
        req_worker = max(15.0 if input_data.worker_count > 0 else 0.0, req_worker)

        # 4. Loading Zone Required
        req_loading = max(1, input_data.daily_truck_count) * base.get("loading_space_per_truck", 35.0) if input_data.loading_zone_available else 0.0

        # 5. Waste Area Required
        req_waste = (input_data.waste_generation_kg_per_day / 100.0) * base.get("waste_space_per_100kg", 5.0)
        req_waste = max(10.0, req_waste)

        # 6. Emergency Access Required
        if input_data.emergency_access_required:
            req_emergency = base.get("min_emergency_access_sqm", 80.0) * sft_mult.get("emergency_multiplier", 1.2)
        else:
            req_emergency = 0.0

        # 7. Staging Area Required
        req_staging = base.get("base_staging_sqm", 60.0) * stg_mult.get("staging", 1.0)

        # 8. Safety Buffer Area Required (Percentage of sum of operational areas)
        operational_sum = req_material + req_equipment + req_worker + req_loading + req_waste + req_staging
        req_safety = operational_sum * sft_mult.get("buffer_percentage", 0.20)
        req_safety = max(20.0, req_safety)

        demand = {
            "material_storage": round(req_material, 2),
            "equipment": round(req_equipment, 2),
            "worker_movement": round(req_worker, 2),
            "safety_buffer": round(req_safety, 2),
            "loading": round(req_loading, 2),
            "waste": round(req_waste, 2),
            "emergency_access": round(req_emergency, 2),
            "staging": round(req_staging, 2),
        }
        
        demand["total_required_sqm"] = round(sum(demand.values()), 2)
        return demand
