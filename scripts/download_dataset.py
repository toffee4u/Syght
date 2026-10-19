"""
Syght Healthcare Fraud Dataset Downloader.
Downloads and verifies official CMS Medicare Provider Fraud Benchmark dataset from Kaggle.
"""

from __future__ import annotations

import json
import os
import sys
from pathlib import Path

# Ensure UTF-8 output encoding on Windows terminals
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def download_benchmark_dataset(
    dest_dir: Path | str = "data/raw",
    dataset_slug: str = "rohitrox/healthcare-provider-fraud-detection-analysis",
    username: str = "toffee4u",
    api_key: str = "KGAT_6e662664ddaad8d08bcac6f454dc7e09",
) -> list[str]:
    """Downloads and unzips the official Medicare benchmark dataset from Kaggle."""
    raw_path = PROJECT_ROOT / dest_dir
    raw_path.mkdir(parents=True, exist_ok=True)

    # Configure Kaggle credentials in user home directory if missing
    kaggle_dir = Path.home() / ".kaggle"
    kaggle_dir.mkdir(parents=True, exist_ok=True)
    kaggle_json = kaggle_dir / "kaggle.json"

    if not kaggle_json.exists():
        with open(kaggle_json, "w", encoding="utf-8") as f:
            json.dump({"username": username, "key": api_key}, f)
        try:
            kaggle_json.chmod(0o600)
        except Exception:
            pass

    os.environ["KAGGLE_USERNAME"] = username
    os.environ["KAGGLE_KEY"] = api_key

    print(f"[*] Authenticating with Kaggle API ({username})...")
    from kaggle.api.kaggle_api_extended import KaggleApi

    api = KaggleApi()
    api.authenticate()

    existing_csvs = list(raw_path.glob("Train-*.csv"))
    if existing_csvs:
        print(f"[+] Dataset already downloaded and verified in {raw_path}!")
        csv_files = sorted([f.name for f in raw_path.glob("*.csv")])
        for name in csv_files:
            size_mb = (raw_path / name).stat().st_size / (1024 * 1024)
            print(f"    - {name:<42} ({size_mb:6.2f} MB)")
        return csv_files

    print(f"[*] Downloading {dataset_slug} into {raw_path}...")
    api.dataset_download_files(dataset_slug, path=str(raw_path), unzip=True)

    csv_files = sorted([f.name for f in raw_path.glob("*.csv")])
    print(f"[+] Download successfully completed! Found {len(csv_files)} CSV tables:")
    for name in csv_files:
        size_mb = (raw_path / name).stat().st_size / (1024 * 1024)
        print(f"    - {name:<42} ({size_mb:6.2f} MB)")

    return csv_files


if __name__ == "__main__":
    download_benchmark_dataset()
