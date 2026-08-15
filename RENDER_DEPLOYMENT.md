# 🚀 CONARK SYSTEMS — INDEPENDENT UVICORN & RENDER DEPLOYMENT GUIDE

This project runs **completely independently** using standard Python and `uvicorn` commands—**zero Docker required**.

---

## ⚡ 1. Render Deployment (Native Python Web Service)

Render automatically builds your React frontend and runs your Python FastAPI backend via `uvicorn`.

### Web Service Settings on Render:
- **Environment:** `Python 3`
- **Build Command:** `./build_render.sh`
- **Start Command:** `PYTHONPATH=src uvicorn conark.api.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/api/v1/health`

### Environment Variables to set on Render:
| Variable Name | Value / Notes |
| ------------- | ------------- |
| `GEMINI_API_KEY` | `AQ.Ab8RN6JFFQ5ouLZZkaqw8uJFfJoWa2p8GI24mV_bOGm_UbqYCg` |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `PYTHONPATH` | `src` |
| `APP_ENV` | `production` |

---

## 💻 2. Independent Local Execution (No Docker)

You can run the backend and frontend independently on any local machine or server using pure Python + Uvicorn.

### Step 1: Install Dependencies
```bash
pip install -r requirements.txt
```

### Step 2: Run Machine Learning Models & Backend Server
```bash
# Train ML models & start uvicorn server
PYTHONPATH=src python -m conark.training.train_all
PYTHONPATH=src uvicorn conark.api.main:app --host 0.0.0.0 --port 8000
```
*(Note: If model artifacts are ever missing, FastAPI automatically auto-trains missing models on demand during startup!)*

### Step 3: Run Frontend React App (Optional for dev)
```bash
cd frontend
npm install
npm run dev
```

In production, running `npm run build` inside `frontend/` creates `frontend/dist`. FastAPI automatically detects `frontend/dist` and serves the entire SPA frontend on `http://localhost:8000` directly!
