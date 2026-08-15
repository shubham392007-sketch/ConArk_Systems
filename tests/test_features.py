"""
Feature engineering unit tests.
"""

import pandas as pd
from conark.data.generator import generate_synthetic_dataset
from conark.features.engineering import create_feature_pipeline
from conark.features.feature_schema import ENGINEERED_FEATURE_NAMES


def test_feature_pipeline_batch():
    df_raw = generate_synthetic_dataset(num_records=50)
    df_feat = create_feature_pipeline(df_raw)
    
    for col in ENGINEERED_FEATURE_NAMES:
        assert col in df_feat.columns, f"Engineered column {col} missing from output matrix"
        
    assert not df_feat[ENGINEERED_FEATURE_NAMES].isnull().any().any()


def test_feature_pipeline_single_record():
    single_record = {
        "timestamp": "2023-01-01T00:08:00",
        "temperature": 30.0,
        "humidity": 45.0,
        "vibration_level": 18.0,
        "material_usage": 500.0,
        "machinery_status": 1,
        "worker_count": 40,
        "energy_consumption": 250.0,
        "task_progress": 0.4,
        "safety_incidents": 0,
        "equipment_utilization_rate": 85.0,
        "material_shortage_alert": 0,
        "simulation_deviation": 0.5
    }
    df_single = pd.DataFrame([single_record])
    df_feat = create_feature_pipeline(df_single)
    
    assert len(df_feat) == 1
    assert df_feat["material_efficiency"].iloc[0] > 0
    assert df_feat["hour"].iloc[0] == 0
