"""
Hard and soft constraint definitions for Space Optimization Engine.
"""

from typing import Dict, List, Tuple, Any
from conark.space.schemas import SpaceOptimizationInput, ConstraintItem


def build_hard_constraints(
    site_area_sqm: float,
    demand: Dict[str, float]
) -> List[Dict[str, Any]]:
    """
    Builds SciPy inequality constraints dicts (type 'ineq': fun(x) >= 0).
    Order of variables x = [
      0: material,
      1: equipment,
      2: worker,
      3: safety,
      4: loading,
      5: waste,
      6: emergency,
      7: staging
    ]
    """
    constraints = []

    # 1. Total allocated area <= site_area_sqm  =>  site_area_sqm - sum(x) >= 0
    constraints.append({
        "type": "ineq",
        "fun": lambda x: site_area_sqm - sum(x)
    })

    # 2. Zone minimum requirements: x[i] - required[i] >= 0
    zone_order = [
        "material_storage",
        "equipment",
        "worker_movement",
        "safety_buffer",
        "loading",
        "waste",
        "emergency_access",
        "staging"
    ]

    for idx, zone in enumerate(zone_order):
        req_val = demand.get(zone, 0.0)
        constraints.append({
            "type": "ineq",
            "fun": lambda x, i=idx, req=req_val: x[i] - req
        })

    return constraints


def evaluate_constraint_items(
    allocation_dict: Dict[str, float],
    demand: Dict[str, float]
) -> List[ConstraintItem]:
    """Evaluates constraint satisfaction for reporting."""
    mapping = [
        ("Material Storage", "material_storage_area_sqm", "material_storage"),
        ("Equipment Parking", "equipment_area_sqm", "equipment"),
        ("Worker Movement", "worker_movement_area_sqm", "worker_movement"),
        ("Safety Buffer Zone", "safety_buffer_area_sqm", "safety_buffer"),
        ("Loading/Unloading", "loading_area_sqm", "loading"),
        ("Waste Disposal", "waste_area_sqm", "waste"),
        ("Emergency Access Corridor", "emergency_access_area_sqm", "emergency_access"),
        ("Construction Staging", "staging_area_sqm", "staging"),
    ]

    items = []
    for label, alloc_key, req_key in mapping:
        req = demand.get(req_key, 0.0)
        alloc = allocation_dict.get(alloc_key, 0.0)
        satisfied = alloc >= (req - 1e-4)
        items.append(ConstraintItem(
            name=label,
            required_sqm=round(req, 2),
            allocated_sqm=round(alloc, 2),
            status="SATISFIED" if satisfied else "VIOLATED"
        ))

    return items
