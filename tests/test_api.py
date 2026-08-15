"""FastAPI REST API integration tests."""

import pytest
from fastapi.testclient import TestClient
from conark.api.main import app

client = TestClient(app)


def test_health_check_endpoint():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_master_intelligence_analyze_endpoint():
    payload = {
        "timestamp": "2023-01-01T00:08:00",
        "temperature": 30.03,
        "humidity": 42.41,
        "vibration_level": 17.03,
        "material_usage": 551.89,
        "machinery_status": 1,
        "worker_count": 48,
        "energy_consumption": 153.69,
        "task_progress": 0.3679,
        "safety_incidents": 0,
        "equipment_utilization_rate": 87.2,
        "material_shortage_alert": 0
    }
    
    response = client.post("/api/v1/intelligence/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert "request_id" in data
    assert "ml_results" in data
    assert "performance" in data["ml_results"]
    assert "risk" in data["ml_results"]
    assert "cost_forecast" in data["ml_results"]
    assert "time_forecast" in data["ml_results"]
    assert "optimization" in data["ml_results"]
    assert "alerts" in data
    assert "health" in data
    assert "gemini_report" in data
    assert data["system_status"] == "success"


def test_invalid_input_validation():
    invalid_payload = {
        "temperature": 200.0, # Invalid temperature range
        "humidity": -50.0    # Invalid humidity range
    }
    response = client.post("/api/v1/intelligence/analyze", json=invalid_payload)
    assert response.status_code == 422
