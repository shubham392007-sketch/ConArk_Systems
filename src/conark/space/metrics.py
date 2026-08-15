"""
Metrics calculator for Space Optimization Engine.
Calculates space utilization %, space efficiency score, congestion score, and safety compliance score.
"""

from typing import Dict, Any
from conark.space.schemas import SpaceMetrics, SpaceOptimizationInput


def calculate_space_metrics(
    allocation: Dict[str, float],
    demand: Dict[str, float],
    input_data: SpaceOptimizationInput
) -> SpaceMetrics:
    """Calculates overall space efficiency, congestion index, and safety compliance."""
    site_area = max(1.0, float(input_data.site_area_sqm))
    total_allocated = sum(allocation.values())
    unused_area = max(0.0, site_area - total_allocated)
    
    # 1. Utilization %
    utilization_pct = min(100.0, (total_allocated / site_area) * 100.0)

    # 2. Congestion score (Worker & machinery density relative to worker/equipment space)
    worker_sqm = max(1.0, allocation.get("worker_movement_area_sqm", 1.0))
    equipment_sqm = max(1.0, allocation.get("equipment_area_sqm", 1.0))

    worker_density = input_data.worker_count / worker_sqm
    equipment_density = input_data.machinery_count / equipment_sqm
    
    # Congestion score 0 (uncrowded) to 100 (extreme crowding)
    congestion_score = min(100.0, (worker_density * 30.0 + equipment_density * 40.0))

    # 3. Safety Compliance Score
    req_safety = demand.get("safety_buffer", 20.0)
    alloc_safety = allocation.get("safety_buffer_area_sqm", 0.0)
    req_emergency = demand.get("emergency_access", 50.0)
    alloc_emergency = allocation.get("emergency_access_area_sqm", 0.0)

    safety_ratio = min(1.0, alloc_safety / max(1.0, req_safety))
    emergency_ratio = min(1.0, alloc_emergency / max(1.0, req_emergency)) if req_emergency > 0 else 1.0

    safety_compliance_score = round(((safety_ratio * 0.6) + (emergency_ratio * 0.4)) * 100.0, 1)

    # 4. Overall Space Efficiency Score
    # Rewards high utilization (without over-congestion) and high safety compliance
    efficiency_base = (utilization_pct * 0.4) + (safety_compliance_score * 0.4) + ((100.0 - congestion_score) * 0.2)
    space_efficiency_score = round(max(0.0, min(100.0, efficiency_base)), 1)

    return SpaceMetrics(
        total_allocated_area_sqm=round(total_allocated, 2),
        unused_area_sqm=round(unused_area, 2),
        space_utilization_percentage=round(utilization_pct, 2),
        space_efficiency_score=space_efficiency_score,
        congestion_score=round(congestion_score, 1),
        safety_compliance_score=safety_compliance_score
    )
