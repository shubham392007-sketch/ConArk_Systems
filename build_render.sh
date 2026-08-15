#!/usr/bin/env bash
# ==========================================
# Render Native Build Script for ConArk Systems
# ==========================================
set -o errexit

echo "==> [1/4] Installing Python Backend Dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "==> [2/4] Building Frontend React SPA..."
cd frontend
npm install
npm run build
cd ..

echo "==> [3/4] Pre-training ConArk Machine Learning Models..."
PYTHONPATH=src python -m conark.training.train_all

echo "==> [4/4] ConArk Systems Render Build Completed Successfully!"
