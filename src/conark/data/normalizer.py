"""
Dataset normalizer / adapter layer.
Maps alternative or legacy schemas to the canonical ConArk schema.
Does not silently fabricate missing columns.
"""

from typing import Tuple, List, Dict
import pandas as pd
from conark.config.constants import SECONDARY_SCHEMA_MAPPING
from conark.utils.logging import get_logger

logger = get_logger("dataset_normalizer")


class DatasetNormalizer:
    """Normalizes arbitrary input dataframes to the canonical ConArk schema."""

    def __init__(self, mapping: Dict[str, str] = None):
        self.mapping = mapping or SECONDARY_SCHEMA_MAPPING

    def is_secondary_schema(self, df: pd.DataFrame) -> bool:
        """Check if dataframe matches secondary schema."""
        has_secondary_keys = any(col in df.columns for col in ["Sensor_ID", "Resource_Utilization", "Simulation_Accuracy"])
        return has_secondary_keys

    def normalize(self, df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
        """
        Normalize dataframe into canonical column names.
        Returns:
            (normalized_dataframe, list_of_missing_canonical_columns)
        """
        df_norm = df.copy()
        
        # 1. Rename columns if secondary schema detected or matching mapping keys
        rename_dict = {}
        for col in df_norm.columns:
            if col in self.mapping:
                rename_dict[col] = self.mapping[col]
            elif col.lower() in [v.lower() for v in self.mapping.values()]:
                # Exact case alignment
                for canon_name in self.mapping.values():
                    if col.lower() == canon_name.lower():
                        rename_dict[col] = canon_name
                        break

        df_norm.rename(columns=rename_dict, inplace=True)
        
        # 2. Parse timestamp if present
        if "timestamp" in df_norm.columns:
            df_norm["timestamp"] = pd.to_datetime(df_norm["timestamp"])
            df_norm.sort_values("timestamp", inplace=True)
            df_norm.reset_index(drop=True, inplace=True)
            
        logger.info(f"Normalized dataframe with shape {df_norm.shape}. Columns: {list(df_norm.columns)}")
        return df_norm
