"""
Construction Intelligence Engine.
Aggregates predictions from all 5 ML models, runs the deterministic Alert Engine,
calculates the health score, and prepares the unified ML result.
"""

from typing import Dict, Any
import pandas as pd
from conark.data.validator import validate_construction_record
from conark.features.engineering import create_feature_pipeline
from conark.models.performance_model import PerformanceModel
from conark.models.risk_model import RiskModel
from conark.models.cost_model import CostModel
from conark.models.time_model import TimeModel
from conark.models.optimization_model import OptimizationModel
from conark.alerts.alert_engine import evaluate_alerts
from conark.utils.health_score import calculate_health_score
from conark.utils.logging import get_logger

logger = get_logger("intelligence_engine")


class ConstructionIntelligenceEngine:
    """Master ML prediction & decision aggregator."""

    def __init__(self):
        self.performance_model = PerformanceModel()
        self.risk_model = RiskModel()
        self.cost_model = CostModel()
        self.time_model = TimeModel()
        self.optimization_model = OptimizationModel()

    def preload_models(self) -> None:
        """Preloads all 5 model artifacts at application startup."""
        logger.info("Preloading all 5 ConArk ML models...")
        self.performance_model.load()
        self.risk_model.load()
        self.cost_model.load()
        self.time_model.load()
        self.optimization_model.load()
        logger.info("All 5 ConArk ML models preloaded successfully.")

    def run_intelligence(self, input_dict: Dict[str, Any]) -> Dict[str, Any]:
        """
        Executes end-to-end ML prediction pipeline for a single construction record.
        Returns unified ML results, alerts, health score, and factors.
        """
        # 1. Validation & normalization
        norm_record, warnings = validate_construction_record(input_dict)
        
        # 2. DataFrame conversion & feature engineering
        df_input = pd.DataFrame([norm_record])
        df_feat = create_feature_pipeline(df_input)
        
        # 3. Model Predictions
        perf_res = self.performance_model.predict(df_feat)
        risk_res = self.risk_model.predict(df_feat)
        cost_res = self.cost_model.predict(df_feat)
        time_res = self.time_model.predict(df_feat)
        opt_res = self.optimization_model.predict(df_feat)
        
        # 4. Alert Engine
        alerts = evaluate_alerts(
            safety_incidents=int(norm_record.get("safety_incidents", 0)),
            vibration_level=float(norm_record.get("vibration_level", 0.0)),
            risk_score=risk_res["risk_score"],
            material_shortage_alert=int(norm_record.get("material_shortage_alert", 0)),
            material_usage=float(norm_record.get("material_usage", 0.0)),
            equipment_utilization_rate=float(norm_record.get("equipment_utilization_rate", 0.0)),
            energy_consumption=float(norm_record.get("energy_consumption", 0.0)),
            predicted_time_deviation_days=time_res["predicted_time_deviation_days"],
            predicted_cost_deviation=cost_res["predicted_cost_deviation"],
            material_consumption_velocity=float(df_feat["material_consumption_velocity"].iloc[0]),
            temperature=float(norm_record.get("temperature", 25.0)),
            humidity=float(norm_record.get("humidity", 50.0)),
            worker_count=int(norm_record.get("worker_count", 40)),
            machinery_status=int(norm_record.get("machinery_status", 1)),
            task_progress=float(norm_record.get("task_progress", 0.45))
        )
        
        critical_alerts_count = sum(1 for a in alerts if a.get("priority") == 1)
        
        # 5. ConArk Health Score
        health = calculate_health_score(
            performance_pred=perf_res["prediction"],
            risk_score=risk_res["risk_score"],
            cost_deviation=cost_res["predicted_cost_deviation"],
            time_deviation_days=time_res["predicted_time_deviation_days"],
            safety_incidents=int(norm_record.get("safety_incidents", 0)),
            critical_alerts_count=critical_alerts_count
        )

        ml_results = {
            "performance": perf_res,
            "risk": risk_res,
            "cost_forecast": cost_res,
            "time_forecast": time_res,
            "optimization": opt_res
        }

        return {
            "ml_results": ml_results,
            "alerts": alerts,
            "health": health,
            "validation_warnings": warnings,
            "raw_input_summary": norm_record
        }
