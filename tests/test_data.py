"""
Data loading, validation, normalization, and splitting unit tests.
"""

import pytest
import pandas as pd
from conark.data.generator import generate_synthetic_dataset, generate_secondary_schema_sample
from conark.data.normalizer import DatasetNormalizer
from conark.data.validator import validate_construction_record, DataValidationError, validate_dataframe
from conark.data.splitter import time_series_split


def test_synthetic_data_generation():
    df = generate_synthetic_dataset(num_records=100)
    assert len(df) == 100
    assert "vibration_level" in df.columns
    assert "risk_score" in df.columns


def test_secondary_schema_normalization():
    df_sec = generate_secondary_schema_sample(num_records=50)
    normalizer = DatasetNormalizer()
    assert normalizer.is_secondary_schema(df_sec)
    
    df_norm = normalizer.normalize(df_sec)
    assert "vibration_level" in df_norm.columns
    assert "equipment_utilization_rate" in df_norm.columns
    assert "simulation_deviation" in df_norm.columns


def test_validator_valid_record():
    record = {
        "temperature": 25.0,
        "humidity": 50.0,
        "vibration_level": 15.0,
        "material_usage": 200.0,
        "machinery_status": 1,
        "worker_count": 20,
        "energy_consumption": 150.0,
        "task_progress": 0.5,
        "safety_incidents": 0,
        "equipment_utilization_rate": 80.0,
        "material_shortage_alert": 0
    }
    norm_rec, warnings = validate_construction_record(record)
    assert norm_rec["task_progress"] == 0.5


def test_validator_invalid_record():
    invalid_record = {
        "temperature": 150.0,  # Invalid temp
        "humidity": -10.0,    # Invalid humidity
        "vibration_level": -5.0, # Negative vibration
        "material_usage": 200.0,
        "machinery_status": 1,
        "worker_count": 20,
        "energy_consumption": 150.0,
        "task_progress": 0.5,
        "safety_incidents": 0,
        "equipment_utilization_rate": 80.0,
        "material_shortage_alert": 0
    }
    with pytest.raises(DataValidationError):
        validate_construction_record(invalid_record)


def test_time_series_split():
    df = generate_synthetic_dataset(num_records=100)
    train_df, val_df, test_df = time_series_split(df, train_ratio=0.7, val_ratio=0.15, test_ratio=0.15)
    assert len(train_df) == 70
    assert len(val_df) == 15
    assert len(test_df) == 15
    # Verify chronological sequence
    assert train_df["timestamp"].iloc[-1] < val_df["timestamp"].iloc[0]
    assert val_df["timestamp"].iloc[-1] < test_df["timestamp"].iloc[0]
