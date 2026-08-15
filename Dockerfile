# ==========================================
# STAGE 1: Build Frontend React Application
# ==========================================
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# STAGE 2: Python FastAPI Backend Service
# ==========================================
FROM python:3.11-slim
WORKDIR /app

# Install system build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy python dependencies & install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code
COPY . .

# Copy built frontend dist from Stage 1
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Set PYTHONPATH environment variable
ENV PYTHONPATH=/app/src

# Pre-train ML models during image build
RUN python -m conark.training.train_all

# Default PORT environment variable assigned by Render
ENV PORT=8000
EXPOSE ${PORT}

# Start FastAPI application with dynamic $PORT binding
CMD ["sh", "-c", "uvicorn conark.api.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
