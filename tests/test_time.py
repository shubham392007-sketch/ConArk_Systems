"""Time model tests."""

import pandas as pd
from conark.data.generator import generate_synthetic_dataset
from conark.features.engineering import create_feature_pipeline
from conark.models.time_model import TimeModel


def test_time_model_prediction():
    df_raw = generate_synthetic_dataset(num_records=10)
    df_feat = create_feature_pipeline(df_raw)
    
    model = TimeModel()
    res = model.predict(df_feat.iloc[[0]])
    
    assert "predicted_time_deviation_days" in res
    assert res["schedule_status"] in ["Ahead", "On Schedule", "Delayed"]
