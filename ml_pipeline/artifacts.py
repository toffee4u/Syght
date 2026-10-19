"""
Artifacts Module: Secure model serialization, metadata bundling, and deployment packaging.
"""

from __future__ import annotations

import json
import logging
import platform
import shutil
import zipfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Dict, List, Optional, Union

import joblib
from sklearn.base import BaseEstimator

from ml_pipeline.preprocessing import SyghtPreprocessor

logger = logging.getLogger(__name__)


def get_environment_metadata() -> Dict[str, str]:
    """Records runtime package and environment versions for reproducibility."""
    meta = {
        "python_version": platform.python_version(),
        "platform": platform.platform(),
    }
    for pkg in ["numpy", "pandas", "scipy", "scikit-learn", "xgboost", "lightgbm", "shap", "joblib"]:
        try:
            mod = __import__(pkg.replace("-", "_"))
            meta[pkg] = getattr(mod, "__version__", "unknown")
        except ImportError:
            meta[pkg] = "not_installed"
    return meta


def save_model_bundle(
    model: BaseEstimator,
    preprocessor: SyghtPreprocessor,
    feature_names: List[str],
    decision_threshold: float,
    metadata: Dict[str, Any],
    output_path: Union[str, Path],
) -> Path:
    """
    Serializes the fitted pipeline, feature schema, decision threshold,
    and metadata into a unified joblib bundle.
    """
    out_file = Path(output_path)
    out_file.parent.mkdir(parents=True, exist_ok=True)

    bundle = {
        "model": model,
        "preprocessor": preprocessor,
        "feature_names": list(feature_names),
        "decision_threshold": float(decision_threshold),
        "metadata": {
            **metadata,
            "created_at_utc": datetime.now(timezone.utc).isoformat(),
            "environment": get_environment_metadata(),
        },
    }

    # Save uncompressed for full-fidelity serialization (matching enterprise GitHub ML repos)
    joblib.dump(bundle, out_file, compress=0)
    logger.info("Saved Syght model bundle to: %s (%.2f MB)", out_file, out_file.stat().st_size / (1024 * 1024))
    return out_file


def load_model_bundle(bundle_path: Union[str, Path]) -> Dict[str, Any]:
    """Loads a serialized Syght model bundle from disk."""
    path = Path(bundle_path)
    if not path.is_file():
        raise FileNotFoundError(f"Bundle file not found: {path}")
    return joblib.load(path)


def package_deployment_artifacts(
    artifacts_dir: Union[str, Path],
    output_zip_path: Union[str, Path],
) -> Path:
    """
    Creates a clean, self-contained zip archive containing model binaries,
    schema specifications, and benchmark reports, strictly excluding raw datasets.
    """
    source_dir = Path(artifacts_dir)
    zip_dest = Path(output_zip_path)
    zip_dest.parent.mkdir(parents=True, exist_ok=True)

    forbidden_patterns = [
        "*.csv",
        "*.parquet",
        "*.duckdb",
        "*.sqlite",
        "kaggle.json",
        ".env*",
        "*credential*",
    ]

    with zipfile.ZipFile(zip_dest, "w", zipfile.ZIP_DEFLATED) as zf:
        for file_path in source_dir.rglob("*"):
            if not file_path.is_file():
                continue

            # Ensure forbidden raw files or credentials are never bundled
            rel_path = file_path.relative_to(source_dir)
            if any(file_path.match(pat) for pat in forbidden_patterns):
                logger.warning("Excluding data/secret file from deployment package: %s", file_path.name)
                continue

            zf.write(file_path, arcname=str(rel_path))

    logger.info("Successfully packaged deployment bundle: %s (%d KB)", zip_dest, zip_dest.stat().st_size // 1024)
    return zip_dest
