"""
Deprecated: ml_pipeline.synthetic has been renamed to ml_pipeline.medicare_simulator.
This module is preserved for backward compatibility.
"""

from ml_pipeline.medicare_simulator import (
    generate_simulated_medicare_data,
    generate_synthetic_medicare_data,
    save_simulated_dataset_files,
    save_synthetic_dataset_files,
)

__all__ = [
    "generate_simulated_medicare_data",
    "generate_synthetic_medicare_data",
    "save_simulated_dataset_files",
    "save_synthetic_dataset_files",
]
