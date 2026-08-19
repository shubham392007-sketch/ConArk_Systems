"""
FastAPI Route for ConArk Construction Intelligence Assistant (OpenRouter GPT-OSS-120B).
Exposes /api/v1/construction-ai/chat (JSON) and /api/v1/construction-ai/chat/stream (SSE).
"""

import uuid
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from conark.openrouter.service import OpenRouterService
from conark.utils.logging import get_logger

logger = get_logger("construction_ai_route")
router = APIRouter(prefix="/construction-ai", tags=["Construction AI Assistant"])

openrouter_service = OpenRouterService()


class ChatRequest(BaseModel):
    message: str = Field(..., description="User construction question or prompt", example="How can I reduce material wastage on a construction site?")
    conversation_id: Optional[str] = Field(default=None, description="Optional conversation ID for context continuity")
    history: Optional[List[Dict[str, str]]] = Field(default=[], description="Prior conversation messages")
    project_context: Optional[Dict[str, Any]] = Field(default=None, description="Structured ConArk project telemetry or model context")


class ChatResponse(BaseModel):
    success: bool
    message: str
    conversation_id: str
    model: str = "google/gemma-4-26b-a4b-it:free"
    error_code: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
async def chat_construction_ai(payload: ChatRequest):
    """
    Executes a construction intelligence query using OpenRouter (openai/gpt-oss-120b:free).
    Key remains 100% server-side and never exposed to the client.
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    conv_id = payload.conversation_id or str(uuid.uuid4())
    logger.info(f"Processing Construction AI chat query for conv_id: {conv_id}")

    res = await openrouter_service.generate_chat_response(
        message=payload.message,
        history=payload.history,
        project_context=payload.project_context
    )

    return ChatResponse(
        success=res["success"],
        message=res["message"],
        conversation_id=conv_id,
        model=res.get("model", "openai/gpt-oss-120b:free"),
        error_code=res.get("error_code")
    )


@router.post("/chat/stream")
async def stream_construction_ai(payload: ChatRequest):
    """
    Streams construction intelligence response via Server-Sent Events (SSE).
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    conv_id = payload.conversation_id or str(uuid.uuid4())
    logger.info(f"Streaming Construction AI query for conv_id: {conv_id}")

    return StreamingResponse(
        openrouter_service.stream_chat_response(
            message=payload.message,
            history=payload.history,
            project_context=payload.project_context
        ),
        media_type="text/event-stream"
    )


from fastapi import File, UploadFile
from conark.gemini.stt_service import GeminiSTTService

stt_service = GeminiSTTService()


class STTBase64Request(BaseModel):
    audio_b64: str = Field(..., description="Base64 encoded audio string")
    mime_type: Optional[str] = Field(default="audio/webm", description="MIME type of the audio stream")


@router.post("/stt")
async def transcribe_audio(
    file: Optional[UploadFile] = File(default=None),
    payload: Optional[STTBase64Request] = None
):
    """
    Transcribes spoken construction voice audio into text using Gemini API with GEMINI_API_KEY_OPTIMIZATION.
    Supports either file upload or JSON base64 payload.
    """
    audio_bytes = b""
    mime_type = "audio/webm"

    if file:
        audio_bytes = await file.read()
        mime_type = file.content_type or "audio/webm"
    elif payload and payload.audio_b64:
        import base64
        audio_bytes = base64.b64decode(payload.audio_b64)
        mime_type = payload.mime_type or "audio/webm"
    else:
        raise HTTPException(status_code=400, detail="Either audio file or audio_b64 payload must be provided.")

    res = await stt_service.transcribe_audio_bytes(audio_bytes, mime_type)
    if not res["success"]:
        raise HTTPException(status_code=500, detail=res.get("error", "Failed to transcribe audio via Gemini API."))

    return {
        "success": True,
        "transcript": res["transcript"],
        "model": res.get("model", "gemini-flash-latest")
    }
