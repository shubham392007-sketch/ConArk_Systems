# ConArk Systems – Data Quality & Target Leakage Audit Report

**Dataset Record Count:** 50000  
**Time Range:** 2023-01-01 00:00:00 to 2023-02-04 17:19:00  
**Update Frequency:** 1-minute intervals  

---

## 1. Missing Value Analysis
All columns evaluated for missing / NaN entries:
- **`timestamp`**: 0 missing (0.00%)
- **`temperature`**: 0 missing (0.00%)
- **`humidity`**: 0 missing (0.00%)
- **`vibration_level`**: 0 missing (0.00%)
- **`material_usage`**: 0 missing (0.00%)
- **`machinery_status`**: 0 missing (0.00%)
- **`worker_count`**: 0 missing (0.00%)
- **`energy_consumption`**: 0 missing (0.00%)
- **`task_progress`**: 0 missing (0.00%)
- **`cost_deviation`**: 0 missing (0.00%)
- **`time_deviation`**: 0 missing (0.00%)
- **`safety_incidents`**: 0 missing (0.00%)
- **`equipment_utilization_rate`**: 0 missing (0.00%)
- **`material_shortage_alert`**: 0 missing (0.00%)
- **`risk_score`**: 0 missing (0.00%)
- **`simulation_deviation`**: 0 missing (0.00%)
- **`update_frequency`**: 0 missing (0.00%)
- **`optimization_suggestion`**: 0 missing (0.00%)
- **`performance_score`**: 0 missing (0.00%)

---

## 2. Duplicate Analysis
- **Total Duplicate Rows:** 0 (0.00%)

---

## 3. Outlier & Range Analysis
Summary statistics across key operational features:

| Feature | Min | Max | Mean | Std | Outliers (|z| > 3) |
|---|---|---|---|---|---|
| `temperature` | 11.31 | 37.95 | 25.04 | 5.85 | 0 |
| `humidity` | 34.78 | 86.28 | 59.93 | 11.02 | 0 |
| `vibration_level` | 0.50 | 48.00 | 15.89 | 10.74 | 0 |
| `material_usage` | 0.94 | 1065.59 | 509.73 | 289.03 | 0 |
| `machinery_status` | 0.00 | 1.00 | 0.85 | 0.36 | 0 |
| `worker_count` | 10.00 | 50.00 | 29.57 | 11.02 | 0 |
| `energy_consumption` | 45.53 | 502.86 | 305.19 | 74.92 | 100 |
| `task_progress` | 0.00 | 1.00 | 0.50 | 0.29 | 0 |
| `safety_incidents` | 0.00 | 3.00 | 0.11 | 0.40 | 1034 |
| `equipment_utilization_rate` | 0.00 | 100.00 | 58.35 | 25.99 | 0 |
| `material_shortage_alert` | 0.00 | 1.00 | 0.10 | 0.29 | 4785 |
| `simulation_deviation` | 0.00 | 1.67 | 0.51 | 0.28 | 114 |

---

## 4. Target Distribution
- **`performance_score`** (Categorical): {'Poor': 20024, 'Excellent': 11398, 'Average': 9344, 'Good': 9234}
- **`risk_score`** (Numeric): Min=0.00, Max=82.23, Mean=27.44, Std=9.63
- **`cost_deviation`** (Numeric): Min=-2608.46, Max=2915.49, Mean=263.43, Std=846.66
- **`time_deviation`** (Numeric): Min=-20.06, Max=22.99, Mean=0.18, Std=8.16
- **`optimization_suggestion`** (Categorical): {'Increase Machinery Efficiency': 27412, 'Adjust Schedule': 12737, 'Optimize Material Usage': 4785, 'Reallocate Workers': 3489, 'Enhance Safety Measures': 1577}

---

## 5. Target Leakage Analysis (Synthetic Formula Detection)

> [!WARNING]
> **Synthetic Dataset Limitation:** Because the dataset is synthetic/simulated, several target variables (`risk_score`, `cost_deviation`, `time_deviation`) exhibit strong mathematical relationships with operational features like `vibration_level`, `safety_incidents`, `worker_count`, and `equipment_utilization_rate`.

### Suspected Leakage Features by Target:
#### Target: `performance_score`
- No direct single-feature target leakage detected.
#### Target: `risk_score`
- Feature **`energy_consumption`**: Correlation $r = 0.7318$ (Risk Level: MEDIUM)
#### Target: `cost_deviation`
- Feature **`material_usage`**: Correlation $r = 0.7388$ (Risk Level: MEDIUM)
#### Target: `time_deviation`
- Feature **`task_progress`**: Correlation $r = -0.7005$ (Risk Level: MEDIUM)
#### Target: `optimization_suggestion`
- No direct single-feature target leakage detected.

---

## 6. Temporal Ordering & Cardinality Analysis
- **Temporal Consistency:** Timestamp index is strictly sorted chronologically from 0 to 50,000 minutes without time travel or timestamp duplication.
- **Cardinality:**
  - `machinery_status`: Binary (0/1)
  - `material_shortage_alert`: Binary (0/1)
  - `performance_score`: 4 distinct classes (`Poor`, `Average`, `Good`, `Excellent`)
  - `optimization_suggestion`: 5 distinct classes

---

## 7. Operational Recommendations & Model Training Strategy
1. **Time-Aware Evaluation:** Train, validation, and test splits strictly preserve temporal sequence (70/15/15).
2. **Leakage Containment:** Feature engineering strictly calculates historical lags ($t-1, t-5, t-15$) and rolling stats to prevent future lookahead bias.
3. **Synthetic Prototype Disclaimer:** Models demonstrate strong predictive power on formulaic synthetic data. Real-world site deployment will require retraining on raw IoT sensor feeds.
