"""
Multi-objective function builder for Space Optimization Engine.
Combines weighted unused space, congestion penalty, movement cost, and safety buffer penalties.
"""

from pathlib import Path
from typing import Dict, Any
import yaml
from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("space_objective")


class MultiObjectiveEvaluator:
    """Builds and evaluates loss functions for space allocation optimization."""

    def __init__(self, config_path: Path = None):
        self.config_path = config_path or (settings.BASE_DIR / "config" / "optimization_weights.yaml")
        self.weights = self._load_weights()

    def _load_weights(self) -> Dict[str, float]:
        if not self.config_path.exists():
            return {
                "unused_space_weight": 10.0,
                "congestion_weight": 5.0,
                "movement_distance_weight": 3.0,
                "safety_buffer_penalty_weight": 20.0,
                "emergency_corridor_penalty": 25.0
            }
        with open(self.config_path, "r", encoding="utf-8") as f:
            cfg = yaml.safe_load(f)
            return cfg.get("weights", {})

    def build_objective_function(
        self,
        site_area_sqm: float,
        demand: Dict[str, float],
        worker_count: int,
        machinery_count: int
    ):
        """
        Returns objective loss function f(x) where x is array of 8 zone areas:
        x = [material, equipment, worker, safety, loading, waste, emergency, staging]
        """
        w_unused = float(self.weights.get("unused_space_weight", 10.0))
        w_congestion = float(self.weights.get("congestion_weight", 5.0))
        w_movement = float(self.weights.get("movement_distance_weight", 3.0))
        w_safety = float(self.weights.get("safety_buffer_penalty_weight", 20.0))
        w_emergency = float(self.weights.get("emergency_corridor_penalty", 25.0))

        req_safety = float(demand.get("safety_buffer", 20.0))
        req_emergency = float(demand.get("emergency_access", 50.0))
        req_material = float(demand.get("material_storage", 30.0))
        req_equipment = float(demand.get("equipment", 20.0))

        def objective(x):
            alloc_total = sum(x)
            unused = max(0.0, site_area_sqm - alloc_total)

            # 1. Wasted/Unused space loss
            unused_loss = (unused / site_area_sqm) ** 2 * w_unused

            # 2. Congestion loss (Worker & equipment crowding in allocated circulation areas)
            worker_area = max(1.0, x[2])
            equipment_area = max(1.0, x[1])
            congestion_loss = ((worker_count / worker_area) + (machinery_count / equipment_area)) * w_congestion

            # 3. Soft movement distance loss (excess material or equipment distance penalty)
            material_area = max(1.0, x[0])
            movement_loss = (material_area / site_area_sqm) * w_movement

            # 4. Safety & Emergency under-allocation penalties (quadratic if below required)
            safety_shortfall = max(0.0, req_safety - x[3])
            safety_loss = (safety_shortfall ** 2) * w_safety

            emergency_shortfall = max(0.0, req_emergency - x[6])
            emergency_loss = (emergency_shortfall ** 2) * w_emergency

            total_loss = unused_loss + congestion_loss + movement_loss + safety_loss + emergency_loss
            return total_loss

        return objective
