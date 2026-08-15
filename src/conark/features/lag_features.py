"""
Lag feature engineering for time-series operational variables.
"""

from typing import List
import pandas as pd


def add_lag_features(df: pd.DataFrame, lags: List[int] = [1, 5, 15]) -> pd.DataFrame:
    """
    Computes lag features for key operational metrics.
    For single record inference where historical data is unavailable, fills with current value.
    """
    df_out = df.copy()
    
    target_cols = [
        ("temperature", "temperature_lag"),
        ("humidity", "humidity_lag"),
        ("vibration_level", "vibration_lag"),
        ("energy_consumption", "energy_lag"),
        ("material_usage", "material_lag"),
        ("worker_count", "worker_lag"),
    ]
    
    is_single_record = len(df_out) == 1
    
    for src_col, target_prefix in target_cols:
        if src_col not in df_out.columns:
            continue
        for lag in lags:
            col_name = f"{target_prefix}_{lag}"
            if is_single_record:
                df_out[col_name] = df_out[src_col]
            else:
                df_out[col_name] = df_out[src_col].shift(lag).bfill()
                
    return df_out
