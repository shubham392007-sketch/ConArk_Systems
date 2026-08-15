"""Safety and Machinery Risk alert rule checks."""

from typing import List, Dict, Any
from conark.config.constants import ALERT_THRESHOLDS


def check_safety_alerts(
    safety_incidents: int,
    vibration_level: float,
    risk_score: float
) -> List[Dict[str, Any]]:
    alerts = []
    
    # 1. Safety Incidents
    if safety_incidents > 0:
        alerts.append({
            "type": "SAFETY",
            "severity": "CRITICAL" if safety_incidents >= 2 else "HIGH",
            "title": "On-Site Safety Incident Detected",
            "message": f"{safety_incidents} safety incident(s) reported on-site.",
            "source": "rule_engine",
            "priority": 1 if safety_incidents >= 2 else 2
        })

    # 2. Machinery Vibration Warning
    if vibration_level >= ALERT_THRESHOLDS["vibration_critical"]:
        alerts.append({
            "type": "SAFETY",
            "severity": "CRITICAL",
            "title": "Critical Machinery Vibration",
            "message": f"Vibration level ({vibration_level:.1f} mm/s) exceeds critical safety threshold ({ALERT_THRESHOLDS['vibration_critical']} mm/s).",
            "source": "rule_engine",
            "priority": 1
        })
    elif vibration_level >= ALERT_THRESHOLDS["vibration_warning"]:
        alerts.append({
            "type": "SAFETY",
            "severity": "HIGH",
            "title": "High Machinery Vibration",
            "message": f"Vibration level ({vibration_level:.1f} mm/s) is significantly elevated.",
            "source": "rule_engine",
            "priority": 2
        })

    # 3. Overall Risk Alert
    if risk_score >= ALERT_THRESHOLDS["risk_critical"]:
        alerts.append({
            "type": "RISK",
            "severity": "CRITICAL",
            "title": "Critical Project Risk Score",
            "message": f"Project risk score ({risk_score:.1f}) is in the Critical range.",
            "source": "rule_engine",
            "priority": 1
        })
    elif risk_score >= ALERT_THRESHOLDS["risk_high"]:
        alerts.append({
            "type": "RISK",
            "severity": "HIGH",
            "title": "High Project Risk Score",
            "message": f"Project risk score ({risk_score:.1f}) is elevated.",
            "source": "rule_engine",
            "priority": 2
        })

    return alerts
