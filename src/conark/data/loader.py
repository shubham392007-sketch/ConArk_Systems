"""
Data loader module for ConArk Systems.
Handles dataset ingestion, normalization, validation, and sample loading.
"""

from pathlib import Path
from typing import Optional, Tuple
import pandas as pd
from conark.config.settings import settings
from conark.data.generator import save_default_datasets
from conark.data.normalizer import DatasetNormalizer
from conark.data.validator import validate_dataframe
from conark.utils.logging import get_logger

logger = get_logger("data_loader")


class DataLoader:
    """Loads construction datasets from file or generates defaults if missing."""

    def __init__(self, data_dir: Optional[Path] = None):
        self.data_dir = data_dir or settings.DATA_DIR
        self.normalizer = DatasetNormalizer()

    def load_raw_dataset(self, filename: str = "construction_data.csv") -> pd.DataFrame:
        """Load raw dataset file, generating default synthetic data if missing."""
        file_path = self.data_dir / "raw" / filename
        if not file_path.exists():
            logger.warning(f"Raw dataset file not found at {file_path}. Generating default synthetic datasets...")
            save_default_datasets(self.data_dir)
            
        logger.info(f"Loading raw dataset from {file_path}")
        df = pd.read_csv(file_path)
        
        # Normalize schema if secondary or alternative column naming
        df_norm = self.normalizer.normalize(df)
        
        # Validate values
        df_valid = validate_dataframe(df_norm)
        
        return df_valid
