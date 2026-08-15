# ConArk Systems – Technical Requirements Document

**Version:** 1.0
**Project:** ConArk Systems
**System Type:** AI-powered Construction Intelligence & Decision Support Platform
**Primary Backend:** FastAPI
**ML Stack:** Python, Scikit-learn, XGBoost
**LLM:** Gemini 2.5 Flash
**Dataset:** Building Performance Dataset, 50,000 time-series records
**Core ML Models:** 5
**Architecture:** ML prediction → Decision/Alert Engine → Gemini explanation → API response

---

## 1. Technical Objective

ConArk Systems must transform construction-site data into five core AI outputs:

1. **Performance Prediction**
2. **Risk Prediction**
3. **Cost Forecasting**
4. **Time/Schedule Forecasting**
5. **Optimization Recommendation**

These outputs are then processed by an intelligence layer containing:

* Safety alerts
* Material alerts
* Equipment alerts
* Schedule alerts
* Project health scoring
* Feature importance
* Decision logic

Gemini 2.5 Flash is responsible for **communicating and contextualizing the validated outputs**, not generating the underlying predictions.

The fundamental technical pipeline is:

```text
Raw Construction Data
        ↓
Input Validation
        ↓
Data Normalization
        ↓
Feature Engineering
        ↓
 ┌──────┴──────────────────────────┐
 │                                 │
 ▼                                 ▼
Performance Model             Risk Model
Cost Model                    Time Model
Optimization Model
 │
 └──────────────┬──────────────────┘
                ↓
       Intelligence Engine
                ↓
       Alert + Health Engine
                ↓
       Structured ML Result
                ↓
          Gemini 2.5 Flash
                ↓
       Structured AI Report
                ↓
             FastAPI
                ↓
        Frontend / Dashboard
```

---

# 2. System Architecture

The system should follow a modular architecture rather than putting everything into one FastAPI file.

```text
conark-systems/
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── health.py
│   │   │   │   ├── prediction.py
│   │   │   │   ├── forecasting.py
│   │   │   │   ├── recommendation.py
│   │   │   │   ├── intelligence.py
│   │   │   │   └── models.py
│   │   │   │
│   │   │   └── dependencies.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── input_schema.py
│   │   │   ├── prediction_schema.py
│   │   │   ├── forecast_schema.py
│   │   │   ├── recommendation_schema.py
│   │   │   ├── alert_schema.py
│   │   │   └── intelligence_schema.py
│   │   │
│   │   ├── services/
│   │   │   ├── prediction_service.py
│   │   │   ├── forecasting_service.py
│   │   │   ├── recommendation_service.py
│   │   │   ├── alert_service.py
│   │   │   ├── health_service.py
│   │   │   └── gemini_service.py
│   │   │
│   │   ├── ml/
│   │   │   ├── performance/
│   │   │   ├── risk/
│   │   │   ├── cost/
│   │   │   ├── time/
│   │   │   └── optimization/
│   │   │
│   │   ├── preprocessing/
│   │   ├── core/
│   │   ├── utils/
│   │   └── config/
│   │
│   ├── models/
│   ├── data/
│   ├── tests/
│   ├── requirements.txt
│   ├── .env
│   └── Dockerfile
│
├── notebooks/
├── docs/
└── README.md
```

---

# 3. Technology Requirements

| Layer                 | Technology            |
| --------------------- | --------------------- |
| Language              | Python 3.11+          |
| API                   | FastAPI               |
| Server                | Uvicorn               |
| Validation            | Pydantic              |
| Data                  | Pandas, NumPy         |
| ML                    | Scikit-learn          |
| Gradient Boosting     | XGBoost               |
| Explainability        | SHAP                  |
| Model Serialization   | Joblib                |
| LLM                   | Gemini 2.5 Flash      |
| LLM SDK               | Google GenAI SDK      |
| Testing               | Pytest                |
| Containerization      | Docker                |
| Configuration         | Environment Variables |
| Documentation         | FastAPI OpenAPI       |
| Future DB             | PostgreSQL            |
| Future Time-Series DB | TimescaleDB           |

---

# 4. Dataset Specification

The system must support the supplied 50,000-record dataset.

Primary fields:

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
cost_deviation
time_deviation
safety_incidents
equipment_utilization_rate
material_shortage_alert
risk_score
simulation_deviation
update_frequency
optimization_suggestion
performance_score
```

The second dataset format must also be supported through a normalization layer:

```text
Sensor_ID
Resource_Utilization
Simulation_Accuracy
```

These must be mapped into the canonical ConArk schema.

For example:

```text
Resource_Utilization
        ↓
equipment_utilization_rate
```

and:

```text
Simulation_Accuracy
        ↓
derived simulation_deviation
```

The normalization layer must prevent dataset naming differences from propagating into model code.

---

# 5. Data Types

Recommended canonical schema:

```text
timestamp                         datetime
temperature                       float
humidity                          float
vibration_level                   float
material_usage                    float
machinery_status                  int
worker_count                      int
energy_consumption                float
task_progress                     float
cost_deviation                    float
time_deviation                    float
safety_incidents                  int
equipment_utilization_rate        float
material_shortage_alert           int
risk_score                        float
simulation_deviation              float
update_frequency                  int
optimization_suggestion           category
performance_score                 category
```

---

# 6. Input API Schema

The prediction endpoint should accept:

```json
{
  "timestamp": "2023-01-01T00:08:00",
  "temperature": 30.02,
  "humidity": 42.41,
  "vibration_level": 17.03,
  "material_usage": 551.88,
  "machinery_status": 1,
  "worker_count": 48,
  "energy_consumption": 153.68,
  "task_progress": 0.3679,
  "safety_incidents": 0,
  "equipment_utilization_rate": 87.14,
  "material_shortage_alert": 0
}
```

Training target columns must not be required from the user for inference.

---

# 7. Data Validation

Pydantic must enforce constraints.

Examples:

```text
temperature        → realistic numeric range
humidity           → 0–100
machinery_status   → 0/1
worker_count       → >= 0
material_usage     → >= 0
energy_consumption → >= 0
task_progress      → 0–1 or normalized 0–100
safety_incidents   → >= 0
equipment_utilization_rate → 0–100
material_shortage_alert → 0/1
```

The project must standardize the representation of `task_progress`.

Because the provided dataset stores values such as:

```text
0.025
0.062
0.141
```

the model pipeline should treat it as normalized progress:

```text
0 = 0%
1 = 100%
```

The frontend may display:

```text
36.79%
```

while the ML pipeline receives:

```text
0.3679
```

---

# 8. Preprocessing Pipeline

The preprocessing system must perform:

```text
Raw Data
 ↓
Schema Validation
 ↓
Missing Value Handling
 ↓
Duplicate Detection
 ↓
Outlier Analysis
 ↓
Categorical Encoding
 ↓
Numerical Scaling where required
 ↓
Temporal Feature Extraction
 ↓
Feature Engineering
 ↓
Model Input
```

Tree-based models generally do not require numerical scaling, so unnecessary scaling should not be introduced.

---

# 9. Time-Series Data Handling

The dataset consists of 1-minute observations.

Therefore, random train/test splitting should **not** be the default strategy for time-dependent experiments.

Use chronological splitting:

```text
Training
Jan → earlier period

Validation
middle period

Testing
latest period
```

Example:

```text
70% → Training
15% → Validation
15% → Test
```

No future observations may leak into training features.

---

# 10. Feature Engineering

Required temporal features:

```text
hour
minute
day
day_of_week
day_of_month
month
```

Required trend features:

```text
temperature_change
humidity_change
vibration_change
material_usage_change
energy_change
worker_count_change
task_progress_change
equipment_utilization_change
```

Rolling features:

```text
vibration_mean_5
vibration_mean_15
energy_mean_5
energy_mean_15
material_mean_5
material_mean_15
worker_mean_15
```

Efficiency features:

```text
energy_per_worker
material_per_progress
energy_per_progress
worker_productivity
equipment_efficiency
```

All lag and rolling features must be generated chronologically.

---

# 11. Model 1 – Performance Prediction

### Problem type

Multiclass classification.

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

### Candidate models

Baseline:

```text
Logistic Regression
```

Production candidate:

```text
RandomForestClassifier
XGBClassifier
```

Model selection should be based on validation performance, not assumed in advance.

### Metrics

```text
Accuracy
Precision
Recall
F1
Macro F1
Confusion Matrix
```

### Model artifact

```text
models/performance/model.joblib
models/performance/preprocessor.joblib
models/performance/metadata.json
```

---

# 12. Model 2 – Risk Prediction

### Problem type

Regression.

### Target

```text
risk_score
```

### Candidate algorithms

```text
RandomForestRegressor
XGBRegressor
GradientBoostingRegressor
```

### Metrics

```text
MAE
RMSE
R²
```

### Derived risk level

```text
0–25     Low
26–50    Moderate
51–75    High
76–100   Critical
```

The model predicts the numerical risk score. The application derives the category.

---

# 13. Model 3 – Cost Forecasting

### Problem type

Regression.

### Target

```text
cost_deviation
```

### Candidate models

```text
RandomForestRegressor
XGBRegressor
GradientBoostingRegressor
```

### Metrics

```text
MAE
RMSE
R²
MAPE
```

MAPE must be used cautiously if actual target values can approach zero.

### Derived status

```text
negative deviation → Under Budget
near zero           → On Budget
positive deviation  → Over Budget
```

A configurable tolerance should define "On Budget."

---

# 14. Model 4 – Time Forecasting

### Problem type

Regression.

### Target

```text
time_deviation
```

### Output

Number of days.

Example:

```text
-2.4 days → Ahead
0.8 days  → Near Schedule
4.7 days  → Delayed
```

### Metrics

```text
MAE
RMSE
R²
```

The status thresholds must be configurable.

---

# 15. Model 5 – Optimization Recommendation

### Problem type

Multiclass classification.

### Target

```text
optimization_suggestion
```

Classes:

```text
Optimize Material Usage
Reallocate Workers
Adjust Schedule
Enhance Safety Measures
Increase Machinery Efficiency
```

### Candidate algorithms

```text
RandomForestClassifier
XGBClassifier
```

### Metrics

```text
Accuracy
Precision
Recall
F1
Macro F1
Confusion Matrix
```

### Output

```json
{
  "recommendation": "Optimize Material Usage",
  "confidence": 0.89
}
```

---

# 16. Critical Dataset Issue

There is a major technical concern with the supplied dataset.

Several targets appear to be **synthetically generated from related features or arbitrary simulation logic**. Therefore, extremely high model scores could indicate that the model is learning the dataset's generation formula rather than real construction relationships.

The training pipeline must therefore include:

```text
Correlation analysis
Target leakage analysis
Feature importance
Temporal validation
Baseline comparison
Error analysis
```

If a model reaches something like:

```text
99.9% accuracy
```

that should be investigated rather than celebrated automatically.

For a portfolio/research project, documenting this limitation actually makes ConArk stronger.

---

# 17. Alert Engine

The alert engine must operate independently of Gemini.

Example rules:

```text
IF vibration_level > threshold
AND equipment_utilization > threshold
THEN machinery_alert
```

```text
IF material_shortage_alert == 1
THEN material_alert
```

```text
IF safety_incidents > 0
THEN safety_alert
```

```text
IF risk_score > 75
THEN critical_risk_alert
```

```text
IF predicted_time_deviation > threshold
THEN schedule_alert
```

Rules must be stored in configuration rather than hardcoded throughout the application.

---

# 18. Alert Priority

```text
CRITICAL
HIGH
MEDIUM
LOW
INFO
```

Example:

```json
{
  "alert_id": "ALT-001",
  "type": "SAFETY",
  "severity": "CRITICAL",
  "title": "Critical Construction Risk",
  "description": "Predicted project risk has exceeded the critical threshold.",
  "source": "risk_model",
  "value": 82.4
}
```

---

# 19. Health Score Engine

The health score is a deterministic decision layer.

Example:

```text
Performance contribution = 30%
Risk contribution        = 30%
Schedule contribution    = 20%
Cost contribution        = 10%
Safety contribution      = 10%
```

The raw variables must first be normalized onto a common scale.

Example:

```text
health =
performance_score
+
risk_health
+
schedule_health
+
cost_health
+
safety_health
```

Weights must be configurable:

```text
config/health_weights.yaml
```

This is preferable to hiding the formula inside application code.

---

# 20. Gemini Integration

Gemini is not a sixth prediction model.

It is an **explanation and reporting layer**.

The backend constructs a structured context:

```json
{
  "input_summary": {},
  "performance": {},
  "risk": {},
  "cost_forecast": {},
  "time_forecast": {},
  "optimization": {},
  "alerts": {},
  "health_score": {},
  "feature_importance": {}
}
```

This is sent to Gemini.

---

# 21. Gemini Prompt Contract

System instruction should establish:

```text
You are ConArk AI, a construction intelligence reporting assistant.

You receive validated outputs from machine learning models.

Do not modify numerical predictions.
Do not invent facts.
Do not create unsupported incidents.
Do not override model outputs.
Do not claim causal relationships unless provided.
Explain uncertainty where present.
Prioritize safety-related alerts.
Return only the requested structured format.
```

The prompt should include the ML output as structured JSON.

---

# 22. Gemini Structured Response

Expected structure:

```json
{
  "executive_summary": "The project is currently performing well but requires attention to equipment efficiency.",

  "overall_status": "Needs Attention",

  "key_findings": [
    "Risk is elevated.",
    "Equipment utilization is high.",
    "Schedule deviation indicates potential delay."
  ],

  "risk_explanation": "...",

  "cost_explanation": "...",

  "schedule_explanation": "...",

  "performance_explanation": "...",

  "recommended_actions": [
    {
      "action": "Increase Machinery Efficiency",
      "priority": "High",
      "reason": "..."
    }
  ],

  "safety_message": "...",

  "confidence_note": "Predictions are generated from the available model inputs."
}
```

The backend must validate the Gemini response before returning it.

---

# 23. Gemini API Key Management

`.env`:

```text
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
```

Never place the API key inside:

```text
Frontend JavaScript
React source
Android app
GitHub repository
Docker image
API response
```

Use environment variables in deployment.

---

# 24. Gemini Service

Recommended abstraction:

```text
services/gemini_service.py
```

Responsibilities:

```text
Create prompt
Call Gemini
Handle API errors
Parse response
Validate response
Return structured result
```

It must not contain ML logic.

---

# 25. Unified Intelligence Endpoint

Primary endpoint:

```text
POST /api/v1/intelligence/analyze
```

Processing sequence:

```text
1. Receive request
2. Validate request
3. Normalize input
4. Generate features
5. Run performance model
6. Run risk model
7. Run cost model
8. Run time model
9. Run optimization model
10. Generate alerts
11. Calculate health score
12. Generate feature importance
13. Build Gemini context
14. Call Gemini
15. Validate Gemini response
16. Return unified response
```

---

# 26. API Endpoint Specification

### Health

```text
GET /api/v1/health
```

Response:

```json
{
  "status": "healthy",
  "version": "1.0.0"
}
```

### Performance

```text
POST /api/v1/predict/performance
```

### Risk

```text
POST /api/v1/predict/risk
```

### Cost

```text
POST /api/v1/forecast/cost
```

### Time

```text
POST /api/v1/forecast/time
```

### Optimization

```text
POST /api/v1/recommendation
```

### Complete Intelligence

```text
POST /api/v1/intelligence/analyze
```

### Model information

```text
GET /api/v1/models
```

### Model metrics

```text
GET /api/v1/models/metrics
```

---

# 27. Complete Response Contract

```json
{
  "request_id": "uuid",
  "model_version": "1.0.0",

  "input": {
    "temperature": 30.02,
    "humidity": 42.41,
    "vibration_level": 17.03,
    "worker_count": 48
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
    "predicted_deviation": 2450.8,
    "status": "Over Budget"
  },

  "time_forecast": {
    "predicted_deviation_days": 4.2,
    "status": "Delayed"
  },

  "optimization": {
    "recommendation": "Increase Machinery Efficiency",
    "confidence": 0.87
  },

  "alerts": [],

  "health": {
    "score": 74,
    "status": "Good"
  },

  "explainability": {
    "top_risk_factors": []
  },

  "gemini": {
    "status": "success",
    "report": {}
  }
}
```

---

# 28. Error Handling

Standard HTTP responses:

```text
400 → Invalid request
422 → Validation error
404 → Resource/model not found
429 → Gemini/API rate limit
500 → Internal server error
503 → Model/Gemini unavailable
```

Never expose Python stack traces to users.

---

# 29. Model Loading

Models should be loaded once during application startup.

Do not do this:

```text
Request
 ↓
Load model from disk
 ↓
Predict
 ↓
Unload model
```

Instead:

```text
Application Startup
 ↓
Load all models
 ↓
Keep in memory
 ↓
Requests
 ↓
Inference
```

This significantly reduces inference latency.

---

# 30. Model Registry

Each model should have metadata.

Example:

```json
{
  "name": "risk_model",
  "version": "1.0.0",
  "algorithm": "XGBRegressor",
  "target": "risk_score",
  "features": [],
  "metrics": {
    "mae": 5.31,
    "rmse": 7.12,
    "r2": 0.91
  }
}
```

---

# 31. Explainability Architecture

For supported tree models:

```text
Prediction
   ↓
SHAP Explainer
   ↓
Feature Contributions
   ↓
Top Factors
   ↓
Gemini Context
```

Example:

```json
{
  "feature": "vibration_level",
  "impact": 0.27,
  "direction": "increases_risk"
}
```

Gemini can translate this into natural language.

---

# 32. Logging

The backend must use structured logging.

Log:

```text
request_id
endpoint
timestamp
model_version
inference_time
gemini_latency
status
error_type
```

Do not log:

```text
GEMINI_API_KEY
personal secrets
authentication tokens
```

---

# 33. Performance Requirements

Target:

```text
ML inference:
< 1 second

API processing excluding Gemini:
< 2 seconds

Gemini:
target < 5 seconds

Complete request:
target < 8 seconds
```

These are engineering targets, not guarantees.

---

# 34. Concurrency

FastAPI should support asynchronous request handling.

Gemini network calls should not block unrelated requests.

For heavier model workloads, consider:

```text
async API
+
worker queue
```

in later versions.

---

# 35. Testing Architecture

Tests:

```text
tests/
├── unit/
│   ├── test_preprocessing.py
│   ├── test_performance.py
│   ├── test_risk.py
│   ├── test_cost.py
│   ├── test_time.py
│   ├── test_optimization.py
│   ├── test_alerts.py
│   └── test_health.py
│
├── integration/
│   ├── test_intelligence_api.py
│   └── test_gemini_service.py
│
└── fixtures/
```

---

# 36. ML Testing

Each model must have:

```text
Data loading test
Feature validation
Prediction shape test
Prediction range test
Model serialization test
Model loading test
```

Example:

```text
Risk score must remain approximately within expected domain.
```

Predictions should be checked for impossible outputs.

---

# 37. Gemini Testing

Gemini must be mocked during normal automated tests.

Tests should verify:

```text
Valid Gemini response
Malformed JSON
Missing fields
API timeout
Rate limit
Network failure
Unexpected response
```

The system should return ML results even if Gemini fails.

---

# 38. Docker Architecture

Recommended:

```text
Docker
   │
   ▼
ConArk FastAPI
   │
   ├── ML Models
   ├── Preprocessing
   ├── Alert Engine
   └── Gemini Service
```

Future:

```text
Docker Compose
├── conark-api
├── postgres
└── frontend
```

---

# 39. Environment Configuration

Example:

```text
APP_NAME=ConArk Systems
APP_VERSION=1.0.0
ENVIRONMENT=development

GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash

MODEL_PATH=./models

LOG_LEVEL=INFO

CORS_ORIGINS=
```

Production secrets must be injected by the deployment environment rather than committed to source control.

---

# 40. API Documentation

FastAPI must automatically provide:

```text
/docs
/redoc
/openapi.json
```

Every endpoint should contain:

* Description
* Request schema
* Response schema
* Error responses
* Example request
* Example response

---

# 41. Deployment Architecture

Initial:

```text
Frontend
   ↓
FastAPI
   ↓
ML Models
   ↓
Gemini API
```

Production-ready future:

```text
                    ┌─────────────┐
                    │  Frontend   │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │ API Gateway │
                    └──────┬──────┘
                           ↓
                    ┌─────────────┐
                    │   FastAPI   │
                    └──────┬──────┘
                           ↓
             ┌─────────────┼─────────────┐
             ↓             ↓             ↓
        ML Engine    Alert Engine   Gemini Service
             │             │             │
             └─────────────┼─────────────┘
                           ↓
                       Database
```

---

# 42. Security Architecture

Minimum requirements:

```text
HTTPS
Environment secrets
CORS
Request validation
Rate limiting
Structured error handling
Dependency updates
No secret logging
```

For future multi-user deployment:

```text
JWT authentication
Role-based access control
Project-level permissions
Audit logs
```

---

# 43. Model Retraining Pipeline

Future retraining workflow:

```text
New Data
   ↓
Validation
   ↓
Data Quality Check
   ↓
Feature Engineering
   ↓
Train
   ↓
Evaluate
   ↓
Compare Existing Model
   ↓
Approve
   ↓
Register New Version
   ↓
Deploy
```

A new model should not automatically replace a production model without evaluation.

---

# 44. Recommended ML Training Structure

Each model should have an independent pipeline:

```text
train.py
evaluate.py
predict.py
config.yaml
```

Example:

```text
ml/risk/
├── train.py
├── evaluate.py
├── predict.py
├── config.yaml
└── model/
```

This prevents the five models from becoming a single unmaintainable script.

---

# 45. Recommended Development Sequence

Do **not** start with Gemini or the frontend.

Build in this order:

```text
1. Dataset audit
        ↓
2. Data cleaning
        ↓
3. Leakage analysis
        ↓
4. Feature engineering
        ↓
5. Train five models
        ↓
6. Evaluate five models
        ↓
7. Save model artifacts
        ↓
8. Build inference classes
        ↓
9. Build alert engine
        ↓
10. Build health engine
        ↓
11. Build Gemini service
        ↓
12. Build unified intelligence API
        ↓
13. Write tests
        ↓
14. Build dashboard
        ↓
15. Dockerize
        ↓
16. Deploy
```

This order matters. Otherwise you end up debugging UI, FastAPI, ML, and Gemini simultaneously.

---

# 46. Final Technical Architecture

The finished ConArk system should look like this:

```text
                         CONARK SYSTEMS
                               │
                               ▼
                     ┌─────────────────┐
                     │ Construction    │
                     │ Data Input      │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Validation &    │
                     │ Normalization   │
                     └────────┬────────┘
                              │
                              ▼
                     ┌─────────────────┐
                     │ Feature         │
                     │ Engineering     │
                     └────────┬────────┘
                              │
          ┌───────────────────┼────────────────────┐
          │                   │                    │
          ▼                   ▼                    ▼
 ┌────────────────┐  ┌────────────────┐  ┌────────────────┐
 │ Performance    │  │ Risk           │  │ Cost           │
 │ Classifier     │  │ Regressor      │  │ Forecaster     │
 └────────────────┘  └────────────────┘  └────────────────┘
          │                   │                    │
          └───────────────────┼────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
             ┌──────────────┐   ┌──────────────┐
             │ Time         │   │ Optimization │
             │ Forecaster   │   │ Classifier   │
             └──────┬───────┘   └──────┬───────┘
                    │                  │
                    └────────┬─────────┘
                             ▼
                   ┌──────────────────┐
                   │ Intelligence     │
                   │ Engine            │
                   ├──────────────────┤
                   │ Safety Alerts    │
                   │ Material Alerts  │
                   │ Equipment Alerts │
                   │ Schedule Alerts  │
                   │ Health Score     │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Explainability   │
                   │ / SHAP           │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Gemini 2.5 Flash │
                   │ AI Reporting     │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ Structured JSON  │
                   │ Intelligence     │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ FastAPI REST API │
                   └────────┬─────────┘
                            │
                            ▼
                   ┌──────────────────┐
                   │ ConArk Dashboard │
                   └──────────────────┘
```

The most important architectural decision is to **keep Gemini downstream of the ML/decision pipeline**. Gemini should explain and organize what the system has actually computed, while the five ML models remain responsible for numerical and categorical predictions. That makes ConArk easier to test, more defensible technically, and much less vulnerable to an LLM hallucinating a construction risk or forecast.
