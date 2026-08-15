"""
Main feature engineering pipeline orchestrator.
Applies lag features, rolling windows, rate of change, velocity, efficiency, and timestamp extractions.
"""

from typing import List
import numpy as np
import pandas as pd
from conark.features.lag_features import add_lag_features
from conark.features.rolling import add_rolling_features
from conark.features.feature_schema import ENGINEERED_FEATURE_NAMES
from conark.utils.logging import get_logger

logger = get_logger("feature_engineering")


def create_feature_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """
    Transforms raw dataframe into rich engineered feature matrix.
    Safe against division by zero and works on batch or single-record DataFrames.
    """
    df_feat = df.copy()
    is_single_record = len(df_feat) == 1
    
    # 1. Timestamp extractions
    if "timestamp" in df_feat.columns:
        ts = pd.to_datetime(df_feat["timestamp"])
        df_feat["hour"] = ts.dt.hour
        df_feat["day"] = ts.dt.day
        df_feat["day_of_week"] = ts.dt.dayofweek
        df_feat["day_of_month"] = ts.dt.day
        df_feat["week_of_year"] = ts.dt.isocalendar().week.astype(int)
        df_feat["is_weekend"] = ts.dt.dayofweek.isin([5, 6]).astype(int)
    else:
        # Default temporal values if timestamp string omitted
        df_feat["hour"] = 12
        df_feat["day"] = 1
        df_feat["day_of_week"] = 2
        df_feat["day_of_month"] = 1
        df_feat["week_of_year"] = 1
        df_feat["is_weekend"] = 0

    # 2. Add Lag features
    df_feat = add_lag_features(df_feat, lags=[1, 5, 15])
    
    # 3. Add Rolling features
    df_feat = add_rolling_features(df_feat, windows=[5, 15])
    
    # 4. Change features (delta vs 1 step prior)
    change_cols = [
        ("vibration_level", "vibration_lag_1", "vibration_change"),
        ("energy_consumption", "energy_lag_1", "energy_change"),
        ("material_usage", "material_lag_1", "material_change"),
        ("worker_count", "worker_lag_1", "worker_change"),
        ("task_progress", "task_progress", "task_progress_change"),
    ]
    for curr_col, lag_col, out_col in change_cols:
        if curr_col in df_feat.columns and lag_col in df_feat.columns:
            if is_single_record:
                df_feat[out_col] = 0.0
            else:
                df_feat[out_col] = df_feat[curr_col] - df_feat[lag_col]
        else:
            df_feat[out_col] = 0.0

    # 5. Velocity metrics
    df_feat["task_progress_velocity"] = df_feat["task_progress_change"].clip(lower=0.0)
    df_feat["material_consumption_velocity"] = df_feat["material_change"].clip(lower=0.0)
    df_feat["energy_consumption_velocity"] = df_feat["energy_change"].clip(lower=0.0)
    df_feat["worker_change_rate"] = df_feat["worker_change"]

    # 6. Efficiency Ratios (avoid zero division)
    eps = 1e-5
    df_feat["material_efficiency"] = np.where(
        df_feat["material_usage"] > 0,
        df_feat["task_progress"] / (df_feat["material_usage"] + eps),
        0.0
    )
    df_feat["energy_efficiency"] = np.where(
        df_feat["energy_consumption"] > 0,
        df_feat["task_progress"] / (df_feat["energy_consumption"] + eps),
        0.0
    )
    df_feat["equipment_efficiency"] = np.where(
        df_feat["equipment_utilization_rate"] > 0,
        df_feat["task_progress"] / (df_feat["equipment_utilization_rate"] + eps),
        0.0
    )
    df_feat["worker_productivity"] = np.where(
        df_feat["worker_count"] > 0,
        df_feat["task_progress"] / (df_feat["worker_count"] + eps),
        0.0
    )

    # 7. Fill missing engineered features and return matching schema
    for col in ENGINEERED_FEATURE_NAMES:
        if col not in df_feat.columns:
            df_feat[col] = 0.0

    return df_feat
