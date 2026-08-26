"""
Train House Price Regression model (06 House Price Prediction Intelligence).
Candidate algorithms: XGBRegressor, RandomForestRegressor.
Evaluates MAE, RMSE, and R2.
Serializes model, neighborhood encoder, and metadata into models/house_price/.
"""

import os
import json
from datetime import datetime
from typing import Dict, Any, Tuple, Optional
import joblib
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestRegressor
from xgboost import XGBRegressor

from conark.config.settings import settings
from conark.utils.metrics import evaluate_regression
from conark.utils.logging import get_logger

logger = get_logger("train_house_price")


def generate_house_price_data(num_samples: int = 4000, random_seed: int = 42) -> pd.DataFrame:
    """
    Generates a realistic residential property dataset.
    Features: SquareFeet, Bedrooms, Bathrooms, Neighborhood, YearBuilt.
    Target: Price
    """
    np.random.seed(random_seed)

    # 1. Square Feet (700 to 5,500 sqft)
    square_feet = np.clip(np.random.normal(loc=2200, scale=850, size=num_samples), 650, 6000).round()

    # 2. Bedrooms (1 to 7) correlated with square feet
    bedrooms = np.clip(np.round(square_feet / 600 + np.random.normal(0, 0.5, num_samples)), 1, 7).astype(int)

    # 3. Bathrooms (1 to 5) correlated with bedrooms and sqft
    bathrooms = np.clip(np.round(bedrooms * 0.75 + np.random.uniform(-0.5, 0.5, num_samples) * 2) / 2, 1.0, 6.0)

    # 4. Neighborhoods: Urban (35%), Suburb (45%), Rural (20%)
    neighborhoods = np.random.choice(["Urban", "Suburb", "Rural"], size=num_samples, p=[0.35, 0.45, 0.20])

    # 5. Year Built (1960 to 2025)
    year_built = np.random.randint(1960, 2026, size=num_samples)

    # Calculate Realistic Price target
    # Base: $40,000
    # Sqft value: $110/sqft base
    # Neighborhood multiplier: Urban (+35%), Suburb (+15%), Rural (-10%)
    # Bedroom multiplier: $14,000/bed
    # Bathroom multiplier: $18,000/bath
    # Year Built: +$1,200 per year after 1980
    # Calibrate realistic residential valuation formula
    base_price = 30000.0
    sqft_contrib = square_feet * 95.0
    bed_contrib = bedrooms * 10000.0
    bath_contrib = bathrooms * 12000.0
    age_contrib = np.maximum(0, year_built - 1980) * 550.0

    neigh_factor = np.where(neighborhoods == "Urban", 1.05, np.where(neighborhoods == "Suburb", 0.90, 0.75))

    raw_price = (base_price + sqft_contrib + bed_contrib + bath_contrib + age_contrib) * neigh_factor
    noise = np.random.normal(0, 3500, size=num_samples)
    price = np.round(raw_price + noise, -1)
    price = np.maximum(45000.0, price)

    df = pd.DataFrame({
        "square_feet": square_feet,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "neighborhood": neighborhoods,
        "year_built": year_built,
        "price": price
    })

    # Encode neighborhood
    encoder = LabelEncoder()
    # Ensure consistent ordering: Rural=0, Suburb=1, Urban=2
    encoder.fit(["Rural", "Suburb", "Urban"])
    df["neighborhood_encoded"] = encoder.transform(df["neighborhood"])

    return df


def train_house_price_pipeline(
    df: Optional[pd.DataFrame] = None
) -> Tuple[Any, LabelEncoder, Dict[str, Any]]:
    """
    Trains XGBoost and Random Forest regressors, evaluates metrics, and selects best model.
    """
    if df is None:
        logger.info("Generating house price training data...")
        df = generate_house_price_data(num_samples=5000, random_seed=42)

    features = ["square_feet", "bedrooms", "bathrooms", "neighborhood_encoded", "year_built"]
    X = df[features]
    y = df["price"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    candidates = {
        "XGBRegressor": XGBRegressor(
            n_estimators=120,
            max_depth=5,
            learning_rate=0.08,
            subsample=0.85,
            colsample_bytree=0.85,
            n_jobs=-1,
            random_state=42
        ),
        "RandomForestRegressor": RandomForestRegressor(
            n_estimators=120,
            max_depth=12,
            min_samples_split=4,
            n_jobs=-1,
            random_state=42
        )
    }

    best_name = None
    best_model = None
    best_rmse = float("inf")
    best_metrics = {}

    for name, model in candidates.items():
        logger.info(f"Training House Price candidate: {name}...")
        model.fit(X_train, y_train)
        preds = model.predict(X_test)
        metrics = evaluate_regression(y_test.values, preds)
        logger.info(f"[{name}] Test RMSE: ${metrics['rmse']:.2f}, MAE: ${metrics['mae']:.2f}, R2: {metrics['r2']:.4f}")

        if metrics["rmse"] < best_rmse:
            best_rmse = metrics["rmse"]
            best_name = name
            best_model = model
            best_metrics = metrics

    logger.info(f"Selected best House Price model: {best_name} with RMSE=${best_rmse:.2f}, R2={best_metrics.get('r2', 0):.4f}")

    # Neighborhood encoder
    encoder = LabelEncoder()
    encoder.fit(["Rural", "Suburb", "Urban"])

    # Output directory
    output_dir = os.path.join(settings.BASE_DIR, "models", "house_price")
    os.makedirs(output_dir, exist_ok=True)

    # Save artifacts
    joblib.dump(best_model, os.path.join(output_dir, "model.joblib"))
    joblib.dump(best_model, os.path.join(output_dir, "house_price_model.pkl"))
    joblib.dump(encoder, os.path.join(output_dir, "encoder.joblib"))
    joblib.dump(encoder, os.path.join(output_dir, "neighborhood_encoder.pkl"))

    # Calculate feature importances
    importances = best_model.feature_importances_
    total = float(sum(importances))
    feature_importance_dict = {
        name: round(float(imp) / total, 4)
        for name, imp in zip(features, importances)
    }

    metadata = {
        "model_name": "house_price_prediction_model",
        "model_type": best_name,
        "version": "1.0.0",
        "training_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "features": features,
        "metrics": {
            "rmse": round(best_metrics.get("rmse", 0.0), 2),
            "mae": round(best_metrics.get("mae", 0.0), 2),
            "r2_score": round(best_metrics.get("r2", 0.0), 4)
        },
        "feature_importances": feature_importance_dict,
        "status": "PRODUCTION"
    }

    with open(os.path.join(output_dir, "metadata.json"), "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    logger.info(f"House Price model artifacts successfully saved to {output_dir}")
    return best_model, encoder, metadata


if __name__ == "__main__":
    train_house_price_pipeline()
