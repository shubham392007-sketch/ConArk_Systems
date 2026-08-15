# Product Requirements Document – ConArk Systems

**Product:** ConArk Systems
**Product Type:** AI-powered Construction Intelligence & Decision Support Platform
**Primary Goal:** Convert construction-site operational data into actionable predictions, risk intelligence, forecasts, alerts, and optimization recommendations.
**Core AI Stack:** 5 ML models + rule-based intelligence engine + Gemini 2.5 Flash
**Backend:** FastAPI
**Primary Users:** Construction managers, site engineers, project managers, safety officers, operations teams, researchers, and students.

---

## 1. Product Vision

**ConArk Systems** is an AI-driven construction intelligence platform designed to help project teams understand the current state of a construction project and make better operational decisions.

The platform takes construction-site data such as environmental conditions, machinery activity, worker count, material usage, energy consumption, task progress, safety incidents, and equipment utilization.

It processes this information through five specialized ML models:

1. Performance Prediction
2. Risk Prediction
3. Cost Forecasting
4. Time/Schedule Forecasting
5. Optimization Recommendation

A separate intelligence layer detects safety, material, equipment, and schedule alerts.

Finally, Gemini 2.5 Flash converts the technical ML output into a clear, structured construction report that a human can understand.

The fundamental architecture is:

```text
Construction Data
       ↓
Validation
       ↓
Feature Engineering
       ↓
5 ML Models
       ↓
Alert + Decision Engine
       ↓
Structured ML Results
       ↓
Gemini AI
       ↓
Construction Intelligence Report
       ↓
Dashboard
```

The core philosophy is:

> **ML predicts. Rules detect. Gemini explains. Humans decide.**

---

# 2. Problem Statement

Construction projects generate large amounts of operational information, but this information is often fragmented across:

* Site measurements
* Machinery data
* Worker activity
* Material consumption
* Project schedules
* Cost records
* Safety reports
* Environmental conditions

Raw data does not directly answer the questions that project managers care about:

* Is the project performing well?
* Is project risk increasing?
* Are we heading toward budget overruns?
* Are we likely to be delayed?
* Is machinery being used efficiently?
* Is there a safety concern?
* Are materials being consumed abnormally?
* What action should the project team take?

ConArk Systems addresses this gap by transforming operational data into **construction intelligence**.

---

# 3. Product Objectives

### Primary objectives

ConArk must:

* Predict construction performance.
* Estimate construction risk.
* Forecast cost deviation.
* Forecast schedule deviation.
* Recommend optimization actions.
* Detect safety-related problems.
* Detect material shortages and abnormal consumption.
* Detect machinery/equipment issues.
* Generate a unified project health score.
* Explain ML results in natural language.
* Provide structured APIs for dashboard/mobile integration.
* Support both individual observations and time-series data.

### Secondary objectives

The platform should:

* Track historical trends.
* Provide model confidence or uncertainty where mathematically valid.
* Explain important prediction factors.
* Maintain model versions.
* Provide model evaluation metrics.
* Gracefully handle Gemini API failures.
* Support future IoT/sensor integration.

---

# 4. Target Users

### Construction Manager

Needs:

* Overall project health
* Risk status
* Cost forecast
* Schedule forecast
* Recommended actions
* Critical alerts

### Site Engineer

Needs:

* Machinery status
* Equipment utilization
* Material consumption
* Environmental conditions
* Safety alerts
* Operational recommendations

### Safety Officer

Needs:

* Risk score
* Safety incidents
* Vibration anomalies
* Worker-related risk indicators
* Critical safety alerts

### Project Manager

Needs:

* Budget deviation
* Schedule deviation
* Performance trends
* Forecasts
* High-level AI summaries

### Researcher / Student

Needs:

* Dataset analysis
* Model metrics
* Feature importance
* Prediction results
* API access
* Model experimentation

---

# 5. Core Product Modules

ConArk consists of the following major modules:

```text
1. Data Intelligence
2. Performance Intelligence
3. Risk Intelligence
4. Cost Forecasting
5. Schedule Forecasting
6. Safety Intelligence
7. Material Intelligence
8. Equipment Intelligence
9. Optimization Intelligence
10. Gemini AI Explanation
11. Project Health Dashboard
12. ML Model Management
13. FastAPI Backend
```

---

# 6. Data Intelligence Module

The platform must accept construction data through:

* Manual form input
* CSV dataset
* API request
* Future IoT/sensor stream

Canonical input:

```text
timestamp
temperature
humidity
vibration_level
material_usage
machinery_status
worker_count
energy_consumption
task_progress
safety_incidents
equipment_utilization_rate
material_shortage_alert
```

Optional forecasting inputs:

```text
cost_deviation
time_deviation
```

Training-only target variables:

```text
risk_score
optimization_suggestion
performance_score
```

The system must distinguish between:

**Input features** and **prediction targets**.

---

# 7. Data Validation Requirements

Every incoming request must pass validation.

Examples:

```text
Humidity: 0–100%
Equipment utilization: 0–100%
Machinery status: 0/1
Material usage: >= 0
Energy consumption: >= 0
Worker count: >= 0
Safety incidents: >= 0
```

Invalid input must return a clear validation error.

The system must not silently convert incorrect values.

Example:

```text
worker_count = -10
```

must produce a validation error.

---

# 8. Feature Engineering

ConArk must convert raw measurements into meaningful ML features.

### Temporal features

```text
hour
day
day_of_week
day_of_month
week_of_year
is_weekend
```

### Lag features

```text
vibration_lag_1
vibration_lag_5
vibration_lag_15
energy_lag_1
energy_lag_5
energy_lag_15
material_lag_1
material_lag_5
material_lag_15
```

### Rolling statistics

```text
vibration_mean_5
vibration_mean_15
vibration_max_5
vibration_max_15

energy_mean_5
energy_mean_15

material_mean_5
material_mean_15
```

### Trend features

```text
vibration_change
energy_change
material_change
worker_change
task_progress_change
risk_change
```

### Efficiency features

```text
material_efficiency
energy_efficiency
equipment_efficiency
worker_productivity
```

Feature engineering must be performed without future-data leakage.

---

# 9. ML Model 1 – Performance Prediction

### Objective

Predict overall construction performance.

### Target

```text
performance_score
```

Classes:

```text
Poor
Average
Good
Excellent
```

### Candidate algorithms

* Random Forest
* XGBoost
* Gradient Boosting
* Logistic Regression baseline

### Evaluation

```text
Accuracy
Precision
Recall
F1 Score
Macro F1
Confusion Matrix
```

### Output

```json
{
  "prediction": "Good",
  "confidence": 0.91,
  "probabilities": {
    "Poor": 0.01,
    "Average": 0.08,
    "Good": 0.91,
    "Excellent": 0.00
  }
}
```

---

# 10. ML Model 2 – Risk Prediction

### Objective

Predict construction project risk.

### Target

```text
risk_score
```

Range:

```text
0–100
```

### Risk levels

|  Score | Level    |
| -----: | -------- |
|   0–25 | Low      |
|  26–50 | Moderate |
|  51–75 | High     |
| 76–100 | Critical |

### Candidate algorithms

* Random Forest Regressor
* Gradient Boosting Regressor
* XGBoost Regressor

### Metrics

```text
MAE
RMSE
R²
```

### Output

```json
{
  "risk_score": 72.4,
  "risk_level": "High"
}
```

---

# 11. ML Model 3 – Cost Forecasting

### Objective

Predict future cost deviation from planned budget.

### Target

```text
cost_deviation
```

### Output

```json
{
  "predicted_cost_deviation": 2450.80,
  "budget_status": "Over Budget"
}
```

Statuses:

```text
Under Budget
On Budget
Over Budget
```

### Evaluation

```text
MAE
RMSE
R²
```

The model must not use future information unavailable at prediction time.

---

# 12. ML Model 4 – Time/Schedule Forecasting

### Objective

Predict schedule deviation.

### Target

```text
time_deviation
```

Unit:

```text
days
```

### Output

```json
{
  "predicted_time_deviation_days": 4.2,
  "schedule_status": "Delayed"
}
```

Statuses:

```text
Ahead
On Schedule
Delayed
```

---

# 13. ML Model 5 – Optimization Recommendation

### Objective

Recommend the most appropriate operational optimization action.

### Target

```text
optimization_suggestion
```

Possible recommendations:

```text
Optimize Material Usage
Reallocate Workers
Adjust Schedule
Enhance Safety Measures
Increase Machinery Efficiency
```

### Output

```json
{
  "recommendation": "Increase Machinery Efficiency",
  "confidence": 0.87,
  "supporting_factors": [
    "High equipment utilization",
    "Elevated vibration",
    "High energy consumption"
  ]
}
```

The supporting factors must originate from the actual input/model analysis, not be invented by Gemini.

---

# 14. Safety Intelligence

Safety intelligence should combine:

* ML risk prediction
* Safety incident history
* Vibration monitoring
* Worker count
* Equipment utilization
* Trend detection
* Rule-based thresholds

Example:

```text
High vibration
+
High equipment utilization
+
Increasing risk
=
High Machinery Safety Alert
```

Alert structure:

```json
{
  "type": "SAFETY",
  "severity": "HIGH",
  "title": "High Machinery Vibration",
  "message": "Machinery vibration is significantly elevated.",
  "priority": 1
}
```

---

# 15. Material Intelligence

Material intelligence monitors:

* Material consumption
* Material shortage flags
* Consumption trends
* Task progress
* Abnormal consumption

Examples:

```text
Material shortage detected
```

```text
Material usage unusually high compared with recent trend
```

```text
Material consumption is not aligned with task progress
```

---

# 16. Equipment Intelligence

Equipment intelligence monitors:

* Machinery status
* Vibration
* Energy consumption
* Equipment utilization
* Operational trends

Potential alerts:

```text
Equipment Overutilization
High Vibration
Abnormal Energy Consumption
Potential Machinery Efficiency Issue
```

---

# 17. Schedule Intelligence

Schedule intelligence combines:

* Task progress
* Worker count
* Machinery availability
* Material availability
* Safety incidents
* Time forecast

It should detect:

```text
Potential Delay
Increasing Delay Trend
Resource Bottleneck
Material-Driven Delay
Equipment-Driven Delay
```

---

# 18. Optimization Engine

The optimization engine combines the output of:

* Performance model
* Risk model
* Cost model
* Time model
* Optimization model
* Alert engine

It should produce:

```text
Recommended Action
Priority
Reason
Expected Objective
```

Example:

```json
{
  "recommendation": "Increase Machinery Efficiency",
  "priority": "High",
  "reason": "Equipment utilization and vibration are elevated while energy consumption remains high.",
  "objective": "Reduce equipment-related operational inefficiency."
}
```

The platform must not claim that an action will definitely save a particular amount unless that estimate is supported by a validated model.

---

# 19. Overall Project Health Score

ConArk should provide a single project-health indicator.

Example weighting:

```text
Performance: 30%
Risk: 30%
Schedule: 20%
Cost: 10%
Safety: 10%
```

Weights must be configurable.

Output:

```json
{
  "overall_health_score": 74,
  "health_status": "Good"
}
```

Possible statuses:

```text
Critical
Poor
Needs Attention
Good
Excellent
```

The score must be transparent and documented.

It must not be presented as a separately trained ML prediction.

---

# 20. Gemini AI Layer

Gemini is the **AI explanation and communication layer**.

It receives:

```text
Validated Input
+
ML Results
+
Alerts
+
Health Score
+
Feature Importance
+
Optimization Recommendation
```

Gemini produces:

```text
Executive Summary
Key Findings
Risk Explanation
Performance Explanation
Cost Explanation
Schedule Explanation
Safety Explanation
Optimization Explanation
Recommended Actions
Priority
Limitations
```

Gemini must not:

* Change model predictions.
* Invent values.
* Invent incidents.
* Modify risk score.
* Modify cost prediction.
* Modify time prediction.
* Override critical alerts.
* Pretend uncertainty does not exist.

The system must use structured output rather than relying on free-form text parsing.

---

# 21. Gemini Architecture

```text
ML Engine
   │
   ├── Performance
   ├── Risk
   ├── Cost
   ├── Time
   └── Optimization
          │
          ▼
     Alert Engine
          │
          ▼
   Decision Engine
          │
          ▼
      Gemini AI
          │
          ▼
 Structured Report
```

Gemini should use:

```text
GEMINI_API_KEY
GEMINI_MODEL=gemini-2.5-flash
```

The API key must remain server-side.

---

# 22. Gemini Failure Handling

If Gemini fails:

```text
ML predictions must still be returned.
```

Possible status:

```json
{
  "gemini": {
    "status": "unavailable",
    "message": "AI explanation temporarily unavailable."
  }
}
```

The dashboard should still show:

* Performance
* Risk
* Cost
* Time
* Optimization
* Alerts

---

# 23. Unified Intelligence API

Primary endpoint:

```text
POST /api/v1/intelligence/analyze
```

It executes:

```text
Validation
→ Feature Engineering
→ Performance
→ Risk
→ Cost
→ Time
→ Optimization
→ Alerts
→ Health Score
→ Gemini
→ Response
```

This is the primary API consumed by the frontend.

---

# 24. Supporting APIs

```text
GET  /api/v1/health

GET  /api/v1/models

GET  /api/v1/model-metrics

POST /api/v1/predict/performance

POST /api/v1/predict/risk

POST /api/v1/forecast/cost

POST /api/v1/forecast/time

POST /api/v1/recommendation

POST /api/v1/alerts

POST /api/v1/intelligence/analyze
```

FastAPI must automatically expose:

```text
/docs
/redoc
```

---

# 25. Unified API Response

The frontend should receive one consistent object:

```json
{
  "request_id": "uuid",
  "timestamp": "2023-01-01T00:08:00",

  "health": {
    "score": 74,
    "status": "Good"
  },

  "performance": {
    "prediction": "Good",
    "confidence": 0.91
  },

  "risk": {
    "score": 67.4,
    "level": "High"
  },

  "cost_forecast": {
    "deviation": 2450.8,
    "status": "Over Budget"
  },

  "time_forecast": {
    "deviation_days": 4.2,
    "status": "Delayed"
  },

  "optimization": {
    "recommendation": "Increase Machinery Efficiency",
    "confidence": 0.87
  },

  "alerts": [],

  "ai_report": {
    "overall_status": "Needs Attention",
    "executive_summary": "...",
    "key_findings": [],
    "recommended_actions": [],
    "priority": "High"
  }
}
```

---

# 26. Dashboard Requirements

The eventual ConArk dashboard should contain:

### Overview

```text
Overall Project Health
Performance
Risk
Cost
Schedule
```

### Live Metrics

```text
Temperature
Humidity
Vibration
Workers
Material Usage
Energy
Equipment Utilization
Task Progress
```

### Risk Center

Show:

```text
Risk Score
Risk Level
Risk Trend
Top Risk Factors
```

### Forecast Center

Show:

```text
Cost Forecast
Schedule Forecast
Expected Deviation
```

### Alert Center

Categorize:

```text
Critical
High
Medium
Low
```

with filters:

```text
Safety
Material
Equipment
Schedule
Risk
```

### Optimization Center

Show:

```text
Recommended Action
Priority
Reason
Supporting Factors
```

### AI Report

Show the Gemini-generated:

```text
Executive Summary
Key Findings
Recommended Actions
```

---

# 27. Historical Analytics

The platform should eventually support time-series visualization:

```text
Risk over time
Performance over time
Temperature over time
Vibration over time
Energy over time
Material usage over time
Worker count over time
Task progress over time
```

Charts should support:

* Time range
* Zoom
* Filtering
* Hover details
* Trend detection

---

# 28. Model Management

Every model must store:

```text
Model Name
Version
Algorithm
Training Date
Dataset Version
Features
Target
Metrics
```

Example:

```json
{
  "model_name": "ConArk Risk Model",
  "version": "1.0.0",
  "algorithm": "XGBRegressor",
  "target": "risk_score",
  "rmse": 7.2,
  "r2": 0.91
}
```

---

# 29. Explainability

The system should expose model feature importance.

For tree-based models, support:

```text
Feature Importance
SHAP
```

Example:

```text
Top Risk Factors:

1. Vibration Level
2. Equipment Utilization
3. Energy Consumption
4. Worker Count
5. Safety Incidents
```

The explanation layer must clearly distinguish statistical importance from causal relationships.

Do not tell users:

> "Vibration caused the risk."

Instead:

> "Higher vibration is strongly associated with the model's predicted risk."

---

# 30. Dataset Limitations

The dataset is synthetic.

ConArk must clearly communicate:

```text
This system is a research/prototype construction intelligence platform trained on simulated data. Its predictions are not validated for real-world construction-site deployment.
```

The system must not claim:

* Certified safety predictions
* Guaranteed cost savings
* Guaranteed schedule accuracy
* Professional engineering approval
* Real-world safety certification

---

# 31. Non-Functional Requirements

### Performance

Normal ML inference should target:

```text
< 1 second
```

excluding external Gemini latency.

### Gemini

Gemini response should target:

```text
< 5 seconds
```

under normal network conditions.

### Availability

Gemini failure must not make the ML API unusable.

### Scalability

The architecture should allow future:

```text
IoT sensors
Multiple construction projects
Multiple sites
Real-time streaming
Cloud deployment
```

### Security

Secrets must remain server-side.

### Maintainability

ML models must be replaceable without rewriting the API.

---

# 32. Technology Stack

### Backend

```text
Python
FastAPI
Pydantic
Uvicorn
```

### ML

```text
Pandas
NumPy
Scikit-learn
XGBoost
Joblib
SHAP
```

### AI

```text
Google Gemini API
Gemini 2.5 Flash
google-genai SDK
```

### Data

```text
CSV
Pandas
Future: PostgreSQL / TimescaleDB
```

### Deployment

```text
Docker
Docker Compose
```

---

# 33. Security Requirements

Never expose:

```text
Gemini API key
Environment variables
Model internals
Server stack traces
```

Use:

```text
.env
```

for secrets.

Add:

* CORS configuration
* Input validation
* Request limits
* Error handling
* Structured logging

---

# 34. Testing Requirements

Unit tests must cover:

```text
Dataset validation
Schema normalization
Feature engineering
Performance model
Risk model
Cost model
Time model
Optimization model
Alert engine
Health score
Gemini service
Gemini failure
API endpoints
```

Integration test:

```text
POST /api/v1/intelligence/analyze
```

must verify the complete pipeline.

---

# 35. Success Metrics

The project is considered technically successful when:

### ML

All five models train successfully.

### Performance

Classification models achieve measurable and reproducible metrics.

### Forecasting

Cost and time models produce validated regression metrics.

### Optimization

Recommendation model produces all expected recommendation classes.

### Alerts

Rule-based alert engine correctly detects predefined scenarios.

### Gemini

Gemini successfully converts structured ML output into valid structured reports.

### API

All endpoints return valid schemas.

### Reliability

Gemini failure does not break ML inference.

### Reproducibility

Models can be retrained using the documented training pipeline.

---

# 36. MVP Scope

The first ConArk release should contain:

```text
✓ Dataset ingestion
✓ Data validation
✓ Feature engineering
✓ Five ML models
✓ Model evaluation
✓ Model serialization
✓ Alert engine
✓ Optimization engine
✓ Overall health score
✓ Gemini integration
✓ FastAPI
✓ Swagger
✓ Unified intelligence endpoint
✓ Unit tests
✓ README
```

Do not include complex IoT infrastructure in the first version.

---

# 37. Phase 2

Add:

```text
Historical dashboard
Real-time charts
Project management
Multiple construction sites
Sensor registration
CSV upload UI
Model monitoring
Prediction history
```

---

# 38. Phase 3

Add:

```text
IoT integration
Real-time sensor streaming
Cloud deployment
Database
Project-specific models
Automated retraining
Anomaly detection
Advanced forecasting
Computer vision for site monitoring
PPE detection
Structural image analysis
Drone imagery
Satellite/site mapping
```

---

# 39. Future ConArk Architecture

The long-term system can evolve into:

```text
                    CONARK SYSTEMS
                          │
           ┌──────────────┼──────────────┐
           │              │              │
        Sensors         Users          Vision
           │              │              │
           ▼              ▼              ▼
      Data Platform   User Input     Computer Vision
           │              │              │
           └──────────────┼──────────────┘
                          ▼
                  Feature Engineering
                          │
                          ▼
                   ML Intelligence
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   Prediction         Forecasting       Detection
        │                 │                 │
        └─────────────────┼─────────────────┘
                          ▼
                   Decision Engine
                          │
                          ▼
                     Gemini AI
                          │
                          ▼
                Construction Copilot
                          │
                          ▼
                  Project Dashboard
```

The eventual product can become a **Construction AI Copilot**, rather than just a prediction dashboard.

---

# 40. Product Positioning

The core positioning for ConArk Systems should be:

> **ConArk Systems is an AI-powered construction intelligence platform that transforms site data into performance predictions, risk intelligence, cost and schedule forecasts, safety alerts, and actionable optimization recommendations.**

The five ML models form the analytical core.

The alert and decision engines convert predictions into operational intelligence.

Gemini turns that intelligence into understandable communication.

FastAPI connects the intelligence engine to the product.

The dashboard presents the result to the user.

That gives ConArk a clean product hierarchy:

```text
DATA
 ↓
INTELLIGENCE
 ↓
PREDICTION
 ↓
DECISION
 ↓
EXPLANATION
 ↓
ACTION
```

**That should be the central product philosophy of ConArk Systems.**
