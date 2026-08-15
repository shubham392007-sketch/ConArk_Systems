"""
Master training orchestrator script.
Executes end-to-end dataset loading, validation, leakage checks, feature engineering,
chronological splitting, training all 5 models, generating data quality report, and saving metrics.
"""

import json
from datetime import datetime
from conark.config.settings import settings
from conark.data.loader import DataLoader
from conark.data.splitter import time_series_split
from conark.data.leakage_detector import generate_data_quality_report
from conark.features.engineering import create_feature_pipeline

from conark.training.train_performance import train_performance_model
from conark.training.train_risk import train_risk_model
from conark.training.train_cost import train_cost_model
from conark.training.train_time import train_time_model
from conark.training.train_optimization import train_optimization_model
from conark.utils.logging import get_logger

logger = get_logger("train_all")


def run_training_pipeline():
    """Runs full model training workflow for all 5 ConArk models."""
    logger.info("=== Starting ConArk Systems Master Training Pipeline ===")
    
    # 1. Load dataset
    loader = DataLoader()
    raw_df = loader.load_raw_dataset("construction_data.csv")
    
    # 2. Generate Data Quality Report & Target Leakage Audit
    report_path = str(settings.REPORTS_DIR / "data_quality_report.md")
    logger.info(f"Generating Data Quality & Leakage Report at {report_path}...")
    generate_data_quality_report(raw_df, report_path)
    
    # 3. Create Feature Engineering Pipeline
    logger.info("Performing time-series feature engineering...")
    df_feat = create_feature_pipeline(raw_df)
    
    # 4. Chronological Split (70% train, 15% val, 15% test)
    logger.info("Splitting dataset chronologically (70% Train, 15% Val, 15% Test)...")
    train_df, val_df, test_df = time_series_split(df_feat, train_ratio=0.70, val_ratio=0.15, test_ratio=0.15)
    
    all_metrics = {}
    
    # 5. Train Performance Model
    logger.info("--- Training Model 1: Performance Prediction ---")
    _, perf_meta = train_performance_model(train_df, val_df)
    all_metrics["performance"] = perf_meta
    
    # 6. Train Risk Model
    logger.info("--- Training Model 2: Risk Prediction ---")
    _, risk_meta = train_risk_model(train_df, val_df)
    all_metrics["risk"] = risk_meta
    
    # 7. Train Cost Model
    logger.info("--- Training Model 3: Cost Forecasting ---")
    _, cost_meta = train_cost_model(train_df, val_df)
    all_metrics["cost"] = cost_meta
    
    # 8. Train Time Model
    logger.info("--- Training Model 4: Time/Schedule Forecasting ---")
    _, time_meta = train_time_model(train_df, val_df)
    all_metrics["time"] = time_meta
    
    # 9. Train Optimization Model
    logger.info("--- Training Model 5: Optimization Recommendation ---")
    _, opt_meta = train_optimization_model(train_df, val_df)
    all_metrics["optimization"] = opt_meta
    
    # 10. Save Combined Metrics Summary
    metrics_path = settings.REPORTS_DIR / "metrics" / "training_metrics.json"
    with open(metrics_path, "w", encoding="utf-8") as f:
        json.dump({
            "pipeline_run_at": datetime.now().isoformat(),
            "records_processed": len(raw_df),
            "metrics": all_metrics
        }, f, indent=2)
        
    logger.info(f"Master training pipeline completed successfully! Metrics saved to {metrics_path}")
    return all_metrics


if __name__ == "__main__":
    run_training_pipeline()
