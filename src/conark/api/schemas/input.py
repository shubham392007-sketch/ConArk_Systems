"""
Pydantic API input schemas following ConArk Systems Master Input Architecture.
Target fields (performance_score, risk_score, cost_deviation, time_deviation, optimization_suggestion)
are strictly excluded from feature sets to prevent target leakage.
"""

from typing import Optional
from pydantic import BaseModel, Field, field_validator


class InferenceInput(BaseModel):
    """Canonical operational telemetry input payload for all 5 ConArk models."""
    timestamp: Optional[str] = Field(default=None, description="ISO timestamp string (e.g. 2023-01-01T00:08:00)")
    temperature: float = Field(..., description="Site temperature in °C (-30 to 70)")
    humidity: float = Field(..., description="Site relative humidity in % (0 to 100)")
    vibration_level: float = Field(..., description="Machinery vibration level in Hz / mm/s (>= 0)")
    material_usage: float = Field(..., description="Material usage in kg (>= 0)")
    machinery_status: int = Field(..., description="Machinery active status: 0 (idle/off) or 1 (active)")
    worker_count: int = Field(..., description="Active worker count on-site (>= 0)")
    energy_consumption: float = Field(..., description="Energy consumption rate in kWh (>= 0)")
    task_progress: float = Field(..., description="Task progress (0.0 to 1.0 or 0 to 100%)")
    safety_incidents: int = Field(default=0, description="Count of safety incidents recorded (>= 0)")
    equipment_utilization_rate: float = Field(..., description="Equipment utilization rate in % (0 to 100)")
    material_shortage_alert: int = Field(default=0, description="Material shortage alert indicator: 0 or 1")
    cost_deviation: Optional[float] = Field(default=0.0, description="Cost deviation in USD")
    time_deviation: Optional[float] = Field(default=0.0, description="Schedule time deviation in days")
    simulation_deviation: Optional[float] = Field(default=0.0, description="Simulation accuracy deviation in %")
    target_model: Optional[str] = Field(default="all_models", description="Specific target model name or all_models")
    project_id: Optional[str] = Field(default=None, description="Associated project workspace ID")

    @field_validator("humidity", "equipment_utilization_rate")
    def validate_percent_range(cls, v: float, info) -> float:
        if not (0.0 <= v <= 100.0):
            raise ValueError(f"{info.field_name} must be between 0 and 100")
        return v

    @field_validator("vibration_level", "material_usage", "energy_consumption", "worker_count", "safety_incidents")
    def validate_non_negative(cls, v: float, info) -> float:
        if v < 0:
            raise ValueError(f"{info.field_name} cannot be negative")
        return v

    @field_validator("machinery_status", "material_shortage_alert")
    def validate_binary_flag(cls, v: int, info) -> int:
        if v not in (0, 1):
            raise ValueError(f"{info.field_name} must be 0 or 1")
        return v


class ConstructionInput(InferenceInput):
    """Ground-truth model targets container (strictly excluded from prediction feature engineering)."""
    performance_score: Optional[str] = Field(default=None, description="Ground truth performance target: Poor, Average, Good, Excellent")
    risk_score: Optional[float] = Field(default=None, description="Ground truth risk score target (0 to 100)")
    optimization_suggestion: Optional[str] = Field(default=None, description="Ground truth optimization suggestion target")
