"""Cost model tests."""

import pandas as pd
from conark.data.generator import generate_synthetic_dataset
from conark.features.engineering import create_feature_pipeline
from conark.models.cost_model import CostModel


def test_cost_model_prediction():
    df_raw = generate_synthetic_dataset(num_records=10)
    df_feat = create_feature_pipeline(df_raw)
    
    model = CostModel()
    res = model.predict(df_feat.iloc[[0]])
    
    assert "predicted_cost_deviation" in res
    assert res["budget_status"] in ["Under Budget", "On Budget", "Over Budget"]
