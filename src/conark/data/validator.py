"""
Strict data validation for input dataframes and API payloads.
Enforces physical and operational value constraints.
"""

from typing import Dict, Any, List, Tuple
import pandas as pd
from conark.utils.logging import get_logger

logger = get_logger("data_validator")


class DataValidationError(ValueError):
    """Raised when data fails physical or range validation rules."""
    def __init__(self, message: str, errors: List[Dict[str, Any]] = None):
        super().__init__(message)
        self.errors = errors or []


def validate_construction_record(record: Dict[str, Any]) -> Tuple[Dict[str, Any], List[str]]:
    """
    Validates a single construction record.
    Returns normalized record dict and list of validation warning messages.
    Raises DataValidationError on invalid values.
    """
    errors = []
    norm_record = record.copy()
    
    # 1. Temperature: -30 to +70 deg C
    temp = norm_record.get("temperature")
    if temp is not None and not (-30.0 <= float(temp) <= 70.0):
        errors.append({"field": "temperature", "value": temp, "reason": "Temperature must be between -30 and 70 °C"})
        
    # 2. Humidity: 0 to 100
    hum = norm_record.get("humidity")
    if hum is not None and not (0.0 <= float(hum) <= 100.0):
        errors.append({"field": "humidity", "value": hum, "reason": "Humidity must be between 0 and 100 %"})
        
    # 3. Vibration Level: >= 0
    vib = norm_record.get("vibration_level")
    if vib is not None and float(vib) < 0.0:
        errors.append({"field": "vibration_level", "value": vib, "reason": "Vibration level cannot be negative"})
        
    # 4. Material Usage: >= 0
    mat = norm_record.get("material_usage")
    if mat is not None and float(mat) < 0.0:
        errors.append({"field": "material_usage", "value": mat, "reason": "Material usage cannot be negative"})
        
    # 5. Machinery Status: 0 or 1
    mach = norm_record.get("machinery_status")
    if mach is not None and int(mach) not in (0, 1):
        errors.append({"field": "machinery_status", "value": mach, "reason": "Machinery status must be 0 (off/idle) or 1 (active)"})
        
    # 6. Worker Count: >= 0
    workers = norm_record.get("worker_count")
    if workers is not None and int(workers) < 0:
        errors.append({"field": "worker_count", "value": workers, "reason": "Worker count cannot be negative"})
        
    # 7. Energy Consumption: >= 0
    energy = norm_record.get("energy_consumption")
    if energy is not None and float(energy) < 0.0:
        errors.append({"field": "energy_consumption", "value": energy, "reason": "Energy consumption cannot be negative"})
        
    # 8. Task Progress: 0 to 1 (if > 1.0 up to 100.0, normalize internally to 0-1)
    prog = norm_record.get("task_progress")
    if prog is not None:
        prog_val = float(prog)
        if 1.0 < prog_val <= 100.0:
            norm_record["task_progress"] = round(prog_val / 100.0, 4)
        elif 0.0 <= prog_val <= 1.0:
            norm_record["task_progress"] = round(prog_val, 4)
        else:
            errors.append({"field": "task_progress", "value": prog, "reason": "Task progress must be between 0.0 and 1.0 (or 0 to 100%)"})
            
    # 9. Safety Incidents: >= 0
    safety = norm_record.get("safety_incidents")
    if safety is not None and int(safety) < 0:
        errors.append({"field": "safety_incidents", "value": safety, "reason": "Safety incidents cannot be negative"})
        
    # 10. Equipment Utilization Rate: 0 to 100
    util = norm_record.get("equipment_utilization_rate")
    if util is not None and not (0.0 <= float(util) <= 100.0):
        errors.append({"field": "equipment_utilization_rate", "value": util, "reason": "Equipment utilization rate must be between 0 and 100 %"})
        
    # 11. Material Shortage Alert: 0 or 1
    mat_alert = norm_record.get("material_shortage_alert")
    if mat_alert is not None and int(mat_alert) not in (0, 1):
        errors.append({"field": "material_shortage_alert", "value": mat_alert, "reason": "Material shortage alert must be 0 or 1"})

    if errors:
        raise DataValidationError(f"Validation failed with {len(errors)} error(s)", errors=errors)
        
    return norm_record, []


def validate_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Validate and clean an entire DataFrame."""
    df_clean = df.copy()
    
    # Task progress normalization
    if "task_progress" in df_clean.columns:
        if df_clean["task_progress"].max() > 1.0:
            df_clean["task_progress"] = df_clean["task_progress"] / 100.0
            
    # Value range masking / validation
    valid_mask = (
        (df_clean["humidity"].between(0, 100)) &
        (df_clean["vibration_level"] >= 0) &
        (df_clean["material_usage"] >= 0) &
        (df_clean["worker_count"] >= 0) &
        (df_clean["energy_consumption"] >= 0) &
        (df_clean["task_progress"].between(0, 1)) &
        (df_clean["safety_incidents"] >= 0) &
        (df_clean["equipment_utilization_rate"].between(0, 100))
    )
    invalid_count = len(df_clean) - valid_mask.sum()
    if invalid_count > 0:
        logger.warning(f"Dropping {invalid_count} records failing validation range checks.")
        df_clean = df_clean[valid_mask].reset_index(drop=True)
        
    return df_clean
