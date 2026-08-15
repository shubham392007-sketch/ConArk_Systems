"""Risk model tests."""

import pandas as pd
from conark.data.generator import generate_synthetic_dataset
from conark.features.engineering import create_feature_pipeline
from conark.models.risk_model import RiskModel


def test_risk_model_prediction():
    df_raw = generate_synthetic_dataset(num_records=10)
    df_feat = create_feature_pipeline(df_raw)
    
    model = RiskModel()
    res = model.predict(df_feat.iloc[[0]])
    
    assert "risk_score" in res
    assert 0.0 <= res["risk_score"] <= 100.0
    assert res["risk_level"] in ["Low", "Moderate", "High", "Critical"]
    assert "estimated_range" in res
