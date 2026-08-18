"""
Test suite for ConArk Construction AI Assistant OpenRouter integration.
"""

import pytest
from fastapi.testclient import TestClient
from conark.api.main import app

client = TestClient(app)


def test_construction_ai_chat_endpoint():
    payload = {
        "message": "What are the key factors for construction safety?",
        "history": [],
        "project_context": {"risk_score": 75.0}
    }
    response = client.post("/api/v1/construction-ai/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "success" in data
    assert "message" in data
    assert "conversation_id" in data
    assert data["model"] == "openai/gpt-oss-120b:free"
