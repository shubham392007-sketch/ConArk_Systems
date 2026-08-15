"""Performance model tests."""

import pandas as pd
from conark.data.generator import generate_synthetic_dataset
from conark.features.engineering import create_feature_pipeline
from conark.models.performance_model import PerformanceModel


def test_performance_model_prediction():
    df_raw = generate_synthetic_dataset(num_records=10)
    df_feat = create_feature_pipeline(df_raw)
    
    model = PerformanceModel()
    res = model.predict(df_feat.iloc[[0]])
    
    assert "prediction" in res
    assert res["prediction"] in ["Poor", "Average", "Good", "Excellent"]
    assert 0.0 <= res["confidence"] <= 1.0
    assert "probabilities" in res
