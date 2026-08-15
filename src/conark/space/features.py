"""
Feature engineering module for Space Optimization Engine.
Calculates derived operational densities, ratios, and pressure metrics.
"""

from typing import Dict, Any
from conark.space.schemas import SpaceOptimizationInput


def compute_space_features(input_data: SpaceOptimizationInput) -> Dict[str, float]:
    """Computes space operational density and pressure features."""
    site_area = max(1.0, float(input_data.site_area_sqm))
    workers = max(0, int(input_data.worker_count))
    machinery = max(0, int(input_data.machinery_count))
    heavy_machinery = max(0, int(input_data.heavy_machinery_count))
    material_kg = max(0.0, float(input_data.material_quantity_kg))
    
    # 1. Densities
    material_density = material_kg / site_area
    worker_density = workers / site_area
    machinery_density = machinery / site_area
    
    # 2. Ratios
    heavy_machinery_ratio = heavy_machinery / max(1, machinery)
    delivery_intensity = float(input_data.daily_material_delivery_count) / site_area
    waste_intensity = float(input_data.waste_generation_kg_per_day) / max(1, workers)
    material_usage_rate = float(input_data.estimated_daily_material_usage_kg) / max(1.0, material_kg)
    
    # 3. Operational Pressures
    equipment_pressure = (float(input_data.equipment_utilization_rate) / 100.0) * machinery_density
    space_pressure = worker_density + machinery_density + (material_density / 100.0)
    risk_adjusted_space_pressure = space_pressure * (1.0 + float(input_data.risk_score) / 100.0)
    
    return {
        "material_density": round(material_density, 4),
        "worker_density": round(worker_density, 4),
        "machinery_density": round(machinery_density, 4),
        "heavy_machinery_ratio": round(heavy_machinery_ratio, 4),
        "delivery_intensity": round(delivery_intensity, 4),
        "waste_intensity": round(waste_intensity, 4),
        "material_usage_rate": round(material_usage_rate, 4),
        "equipment_pressure": round(equipment_pressure, 4),
        "space_pressure": round(space_pressure, 4),
        "risk_adjusted_space_pressure": round(risk_adjusted_space_pressure, 4),
    }
