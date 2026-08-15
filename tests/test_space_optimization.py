"""
Unit and integration tests for Space Optimization Engine.
Tests input validation, feature engineering, demand estimation, SciPy optimization,
hard and soft constraints, infeasible layout handling, 2D coordinates, Gemini fallback, and FastAPI REST endpoint.
"""

import pytest
from fastapi.testclient import TestClient

from conark.space.schemas import SpaceOptimizationInput, ConstructionStageEnum, SafetyLevelEnum, OptimizationStatusEnum
from conark.space.features import compute_space_features
from conark.space.demand_estimator import SpaceDemandEstimator
from conark.space.optimizer import SpaceOptimizer
from conark.space.metrics import calculate_space_metrics
from conark.api.main import app

client = TestClient(app)


def test_space_input_validation():
    """Test Pydantic validation for space optimization input."""
    # Valid input
    inp = SpaceOptimizationInput(
        site_area_sqm=1200.0,
        construction_stage=ConstructionStageEnum.STRUCTURE,
        material_quantity_kg=5000.0,
        machinery_count=8,
        heavy_machinery_count=3,
        worker_count=65,
        estimated_daily_material_usage_kg=850.0,
        waste_generation_kg_per_day=250.0,
        safety_requirement_level=SafetyLevelEnum.HIGH,
        emergency_access_required=True
    )
    assert inp.site_area_sqm == 1200.0
    assert inp.construction_stage == ConstructionStageEnum.STRUCTURE

    # Invalid negative site area
    with pytest.raises(ValueError):
        SpaceOptimizationInput(
            site_area_sqm=-100.0,
            construction_stage=ConstructionStageEnum.STRUCTURE,
            material_quantity_kg=1000.0,
            machinery_count=2,
            heavy_machinery_count=1,
            worker_count=10,
            estimated_daily_material_usage_kg=100.0,
            waste_generation_kg_per_day=20.0
        )


def test_space_feature_engineering():
    """Test space feature calculation."""
    inp = SpaceOptimizationInput(
        site_area_sqm=1000.0,
        construction_stage=ConstructionStageEnum.FOUNDATION,
        material_quantity_kg=10000.0,
        machinery_count=10,
        heavy_machinery_count=4,
        worker_count=50,
        estimated_daily_material_usage_kg=1000.0,
        waste_generation_kg_per_day=200.0
    )
    feats = compute_space_features(inp)
    assert feats["worker_density"] == 0.05
    assert feats["machinery_density"] == 0.01
    assert feats["heavy_machinery_ratio"] == 0.4


def test_demand_estimator():
    """Test YAML-configured demand estimation."""
    estimator = SpaceDemandEstimator()
    inp = SpaceOptimizationInput(
        site_area_sqm=1500.0,
        construction_stage=ConstructionStageEnum.STRUCTURE,
        material_quantity_kg=5000.0,
        machinery_count=6,
        heavy_machinery_count=2,
        worker_count=40,
        estimated_daily_material_usage_kg=500.0,
        waste_generation_kg_per_day=100.0,
        safety_requirement_level=SafetyLevelEnum.HIGH
    )
    demand = estimator.estimate_demand(inp)
    assert "material_storage" in demand
    assert "safety_buffer" in demand
    assert demand["total_required_sqm"] > 0.0


def test_scipy_optimizer_feasible():
    """Test SciPy optimizer on feasible site allocation problem."""
    optimizer = SpaceOptimizer()
    inp = SpaceOptimizationInput(
        site_area_sqm=1200.0,
        construction_stage=ConstructionStageEnum.STRUCTURE,
        material_quantity_kg=5000.0,
        machinery_count=8,
        heavy_machinery_count=3,
        worker_count=65,
        estimated_daily_material_usage_kg=850.0,
        waste_generation_kg_per_day=250.0,
        safety_requirement_level=SafetyLevelEnum.HIGH
    )
    res = optimizer.optimize_space(inp)
    assert res["status"] in [OptimizationStatusEnum.OPTIMAL, OptimizationStatusEnum.FEASIBLE]
    alloc = res["allocation"]
    assert sum(alloc.values()) <= 1200.0
    assert alloc["material_storage_area_sqm"] >= 20.0
    assert alloc["safety_buffer_area_sqm"] >= 20.0


def test_scipy_optimizer_infeasible():
    """Test optimizer handling when site area is too small for required minimum space."""
    optimizer = SpaceOptimizer()
    # Extremely small site area (100 sqm) with massive demand requirements
    inp = SpaceOptimizationInput(
        site_area_sqm=100.0,
        construction_stage=ConstructionStageEnum.STRUCTURE,
        material_quantity_kg=50000.0,
        machinery_count=20,
        heavy_machinery_count=10,
        worker_count=150,
        estimated_daily_material_usage_kg=5000.0,
        waste_generation_kg_per_day=1000.0,
        safety_requirement_level=SafetyLevelEnum.CRITICAL
    )
    res = optimizer.optimize_space(inp)
    assert res["status"] == OptimizationStatusEnum.INFEASIBLE
    assert res["allocation"] is None
    assert "exceeds total available site area" in res["reason"]


def test_spatial_2d_layout():
    """Test 2D spatial layout coordinate generation."""
    optimizer = SpaceOptimizer()
    inp = SpaceOptimizationInput(
        site_area_sqm=1200.0,
        site_length_m=40.0,
        site_width_m=30.0,
        construction_stage=ConstructionStageEnum.STRUCTURE,
        material_quantity_kg=5000.0,
        machinery_count=6,
        heavy_machinery_count=2,
        worker_count=40,
        estimated_daily_material_usage_kg=500.0,
        waste_generation_kg_per_day=100.0
    )
    res = optimizer.optimize_space(inp)
    assert len(res["spatial_layout"]) > 0
    first_zone = res["spatial_layout"][0]
    assert first_zone["width"] > 0.0
    assert first_zone["height"] > 0.0


def test_space_optimize_api_endpoint():
    """Integration test for POST /api/v1/space/optimize REST endpoint."""
    payload = {
        "site_area_sqm": 2000.0,
        "construction_stage": "STRUCTURE",
        "material_quantity_kg": 5000.0,
        "material_types_count": 8,
        "machinery_count": 8,
        "heavy_machinery_count": 3,
        "worker_count": 65,
        "daily_material_delivery_count": 5,
        "daily_truck_count": 8,
        "estimated_daily_material_usage_kg": 850.0,
        "waste_generation_kg_per_day": 250.0,
        "safety_requirement_level": "HIGH",
        "emergency_access_required": True,
        "existing_storage_area_sqm": 200.0,
        "existing_equipment_area_sqm": 120.0,
        "existing_worker_area_sqm": 100.0,
        "temperature": 30.0,
        "humidity": 60.0,
        "vibration_level": 25.0,
        "equipment_utilization_rate": 78.0,
        "task_progress": 0.45,
        "risk_score": 52.0,
        "material_shortage_alert": 0
    }

    response = client.post("/api/v1/space/optimize", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] in ["OPTIMAL", "FEASIBLE"]
    assert "allocation" in data
    assert "metrics" in data
    assert "gemini_report" in data
