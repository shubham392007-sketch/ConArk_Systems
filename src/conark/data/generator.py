"""
Synthetic dataset generator for ConArk Systems construction monitoring dataset.
Generates 50,000 time-series records at 1-minute intervals with controlled target relationships
and intentional formulaic leakage features for leakage evaluation.
"""

from pathlib import Path
import numpy as np
import pandas as pd
from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("data_generator")


def generate_synthetic_dataset(num_records: int = 50000, random_seed: int = 42) -> pd.DataFrame:
    """Generate canonical 50,000 construction site monitoring records."""
    np.random.seed(random_seed)
    
    start_time = pd.Timestamp("2023-01-01 00:00:00")
    timestamps = [start_time + pd.Timedelta(minutes=i) for i in range(num_records)]
    
    # Base operational time-series signals (smooth random walks + noise + daily cycles)
    time_index = np.arange(num_records)
    daily_cycle = np.sin(2 * np.pi * time_index / (24 * 60))
    
    temperature = np.round(25.0 + 8.0 * daily_cycle + np.random.normal(0, 1.5, num_records), 2)
    humidity = np.round(np.clip(60.0 - 15.0 * daily_cycle + np.random.normal(0, 3.0, num_records), 10, 95), 2)
    
    vibration_base = np.clip(np.random.gamma(shape=2.0, scale=8.0, size=num_records), 0.5, 48.0)
    vibration_level = np.round(vibration_base, 2)
    
    material_usage = np.round(np.cumsum(np.random.uniform(0.1, 1.5, num_records)) % 1000 + np.random.exponential(10, num_records), 2)
    machinery_status = np.random.choice([0, 1], size=num_records, p=[0.15, 0.85])
    worker_count = np.clip((30 + 15 * daily_cycle + np.random.randint(-5, 6, num_records)).astype(int), 0, 100)
    
    energy_consumption = np.round(np.clip(
        worker_count * 4.0 + machinery_status * 150.0 + vibration_level * 2.5 + np.random.normal(20, 10, num_records),
        10.0, 600.0
    ), 2)
    
    # Cyclic task progress across project work packages (e.g. 500-minute task cycles)
    task_progress = np.round(np.clip((np.arange(num_records) % 500) / 500.0 + np.random.normal(0, 0.02, num_records), 0.0, 1.0), 4)
    
    safety_incidents = np.random.choice([0, 1, 2, 3], size=num_records, p=[0.92, 0.06, 0.015, 0.005])
    equipment_utilization_rate = np.round(np.clip(
        machinery_status * (60 + 0.3 * worker_count + np.random.normal(0, 8, num_records)), 0.0, 100.0
    ), 2)
    
    material_shortage_alert = np.where((material_usage > 850) & (np.random.rand(num_records) > 0.4), 1, 0)
    simulation_deviation = np.round(np.clip(np.abs(np.random.normal(0.5, 0.3, num_records)), 0.0, 5.0), 2)
    update_frequency = np.full(num_records, 10)
    
    # Define Target Variables with controlled relationships (some formulaic to test leakage detection)
    
    # 1. Risk Score (0-100): Formulaically dependent on vibration, safety incidents, utilization
    risk_raw = (
        0.35 * vibration_level +
        12.0 * safety_incidents +
        0.25 * equipment_utilization_rate +
        0.15 * (100 - humidity) +
        np.random.normal(0, 3.0, num_records)
    )
    risk_score = np.round(np.clip(risk_raw, 0.0, 100.0), 2)
    
    # 2. Cost Deviation: Function of worker count, material usage, energy consumption
    cost_deviation = np.round(
        (worker_count * 40.0 + material_usage * 2.2 + energy_consumption * 1.5 - 2500.0) +
        np.random.normal(0, 250.0, num_records),
        2
    )
    
    # 3. Time Deviation (days): Function of task progress vs expected progress
    expected_progress = np.linspace(0.0, 1.0, num_records)
    time_deviation = np.round(
        (expected_progress - task_progress) * 20.0 + (safety_incidents * 1.5) +
        np.random.normal(0, 0.5, num_records),
        2
    )
    
    # 4. Performance Score (Multiclass: Poor, Average, Good, Excellent)
    # Composite score formula
    comp_score = (task_progress * 40.0) - (risk_score * 0.3) - (time_deviation * 2.0) + (equipment_utilization_rate * 0.2)
    perf_conditions = [
        comp_score < 15,
        (comp_score >= 15) & (comp_score < 30),
        (comp_score >= 30) & (comp_score < 45),
        comp_score >= 45
    ]
    perf_choices = ["Poor", "Average", "Good", "Excellent"]
    performance_score = np.select(perf_conditions, perf_choices, default="Good")
    
    # 5. Optimization Suggestion (Multiclass)
    opt_conditions = [
        material_shortage_alert == 1,
        (vibration_level > 28.0) | (equipment_utilization_rate > 85.0),
        worker_count < 15,
        time_deviation > 3.0,
        safety_incidents > 0
    ]
    opt_choices = [
        "Optimize Material Usage",
        "Increase Machinery Efficiency",
        "Reallocate Workers",
        "Adjust Schedule",
        "Enhance Safety Measures"
    ]
    optimization_suggestion = np.select(opt_conditions, opt_choices, default="Increase Machinery Efficiency")
    
    df = pd.DataFrame({
        "timestamp": timestamps,
        "temperature": temperature,
        "humidity": humidity,
        "vibration_level": vibration_level,
        "material_usage": material_usage,
        "machinery_status": machinery_status,
        "worker_count": worker_count,
        "energy_consumption": energy_consumption,
        "task_progress": task_progress,
        "cost_deviation": cost_deviation,
        "time_deviation": time_deviation,
        "safety_incidents": safety_incidents,
        "equipment_utilization_rate": equipment_utilization_rate,
        "material_shortage_alert": material_shortage_alert,
        "risk_score": risk_score,
        "simulation_deviation": simulation_deviation,
        "update_frequency": update_frequency,
        "optimization_suggestion": optimization_suggestion,
        "performance_score": performance_score
    })
    
    return df


def generate_secondary_schema_sample(num_records: int = 100, random_seed: int = 99) -> pd.DataFrame:
    """Generate sample dataset using secondary schema format."""
    np.random.seed(random_seed)
    df_primary = generate_synthetic_dataset(num_records=num_records, random_seed=random_seed)
    
    df_secondary = pd.DataFrame({
        "Timestamp": df_primary["timestamp"],
        "Sensor_ID": [f"SN-SITE-{i%5+1:03d}" for i in range(num_records)],
        "Temperature": df_primary["temperature"],
        "Humidity": df_primary["humidity"],
        "Vibration_Level": df_primary["vibration_level"],
        "Material_Usage": df_primary["material_usage"],
        "Energy_Consumption": df_primary["energy_consumption"],
        "Worker_Count": df_primary["worker_count"],
        "Task_Progress": df_primary["task_progress"],
        "Safety_Incidents": df_primary["safety_incidents"],
        "Resource_Utilization": df_primary["equipment_utilization_rate"],
        "Risk_Score": df_primary["risk_score"],
        "Simulation_Accuracy": df_primary["simulation_deviation"],
        "Optimization_Suggestion": df_primary["optimization_suggestion"],
        "Performance_Score": df_primary["performance_score"]
    })
    return df_secondary


def save_default_datasets(data_dir: Path = None) -> None:
    """Generate and save standard datasets to data directory."""
    d_dir = data_dir or settings.DATA_DIR
    raw_dir = d_dir / "raw"
    raw_dir.mkdir(parents=True, exist_ok=True)
    
    primary_path = raw_dir / "construction_data.csv"
    secondary_path = raw_dir / "secondary_schema_sample.csv"
    
    logger.info("Generating 50,000 synthetic primary monitoring records...")
    df_primary = generate_synthetic_dataset(num_records=50000)
    df_primary.to_csv(primary_path, index=False)
    logger.info(f"Saved primary dataset to {primary_path}")
    
    df_secondary = generate_secondary_schema_sample(num_records=500)
    df_secondary.to_csv(secondary_path, index=False)
    logger.info(f"Saved secondary schema sample dataset to {secondary_path}")


if __name__ == "__main__":
    save_default_datasets()
