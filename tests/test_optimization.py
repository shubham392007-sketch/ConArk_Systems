"""Optimization model tests."""

import pandas as pd
from conark.data.generator import generate_synthetic_dataset
from conark.features.engineering import create_feature_pipeline
from conark.models.optimization_model import OptimizationModel
from conark.config.constants import OPTIMIZATION_CLASSES


def test_optimization_model_prediction():
    df_raw = generate_synthetic_dataset(num_records=10)
    df_feat = create_feature_pipeline(df_raw)
    
    model = OptimizationModel()
    res = model.predict(df_feat.iloc[[0]])
    
    assert "recommendation" in res
    assert res["recommendation"] in OPTIMIZATION_CLASSES
    assert isinstance(res["supporting_factors"], list)
    assert len(res["supporting_factors"]) > 0
