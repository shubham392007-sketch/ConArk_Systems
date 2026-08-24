"""
Pydantic schemas for Space Optimization Engine inputs, outputs, and constraints.
"""

from typing import Dict, List, Any, Optional
from enum import Enum
from pydantic import BaseModel, Field, field_validator


class ConstructionStageEnum(str, Enum):
    EXCAVATION = "EXCAVATION"
    FOUNDATION = "FOUNDATION"
    STRUCTURE = "STRUCTURE"
    MASONRY = "MASONRY"
    ELECTRICAL = "ELECTRICAL"
    PLUMBING = "PLUMBING"
    FINISHING = "FINISHING"
    MIXED = "MIXED"
    OTHER = "OTHER"


class SafetyLevelEnum(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class OptimizationStatusEnum(str, Enum):
    OPTIMAL = "OPTIMAL"
    FEASIBLE = "FEASIBLE"
    INFEASIBLE = "INFEASIBLE"
    WARNING = "WARNING"


class SpaceOptimizationInput(BaseModel):
    """Primary input payload for construction-site space allocation optimization."""
    # Required core inputs
    site_area_sqm: float = Field(..., description="Total available site area in square meters (> 0)")
    construction_stage: ConstructionStageEnum = Field(..., description="Active construction stage")
    material_quantity_kg: float = Field(..., description="Total raw material quantity on-site in kg (>= 0)")
    material_types_count: int = Field(default=1, description="Number of distinct material categories (>= 1)")
    machinery_count: int = Field(..., description="Total machinery count on-site (>= 0)")
    heavy_machinery_count: int = Field(..., description="Count of heavy machinery (cranes, excavators) (>= 0)")
    worker_count: int = Field(..., description="Active worker headcount on-site (>= 0)")
    daily_material_delivery_count: int = Field(default=1, description="Daily material deliveries (>= 0)")
    daily_truck_count: int = Field(default=1, description="Daily delivery truck trips (>= 0)")
    estimated_daily_material_usage_kg: float = Field(..., description="Estimated daily material usage in kg (>= 0)")
    waste_generation_kg_per_day: float = Field(..., description="Estimated daily waste generation in kg (>= 0)")
    safety_requirement_level: SafetyLevelEnum = Field(default=SafetyLevelEnum.HIGH, description="Site safety requirement level")
    emergency_access_required: bool = Field(default=True, description="Whether emergency corridor space is required")
    existing_storage_area_sqm: float = Field(default=0.0, description="Existing allocated storage area in sqm")
    existing_equipment_area_sqm: float = Field(default=0.0, description="Existing allocated equipment area in sqm")
    existing_worker_area_sqm: float = Field(default=0.0, description="Existing allocated worker area in sqm")

    # Environmental & operational signals
    temperature: float = Field(default=25.0, description="Site temperature in °C")
    humidity: float = Field(default=50.0, description="Site relative humidity in %")
    vibration_level: float = Field(default=15.0, description="Machinery vibration level in mm/s")
    equipment_utilization_rate: float = Field(default=75.0, description="Equipment utilization rate in % (0 to 100)")
    task_progress: float = Field(default=0.5, description="Project task progress (0.0 to 1.0 or 0 to 100%)")
    risk_score: float = Field(default=30.0, description="Project risk score (0 to 100)")
    material_shortage_alert: int = Field(default=0, description="Material shortage alert flag (0 or 1)")

    # Optional spatial / operational inputs
    site_length_m: Optional[float] = Field(default=None, description="Optional site boundary length in meters")
    site_width_m: Optional[float] = Field(default=None, description="Optional site boundary width in meters")
    number_of_floors: Optional[int] = Field(default=1, description="Number of building floors")
    working_hours_per_day: Optional[float] = Field(default=8.0, description="Daily working hours")
    loading_zone_available: Optional[bool] = Field(default=True, description="Dedicated loading zone availability")
    existing_layout_efficiency: Optional[float] = Field(default=75.0, description="Perceived existing layout efficiency score")
    project_id: Optional[str] = Field(default=None, description="Associated project workspace ID")

    @field_validator("construction_stage", mode="before")
    def validate_construction_stage(cls, v: Any) -> Any:
        if isinstance(v, str):
            v_upper = v.strip().upper()
            valid_names = [e.value for e in ConstructionStageEnum]
            if v_upper in valid_names:
                return v_upper
            if "EXCAV" in v_upper:
                return "EXCAVATION"
            if "FOUND" in v_upper:
                return "FOUNDATION"
            if "STRUCT" in v_upper:
                return "STRUCTURE"
            if "FINISH" in v_upper:
                return "FINISHING"
            return "OTHER"
        return v

    @field_validator("site_area_sqm")
    def validate_site_area(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("site_area_sqm must be greater than 0")
        return v

    @field_validator("material_quantity_kg", "machinery_count", "heavy_machinery_count", "worker_count")
    def validate_non_negative(cls, v: float, info) -> float:
        if v < 0:
            return 0.0
        return v

    @field_validator("site_length_m", "site_width_m")
    def validate_positive_dims(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v <= 0:
            return None
        return v


class SpaceAllocation(BaseModel):
    """Allocated areas for all 8 construction operational zones in sqm."""
    material_storage_area_sqm: float = Field(..., description="Allocated raw material storage area in sqm")
    equipment_area_sqm: float = Field(..., description="Allocated equipment/machinery parking area in sqm")
    worker_movement_area_sqm: float = Field(..., description="Allocated worker circulation and movement zone in sqm")
    safety_buffer_area_sqm: float = Field(..., description="Allocated safety buffer zone in sqm")
    loading_area_sqm: float = Field(..., description="Allocated loading/unloading area in sqm")
    waste_area_sqm: float = Field(..., description="Allocated waste & material disposal area in sqm")
    emergency_access_area_sqm: float = Field(..., description="Allocated emergency access corridor in sqm")
    staging_area_sqm: float = Field(..., description="Allocated construction staging area in sqm")


class SpaceMetrics(BaseModel):
    """Performance & utilization metrics for space allocation."""
    total_allocated_area_sqm: float = Field(..., description="Sum of all allocated zone areas")
    unused_area_sqm: float = Field(..., description="Unused/unallocated site space")
    space_utilization_percentage: float = Field(..., description="Percentage of site area allocated (0-100%)")
    space_efficiency_score: float = Field(..., description="Overall space efficiency score (0-100)")
    congestion_score: float = Field(..., description="Worker & machinery space congestion index (0-100)")
    safety_compliance_score: float = Field(..., description="Safety & emergency compliance score (0-100)")


class ConstraintItem(BaseModel):
    """Constraint evaluation item."""
    name: str = Field(..., description="Constraint category or requirement name")
    required_sqm: float = Field(..., description="Required minimum area in sqm")
    allocated_sqm: float = Field(..., description="Allocated area in sqm")
    status: str = Field(..., description="Constraint status: SATISFIED or VIOLATED")


class ZoneLayout(BaseModel):
    """Bounding box coordinates for 2D spatial positioning."""
    zone: str = Field(..., description="Zone identifier name")
    zone_name: Optional[str] = Field(default=None, description="Zone display name")
    x: float = Field(..., description="X coordinate origin in meters")
    y: float = Field(..., description="Y coordinate origin in meters")
    width: float = Field(..., description="Zone width dimension in meters")
    height: float = Field(..., description="Zone height dimension in meters")
    area_sqm: Optional[float] = Field(default=None, description="Exact allocated area in sqm")


class SpaceOptimizationResponse(BaseModel):
    """Master response for Space Optimization Engine API."""
    request_id: str = Field(..., description="Unique UUID request identifier")
    status: OptimizationStatusEnum = Field(..., description="Optimization status: OPTIMAL, FEASIBLE, INFEASIBLE, WARNING")
    reason: Optional[str] = Field(default=None, description="Explanation message if infeasible or warning")
    allocation: Optional[SpaceAllocation] = Field(default=None, description="Optimized zone area allocations")
    metrics: Optional[SpaceMetrics] = Field(default=None, description="Space utilization and compliance metrics")
    constraints: List[ConstraintItem] = Field(default=[], description="List of hard constraint evaluations")
    spatial_layout: List[ZoneLayout] = Field(default=[], description="2D rectangular bounding box layout (if site length/width provided)")
    coordinates: Optional[List[ZoneLayout]] = Field(default=None, description="Direct coordinates alias for frontend compatibility")
    reasoning: List[str] = Field(default=[], description="Deterministic reasoning for zone allocations")
    gemini_report: Optional[Dict[str, Any]] = Field(default=None, description="Gemini 2.5 Flash structured AI explanation report")
