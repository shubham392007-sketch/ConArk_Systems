"""Gemini service unit and fallback tests."""

import asyncio
from conark.gemini.service import GeminiService


def test_gemini_fallback_service():
    service = GeminiService()
    
    mock_payload = {
        "ml_results": {
            "performance": {"prediction": "Good"},
            "risk": {"risk_score": 65.0, "risk_level": "High"},
            "cost_forecast": {"budget_status": "Over Budget", "predicted_cost_deviation": 2500.0},
            "time_forecast": {"schedule_status": "Delayed", "predicted_time_deviation_days": 4.2},
            "optimization": {"recommendation": "Increase Machinery Efficiency", "supporting_factors": ["High vibration"]}
        },
        "alerts": [
            {"type": "SAFETY", "severity": "HIGH", "title": "Elevated Vibration", "priority": 2}
        ]
    }

    # Execute service via asyncio event loop
    res = asyncio.run(service.generate_construction_report(mock_payload))
    
    assert res.report is not None
    assert isinstance(res.report.key_findings, list)
    assert len(res.report.recommended_actions) > 0
