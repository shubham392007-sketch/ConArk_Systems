"""
Chronological time-aware dataset splitting utility.
Prevents data leakage across temporal boundaries.
"""

from typing import Tuple
import pandas as pd
from conark.utils.logging import get_logger

logger = get_logger("data_splitter")


def time_series_split(
    df: pd.DataFrame,
    train_ratio: float = 0.70,
    val_ratio: float = 0.15,
    test_ratio: float = 0.15,
    timestamp_col: str = "timestamp"
) -> Tuple[pd.DataFrame, pd.DataFrame, pd.DataFrame]:
    """
    Splits dataframe chronologically into train, validation, and test sets.
    Do NOT randomly shuffle.
    """
    assert abs((train_ratio + val_ratio + test_ratio) - 1.0) < 1e-5, "Split ratios must sum to 1.0"
    
    df_sorted = df.copy()
    if timestamp_col in df_sorted.columns:
        df_sorted[timestamp_col] = pd.to_datetime(df_sorted[timestamp_col])
        df_sorted.sort_values(timestamp_col, inplace=True)
        df_sorted.reset_index(drop=True, inplace=True)
        
    n = len(df_sorted)
    train_end = int(n * train_ratio)
    val_end = int(n * (train_ratio + val_ratio))
    
    train_df = df_sorted.iloc[:train_end].copy()
    val_df = df_sorted.iloc[train_end:val_end].copy()
    test_df = df_sorted.iloc[val_end:].copy()
    
    logger.info(f"Time-series split: Train={len(train_df)} ({train_ratio:.0%}), Val={len(val_df)} ({val_ratio:.0%}), Test={len(test_df)} ({test_ratio:.0%})")
    
    return train_df, val_df, test_df
