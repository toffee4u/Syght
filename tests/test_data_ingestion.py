"""
Tests for Data Ingestion Module.
"""

import tempfile
from pathlib import Path

import numpy as np
import pandas as pd
import pytest

from ml_pipeline.data_ingestion import (
    derive_fraud_label,
    find_raw_file,
    read_csv_safe,
    validate_raw_tables,
)


def test_derive_fraud_label_strings():
    # Test Yes / No encoding
    df = pd.DataFrame({"PotentialFraud": ["Yes", "No", "Yes", "No"]})
    res = derive_fraud_label(df)
    assert "fraud" in res.columns
    assert list(res["fraud"]) == [1, 0, 1, 0]

    # Test True / False string encoding
    df_tf = pd.DataFrame({"PotentialFraud": ["True", "False", "True"]})
    res_tf = derive_fraud_label(df_tf)
    assert list(res_tf["fraud"]) == [1, 0, 1]

    # Test "1" / "0" string encoding
    df_str_num = pd.DataFrame({"PotentialFraud": ["1", "0", "1"]})
    res_str_num = derive_fraud_label(df_str_num)
    assert list(res_str_num["fraud"]) == [1, 0, 1]


def test_derive_fraud_label_numeric_and_bool():
    # Numeric 0/1
    df_num = pd.DataFrame({"PotentialFraud": [1, 0, 1, 0]})
    res_num = derive_fraud_label(df_num)
    assert list(res_num["fraud"]) == [1, 0, 1, 0]

    # Boolean
    df_bool = pd.DataFrame({"PotentialFraud": [True, False, False, True]})
    res_bool = derive_fraud_label(df_bool)
    assert list(res_bool["fraud"]) == [1, 0, 0, 1]


def test_derive_fraud_label_invalid_raises():
    # Unknown string category
    df_invalid = pd.DataFrame({"PotentialFraud": ["Suspect", "Clean"]})
    with pytest.raises(ValueError):
        derive_fraud_label(df_invalid)

    # Numeric out of range
    df_bad_num = pd.DataFrame({"PotentialFraud": [0, 1, 99]})
    with pytest.raises(ValueError):
        derive_fraud_label(df_bad_num)


def test_find_raw_file_and_read_csv():
    with tempfile.TemporaryDirectory() as tmp_dir:
        tmp_path = Path(tmp_dir)
        train_file = tmp_path / "Train-123456.csv"
        test_file = tmp_path / "Test-123456.csv"

        train_file.write_text("Provider,PotentialFraud\nPRV001,Yes\n", encoding="utf-8")
        test_file.write_text("Provider\nPRV999\n", encoding="utf-8")

        found = find_raw_file(tmp_path, "Train-*.csv")
        assert found == train_file

        df = read_csv_safe(found)
        assert len(df) == 1
        assert df["Provider"].iloc[0] == "PRV001"


def test_validate_raw_tables_missing_column():
    labels = pd.DataFrame({"Provider": ["P1"]})
    bene = pd.DataFrame({"BeneID": ["B1"]})  # missing chronic cols
    ip = pd.DataFrame({"Provider": ["P1"]})
    op = pd.DataFrame({"Provider": ["P1"]})

    with pytest.raises(ValueError, match="Schema validation failed"):
        validate_raw_tables(labels, bene, ip, op)
