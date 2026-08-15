FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and scripts
COPY . .

# Set PYTHONPATH
ENV PYTHONPATH=/app/src

# Expose port
EXPOSE 8000

# Run master training pipeline then start FastAPI
CMD ["sh", "-c", "python -m conark.training.train_all && uvicorn conark.api.main:app --host 0.0.0.0 --port 8000"]
