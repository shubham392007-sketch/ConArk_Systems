"""
Train Performance Prediction multiclass model.
Candidate algorithms: LogisticRegression, RandomForestClassifier, GradientBoostingClassifier, XGBClassifier.
Primary selection metric: Validation Macro F1.
"""

from typing import Tuple, Dict, Any
from datetime import datetime
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier, HistGradientBoostingClassifier
from xgboost import XGBClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

from conark.config.settings import settings
from conark.config.constants import PERFORMANCE_CLASSES
from conark.features.feature_schema import ENGINEERED_FEATURE_NAMES
from conark.utils.metrics import evaluate_classification
from conark.utils.model_registry import ModelRegistry
from conark.utils.logging import get_logger

logger = get_logger("train_performance")


class LabeledModelWrapper:
    def __init__(self, raw_model, label_encoder):
        self.raw_model = raw_model
        self.label_encoder = label_encoder
        self.feature_importances_ = getattr(raw_model, "feature_importances_", None)
        
    def predict(self, X):
        raw_preds = self.raw_model.predict(X)
        return self.label_encoder.inverse_transform(raw_preds)
        
    def predict_proba(self, X):
        return self.raw_model.predict_proba(X)


def train_performance_model(train_df: pd.DataFrame, val_df: pd.DataFrame) -> Tuple[Any, Dict[str, Any]]:
    """Trains and selects best Performance Prediction model."""
    feature_cols = [c for c in ENGINEERED_FEATURE_NAMES if c in train_df.columns]
    
    le = LabelEncoder()
    le.fit(PERFORMANCE_CLASSES)
    y_train = le.transform(train_df["performance_score"])
    y_val = le.transform(val_df["performance_score"])
    classes = list(le.classes_)
    
    # Save label encoder in preprocessors dir
    joblib.dump(le, settings.MODEL_DIR / "preprocessors" / "performance_label_encoder.joblib")
    
    X_train = train_df[feature_cols].fillna(0)
    X_val = val_df[feature_cols].fillna(0)
    
    candidates = {
        "RandomForest": RandomForestClassifier(n_estimators=50, max_depth=8, n_jobs=-1, random_state=42),
        "HistGradientBoosting": HistGradientBoostingClassifier(max_iter=50, max_depth=6, random_state=42),
        "XGBoost": XGBClassifier(n_estimators=50, max_depth=4, learning_rate=0.1, n_jobs=-1, random_state=42),
        "LogisticRegression": LogisticRegression(max_iter=300, random_state=42)
    }
    
    best_name = None
    best_model = None
    best_macro_f1 = -1.0
    best_metrics = {}
    
    for name, model in candidates.items():
        logger.info(f"Training Performance candidate: {name}")
        model.fit(X_train, y_train)
        preds = model.predict(X_val)
        pred_labels = le.inverse_transform(preds)
        val_labels = le.inverse_transform(y_val)
        
        metrics = evaluate_classification(val_labels, pred_labels, labels=classes)
        logger.info(f"{name} Validation Macro F1: {metrics['macro_f1']:.4f}")
        
        if metrics["macro_f1"] > best_macro_f1:
            best_macro_f1 = metrics["macro_f1"]
            best_name = name
            best_model = model
            best_metrics = metrics

    logger.info(f"Selected best Performance model: {best_name} with Macro F1 = {best_macro_f1:.4f}")
    
    wrapper = LabeledModelWrapper(best_model, le)

    metadata = {
        "model_name": "conark_performance_model",
        "version": "1.0.0",
        "algorithm": best_name,
        "trained_at": datetime.now().isoformat(),
        "features": feature_cols,
        "target": "performance_score",
        "classes": classes,
        "metrics": best_metrics
    }
    
    registry = ModelRegistry()
    registry.save_model("performance", wrapper, metadata)
    
    return wrapper, metadata


if __name__ == "__main__":
    from conark.data.loader import DataLoader
    from conark.features.engineering import create_feature_pipeline
    from conark.data.splitter import time_series_split
    
    loader = DataLoader()
    raw_df = loader.load_raw_dataset()
    df_feat = create_feature_pipeline(raw_df)
    train_df, val_df, test_df = time_series_split(df_feat)
    train_performance_model(train_df, val_df)
