"""
FastAPI Route for ConArk Construction Intelligence Assistant (OpenRouter GPT-OSS-120B).
Exposes /api/v1/construction-ai/chat (JSON) and /api/v1/construction-ai/chat/stream (SSE).
"""

import uuid
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

from conark.openrouter.service import OpenRouterService
from conark.api.dependencies import get_current_user, get_optional_user
from conark.db.services.chat_service import ChatService
from conark.utils.logging import get_logger

logger = get_logger("construction_ai_route")
router = APIRouter(prefix="/construction-ai", tags=["Construction AI Assistant"])

openrouter_service = OpenRouterService()


class ChatRequest(BaseModel):
    message: str = Field(..., description="User construction question or prompt", example="How can I reduce material wastage on a construction site?")
    conversation_id: Optional[str] = Field(default=None, description="Optional conversation ID for context continuity")
    history: Optional[List[Dict[str, Any]]] = Field(default=[], description="Prior conversation messages")
    project_context: Optional[Dict[str, Any]] = Field(default=None, description="Structured ConArk project telemetry or model context")

class ConversationCreateRequest(BaseModel):
    title: str = Field(default="New Construction Chat", max_length=150)
    project_id: Optional[str] = None

class ConversationUpdateRequest(BaseModel):
    title: str = Field(..., min_length=1, max_length=150)


class ChatResponse(BaseModel):
    success: bool
    message: str
    conversation_id: str
    model: str = "google/gemma-4-26b-a4b-it:free"
    error_code: Optional[str] = None


@router.get("/conversations")
async def list_conversations(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Lists saved conversations for the authenticated user."""
    convs = ChatService.list_conversations(current_user["id"])
    return {"conversations": convs}


@router.post("/conversations", status_code=status.HTTP_201_CREATED)
async def create_conversation(
    request: ConversationCreateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Creates a new conversation session for the authenticated user."""
    return ChatService.create_conversation(
        user_id=current_user["id"],
        title=request.title,
        project_id=request.project_id
    )


@router.get("/conversations/{conv_id}")
async def get_conversation_history(
    conv_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Retrieves full conversation details and chronological messages for the authenticated user."""
    conv = ChatService.get_conversation(conv_id, current_user["id"])
    if not conv:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or unauthorized."
        )
    return conv


@router.put("/conversations/{conv_id}")
async def rename_conversation(
    conv_id: str,
    request: ConversationUpdateRequest,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Renames an existing conversation."""
    updated = ChatService.update_conversation_title(conv_id, current_user["id"], request.title)
    if not updated:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or unauthorized."
        )
    return updated


@router.delete("/conversations/{conv_id}")
async def delete_conversation(
    conv_id: str,
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """Deletes a conversation and its messages."""
    success = ChatService.delete_conversation(conv_id, current_user["id"])
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found or unauthorized."
        )
    return {"message": "Conversation deleted successfully."}


@router.post("/chat", response_model=ChatResponse)
async def chat_construction_ai(
    payload: ChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Executes a construction intelligence query using OpenRouter (google/gemma-4-26b-a4b-it:free) with reasoning.
    Saves message and assistant response to Supabase when user is authenticated.
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    conv_id = payload.conversation_id or str(uuid.uuid4())
    logger.info(f"Processing Construction AI chat query for conv_id: {conv_id} (User: {current_user['id'] if current_user else 'Guest'})")

    res = await openrouter_service.generate_chat_response(
        message=payload.message,
        history=payload.history,
        project_context=payload.project_context
    )

    if current_user and current_user.get("id"):
        try:
            # Ensure conversation exists or create one with title from first prompt
            conv = ChatService.get_conversation(conv_id, current_user["id"])
            if not conv:
                title = payload.message[:40] + ("..." if len(payload.message) > 40 else "")
                conv = ChatService.create_conversation(current_user["id"], title=title)
                conv_id = conv["id"]

            ChatService.save_message(
                conv_id=conv_id,
                user_id=current_user["id"],
                role="user",
                content=payload.message
            )
            ChatService.save_message(
                conv_id=conv_id,
                user_id=current_user["id"],
                role="assistant",
                content=res["message"],
                model=res.get("model", "google/gemma-4-26b-a4b-it:free")
            )
        except Exception as save_err:
            logger.warning(f"Could not persist chat message to Supabase: {save_err}")

    return ChatResponse(
        success=res["success"],
        message=res["message"],
        conversation_id=conv_id,
        model=res.get("model", "google/gemma-4-26b-a4b-it:free"),
        error_code=res.get("error_code")
    )


@router.post("/chat/stream")
async def stream_construction_ai(
    payload: ChatRequest,
    current_user: Optional[Dict[str, Any]] = Depends(get_optional_user)
):
    """
    Streams construction intelligence response via Server-Sent Events (SSE).
    """
    if not payload.message.strip():
        raise HTTPException(status_code=400, detail="Message content cannot be empty.")

    conv_id = payload.conversation_id or str(uuid.uuid4())
    logger.info(f"Streaming Construction AI query for conv_id: {conv_id} (User: {current_user['id'] if current_user else 'Guest'})")

    async def stream_wrapper():
        full_assistant_reply = []
        async for chunk in openrouter_service.stream_chat_response(
            message=payload.message,
            history=payload.history,
            project_context=payload.project_context
        ):
            yield chunk
            # Check for chunk content
            if chunk.startswith("data: ") and not chunk.startswith("data: [DONE]"):
                try:
                    import json
                    d = json.loads(chunk[6:].strip())
                    if d.get("chunk"):
                        full_assistant_reply.append(d["chunk"])
                except Exception:
                    pass

        # Persist after streaming completes
        if current_user and current_user.get("id") and full_assistant_reply:
            try:
                complete_text = "".join(full_assistant_reply)
                conv = ChatService.get_conversation(conv_id, current_user["id"])
                actual_conv_id = conv_id
                if not conv:
                    title = payload.message[:40] + ("..." if len(payload.message) > 40 else "")
                    new_conv = ChatService.create_conversation(current_user["id"], title=title)
                    actual_conv_id = new_conv["id"]

                ChatService.save_message(
                    conv_id=actual_conv_id,
                    user_id=current_user["id"],
                    role="user",
                    content=payload.message
                )
                ChatService.save_message(
                    conv_id=actual_conv_id,
                    user_id=current_user["id"],
                    role="assistant",
                    content=complete_text,
                    model="google/gemma-4-26b-a4b-it:free"
                )
            except Exception as save_err:
                logger.warning(f"Could not persist streamed messages to Supabase: {save_err}")

    return StreamingResponse(
        stream_wrapper(),
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
