"""Alert Engine unit tests."""

from conark.alerts.alert_engine import evaluate_alerts


def test_alert_engine_critical_safety():
    alerts = evaluate_alerts(
        safety_incidents=2,
        vibration_level=36.0,
        risk_score=80.0,
        material_shortage_alert=1,
        material_usage=500.0,
        equipment_utilization_rate=90.0,
        energy_consumption=400.0,
        predicted_time_deviation_days=6.0,
        predicted_cost_deviation=3000.0
    )
    
    assert len(alerts) > 0
    # First alert should be priority 1 (Critical)
    assert alerts[0]["priority"] == 1
    assert alerts[0]["severity"] == "CRITICAL"


def test_alert_engine_clean_operation():
    alerts = evaluate_alerts(
        safety_incidents=0,
        vibration_level=10.0,
        risk_score=20.0,
        material_shortage_alert=0,
        material_usage=100.0,
        equipment_utilization_rate=50.0,
        energy_consumption=100.0,
        predicted_time_deviation_days=0.0,
        predicted_cost_deviation=0.0
    )
    assert len(alerts) == 0
