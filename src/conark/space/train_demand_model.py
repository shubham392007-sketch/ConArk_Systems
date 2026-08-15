"""
Training script for the optional ML Space Demand Predictor.
Trains RandomForestRegressor / HistGradientBoostingRegressor to predict total site space demand.
"""

import json
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from xgboost import XGBRegressor
import joblib

from conark.config.settings import settings
from conark.utils.metrics import evaluate_regression
from conark.utils.logging import get_logger

logger = get_logger("train_space_demand")


def train_space_demand_model(num_samples: int = 2000) -> None:
    """Trains and serializes optional ML space demand prediction model."""
    logger.info(f"Generating synthetic space demand training data ({num_samples} samples)...")
    np.random.seed(42)

    # Synthesize dataset
    mat_qty = np.random.uniform(500, 20000, num_samples)
    workers = np.random.randint(5, 120, num_samples)
    machines = np.random.randint(1, 20, num_samples)
    heavy_machines = np.random.binomial(machines, 0.4)
    trucks = np.random.randint(1, 15, num_samples)
    waste = np.random.uniform(50, 1000, num_samples)
    util = np.random.uniform(30, 95, num_samples)
    progress = np.random.uniform(0.0, 1.0, num_samples)
    risk = np.random.uniform(10, 90, num_samples)

    # Formulaic required space target
    target_space = (
        (mat_qty / 1000.0) * 15.0 +
        (machines - heavy_machines) * 20.0 +
        heavy_machines * 45.0 +
        workers * 3.5 +
        trucks * 35.0 +
        (waste / 100.0) * 5.0 +
        100.0 +
        np.random.normal(0, 15.0, num_samples)
    )
    target_space = np.clip(target_space, 100.0, 5000.0)

    df = pd.DataFrame({
        "material_quantity_kg": mat_qty,
        "worker_count": workers,
        "machinery_count": machines,
        "heavy_machinery_count": heavy_machines,
        "daily_truck_count": trucks,
        "waste_generation_kg_per_day": waste,
        "equipment_utilization_rate": util,
        "task_progress": progress,
        "risk_score": risk,
        "required_space_sqm": target_space
    })

    X = df.drop(columns=["required_space_sqm"])
    y = df["required_space_sqm"]

    # 70/15/15 split
    n = len(df)
    n_train = int(n * 0.7)
    n_val = int(n * 0.85)

    X_train, y_train = X.iloc[:n_train], y.iloc[:n_train]
    X_val, y_val = X.iloc[n_train:n_val], y.iloc[n_train:n_val]

    candidates = {
        "HistGradientBoostingRegressor": HistGradientBoostingRegressor(max_iter=50, random_state=42),
        "RandomForestRegressor": RandomForestRegressor(n_estimators=50, max_depth=8, n_jobs=-1, random_state=42),
        "XGBRegressor": XGBRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, n_jobs=-1, random_state=42)
    }

    best_name = None
    best_model = None
    best_rmse = float("inf")
    best_metrics = {}

    for name, model in candidates.items():
        model.fit(X_train, y_train)
        preds = model.predict(X_val)
        metrics = evaluate_regression(y_val.values, preds)
        logger.info(f"Space Demand Candidate {name}: RMSE={metrics['rmse']:.4f}, R2={metrics['r2']:.4f}")

        if metrics["rmse"] < best_rmse:
            best_rmse = metrics["rmse"]
            best_name = name
            best_model = model
            best_metrics = metrics

    logger.info(f"Selected best Space Demand Model: {best_name} with RMSE = {best_rmse:.4f}")

    target_dir = settings.MODEL_DIR / "space_demand"
    target_dir.mkdir(parents=True, exist_ok=True)

    joblib.dump(best_model, target_dir / "model.joblib")
    with open(target_dir / "metadata.json", "w", encoding="utf-8") as f:
        json.dump({
            "model_name": "conark_space_demand_model",
            "version": "1.0.0",
            "algorithm": best_name,
            "trained_at": datetime.now().isoformat(),
            "features": list(X.columns),
            "target": "required_space_sqm",
            "metrics": best_metrics
        }, f, indent=2)

    logger.info(f"Saved Space Demand Model to {target_dir / 'model.joblib'}")


if __name__ == "__main__":
    train_space_demand_model()
