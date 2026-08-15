"""
Rolling window feature engineering for time-series operational variables.
"""

from typing import List
import pandas as pd


def add_rolling_features(df: pd.DataFrame, windows: List[int] = [5, 15]) -> pd.DataFrame:
    """
    Computes rolling mean, max, and sum features for key operational metrics.
    For single record inference, falls back to current value or scalar.
    """
    df_out = df.copy()
    is_single_record = len(df_out) == 1
    
    # 1. Vibration mean & max
    if "vibration_level" in df_out.columns:
        for w in windows:
            if is_single_record:
                df_out[f"vibration_mean_{w}"] = df_out["vibration_level"]
                df_out[f"vibration_max_{w}"] = df_out["vibration_level"]
            else:
                df_out[f"vibration_mean_{w}"] = df_out["vibration_level"].rolling(window=w, min_periods=1).mean()
                df_out[f"vibration_max_{w}"] = df_out["vibration_level"].rolling(window=w, min_periods=1).max()
                
    # 2. Energy mean
    if "energy_consumption" in df_out.columns:
        for w in windows:
            if is_single_record:
                df_out[f"energy_mean_{w}"] = df_out["energy_consumption"]
            else:
                df_out[f"energy_mean_{w}"] = df_out["energy_consumption"].rolling(window=w, min_periods=1).mean()
                
    # 3. Material mean
    if "material_usage" in df_out.columns:
        for w in windows:
            if is_single_record:
                df_out[f"material_mean_{w}"] = df_out["material_usage"]
            else:
                df_out[f"material_mean_{w}"] = df_out["material_usage"].rolling(window=w, min_periods=1).mean()
                
    # 4. Worker mean
    if "worker_count" in df_out.columns:
        for w in windows:
            if is_single_record:
                df_out[f"worker_mean_{w}"] = df_out["worker_count"]
            else:
                df_out[f"worker_mean_{w}"] = df_out["worker_count"].rolling(window=w, min_periods=1).mean()
                
    # 5. Safety incidents sum
    if "safety_incidents" in df_out.columns:
        for w in windows:
            if is_single_record:
                df_out[f"safety_incidents_sum_{w}"] = df_out["safety_incidents"]
            else:
                df_out[f"safety_incidents_sum_{w}"] = df_out["safety_incidents"].rolling(window=w, min_periods=1).sum()

    return df_out
