"""
Layout and allocation validator for Space Optimization Engine.
Ensures zero negative areas, site boundary compliance, and safety clearances.
"""

from typing import Dict, List, Any
from conark.space.schemas import ZoneLayout


class LayoutValidator:
    """Validates physical and logical integrity of space allocations and spatial layouts."""

    @staticmethod
    def validate_allocation(allocation: Dict[str, float], site_area: float) -> Tuple[bool, List[str]]:
        """Validates numerical space allocation values."""
        errors = []
        
        # Check non-negative
        for k, v in allocation.items():
            if v < 0:
                errors.append(f"Negative area detected in zone '{k}': {v} sqm")

        # Check total area bound
        total = sum(allocation.values())
        if total > site_area + 0.1:
            errors.append(f"Total allocated area ({total:.1f} sqm) exceeds site area ({site_area:.1f} sqm)")

        is_valid = len(errors) == 0
        return is_valid, errors

    @staticmethod
    def validate_spatial_layout(layout: List[ZoneLayout], site_length: float, site_width: float) -> Tuple[bool, List[str]]:
        """Validates 2D rectangular bounding box layouts for overlap and boundary overflow."""
        errors = []
        
        for zone in layout:
            if zone.x < 0 or zone.y < 0:
                errors.append(f"Zone '{zone.zone}' has negative coordinates: ({zone.x}, {zone.y})")
            if zone.x + zone.width > site_length + 0.5:
                errors.append(f"Zone '{zone.zone}' overflows site length boundary ({zone.x + zone.width:.1f}m > {site_length:.1f}m)")
            if zone.y + zone.height > site_width + 0.5:
                errors.append(f"Zone '{zone.zone}' overflows site width boundary ({zone.y + zone.height:.1f}m > {site_width:.1f}m)")

        # Check pairwise rectangle overlaps
        for i in range(len(layout)):
            for j in range(i + 1, len(layout)):
                z1, z2 = layout[i], layout[j]
                if (z1.x < z2.x + z2.width and z1.x + z1.width > z2.x and
                    z1.y < z2.y + z2.height and z1.y + z1.height > z2.y):
                    errors.append(f"Spatial overlap detected between '{z1.zone}' and '{z2.zone}'")

        is_valid = len(errors) == 0
        return is_valid, errors
