# 🚀 CONARK SYSTEMS — RENDER DEPLOYMENT GUIDE

This guide provides step-by-step instructions to deploy **ConArk Systems** to [Render](https://render.com) as a unified full-stack application (FastAPI + React SPA + 5 ML Models + SciPy Space Engine + Gemini 2.5 Flash).

---

## ⚡ Option 1: Render Docker Deployment (RECOMMENDED & EASIEST)

Render will automatically build both the React frontend and Python FastAPI backend into a single container image using the multi-stage `Dockerfile`.

### Steps:
1. **Push your latest code to GitHub** (already synchronized on branch `main`).
2. Log in to [Render Dashboard](https://dashboard.render.com).
3. Click **New +** $\rightarrow$ **Web Service**.
4. Connect your GitHub repository `shubham392007-sketch/ConArk_Systems`.
5. Select **Docker** as the Environment.
6. Render will automatically detect the root `Dockerfile` and `render.yaml`.
7. Add your Environment Variable:
   - `GEMINI_API_KEY`: `AQ.Ab8RN6JFFQ5ouLZZkaqw8uJFfJoWa2p8GI24mV_bOGm_UbqYCg` (or your preferred key).
8. Click **Create Web Service**.

---

## 🐍 Option 2: Render Native Python Web Service Deployment

If you prefer deploying without Docker using Render's native Python runtime:

### Web Service Settings:
- **Environment:** `Python 3`
- **Build Command:** `./build_render.sh`
- **Start Command:** `PYTHONPATH=src uvicorn conark.api.main:app --host 0.0.0.0 --port $PORT`
- **Health Check Path:** `/api/v1/health`

### Required Environment Variables on Render:
| Variable Name | Value / Notes |
| ------------- | ------------- |
| `GEMINI_API_KEY` | `AQ.Ab8RN6JFFQ5ouLZZkaqw8uJFfJoWa2p8GI24mV_bOGm_UbqYCg` |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `PYTHONPATH` | `src` |
| `APP_ENV` | `production` |

---

## ✅ Deployment Features Pre-Configured for Render

1. **Dynamic `$PORT` Binding:** Automatically binds to Render's allocated port (`$PORT` or default `8000`).
2. **Single Origin SPA Routing:** FastAPI automatically mounts `frontend/dist` and handles single-page application routes (`/`, `/brains`, `/predictions`, `/model/*`).
3. **Pre-trained ML Models:** All 5 ML models train during build so startup is instant and memory-efficient.
4. **Health Check:** Provides `/api/v1/health` endpoint for zero-downtime health monitoring.
5. **Robust AI Fallback:** Deterministic report generator runs automatically if Gemini API rate limits are hit or key is unconfigured.
