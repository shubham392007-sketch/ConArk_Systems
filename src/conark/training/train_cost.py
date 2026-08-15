"""
Train Cost Forecasting regression model.
Candidate algorithms: RandomForestRegressor, GradientBoostingRegressor, XGBRegressor.
Primary selection metric: Validation RMSE.
"""

from typing import Tuple, Dict, Any
from datetime import datetime
import pandas as pd
from sklearn.ensemble import RandomForestRegressor, HistGradientBoostingRegressor
from xgboost import XGBRegressor

from conark.features.feature_schema import ENGINEERED_FEATURE_NAMES
from conark.utils.metrics import evaluate_regression
from conark.utils.model_registry import ModelRegistry
from conark.utils.logging import get_logger

logger = get_logger("train_cost")


def train_cost_model(train_df: pd.DataFrame, val_df: pd.DataFrame) -> Tuple[Any, Dict[str, Any]]:
    """Trains and selects best Cost Forecasting model."""
    feature_cols = [c for c in ENGINEERED_FEATURE_NAMES if c in train_df.columns]
    
    y_train = train_df["cost_deviation"]
    y_val = val_df["cost_deviation"]
    
    X_train = train_df[feature_cols].fillna(0)
    X_val = val_df[feature_cols].fillna(0)
    
    candidates = {
        "RandomForestRegressor": RandomForestRegressor(n_estimators=50, max_depth=8, n_jobs=-1, random_state=42),
        "HistGradientBoostingRegressor": HistGradientBoostingRegressor(max_iter=50, max_depth=6, random_state=42),
        "XGBRegressor": XGBRegressor(n_estimators=50, max_depth=4, learning_rate=0.1, n_jobs=-1, random_state=42)
    }
    
    best_name = None
    best_model = None
    best_rmse = float("inf")
    best_metrics = {}
    
    for name, model in candidates.items():
        logger.info(f"Training Cost candidate: {name}")
        model.fit(X_train, y_train)
        preds = model.predict(X_val)
        
        metrics = evaluate_regression(y_val.values, preds)
        logger.info(f"{name} Validation RMSE: {metrics['rmse']:.4f}, R2: {metrics['r2']:.4f}")
        
        if metrics["rmse"] < best_rmse:
            best_rmse = metrics["rmse"]
            best_name = name
            best_model = model
            best_metrics = metrics

    logger.info(f"Selected best Cost model: {best_name} with RMSE = {best_rmse:.4f}")

    metadata = {
        "model_name": "conark_cost_model",
        "version": "1.0.0",
        "algorithm": best_name,
        "trained_at": datetime.now().isoformat(),
        "features": feature_cols,
        "target": "cost_deviation",
        "metrics": best_metrics
    }
    
    registry = ModelRegistry()
    registry.save_model("cost", best_model, metadata)
    
    return best_model, metadata


if __name__ == "__main__":
    from conark.data.loader import DataLoader
    from conark.features.engineering import create_feature_pipeline
    from conark.data.splitter import time_series_split
    
    loader = DataLoader()
    raw_df = loader.load_raw_dataset()
    df_feat = create_feature_pipeline(raw_df)
    train_df, val_df, test_df = time_series_split(df_feat)
    train_cost_model(train_df, val_df)
