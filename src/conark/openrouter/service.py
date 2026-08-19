"""
OpenRouter API Service for ConArk Systems Construction AI Assistant.
Integrates with OpenRouter (openai/gpt-oss-120b:free).
"""

import os
import json
import logging
from typing import AsyncGenerator, Dict, Any, List, Optional
import httpx

from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("openrouter_service")

SYSTEM_PROMPT = """You are ConArk AI, a construction intelligence assistant.

Your purpose is to help users understand construction engineering, project management, construction safety, materials, scheduling, cost management, resource management, site operations, construction technology, optimization, and related topics.

Answer clearly and practically.

Prefer concise explanations first, followed by deeper detail when useful.

Use structured formatting.

When explaining technical concepts:

1. Give a simple explanation.
2. Explain the technical concept.
3. Give a practical construction example.
4. Mention important limitations or assumptions.

Never invent project measurements, regulations, standards, calculations, site conditions, or engineering data.

If the user provides project-specific information, distinguish between:

USER-PROVIDED DATA

and

GENERAL KNOWLEDGE.

If information is insufficient, explicitly say what is missing.

For safety-critical questions, do not present generic AI advice as a substitute for qualified engineering judgment, site-specific risk assessment, applicable regulations, manufacturer instructions, or competent professionals.

For structural, electrical, geotechnical, fire-safety, lifting, scaffolding, demolition, or other high-risk engineering questions, clearly state when professional verification is required.

Do not claim to have inspected a construction site.

Do not claim to have access to live project data unless the application explicitly provides it.

Do not fabricate standards, codes, laws, citations, calculations, or measurements.

If the user asks a question outside construction, answer briefly if it is harmless, then redirect toward construction-related assistance.

Maintain the ConArk tone:

technical
clear
practical
direct
professional

Avoid unnecessary jargon.

When technical terminology is necessary, explain it."""


class OpenRouterService:
    FALLBACK_MODELS = [
        "google/gemma-4-26b-a4b-it:free",
        "openai/gpt-4o-mini",
        "openrouter/auto"
    ]

    def __init__(
        self,
        api_key: Optional[str] = None,
        model: Optional[str] = None,
        base_url: Optional[str] = None
    ):
        self.api_key = api_key or settings.OPENROUTER_API_KEY or os.getenv("OPENROUTER_API_KEY", "")
        self.primary_model = model or settings.OPENROUTER_MODEL or "google/gemma-4-26b-a4b-it:free"
        self.base_url = (base_url or settings.OPENROUTER_BASE_URL or "https://openrouter.ai/api/v1").rstrip("/")

    def _get_headers(self) -> Dict[str, str]:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://conark-systems.com",
            "X-Title": "ConArk Systems Construction AI"
        }

    def format_messages(
        self,
        user_message: str,
        history: Optional[List[Dict[str, str]]] = None,
        project_context: Optional[Dict[str, Any]] = None
    ) -> List[Dict[str, str]]:
        """Constructs bounded message history for OpenRouter API."""
        formatted: List[Dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Inject user project context if available
        if project_context and isinstance(project_context, dict) and len(project_context) > 0:
            context_lines = ["USER-PROVIDED PROJECT DATA:"]
            for k, v in project_context.items():
                clean_key = k.replace("_", " ").title()
                context_lines.append(f"- {clean_key}: {v}")
            context_str = "\n".join(context_lines)
            formatted.append({"role": "system", "content": context_str})

        # Add recent conversation history (capped to last 8 messages)
        if history:
            valid_history = history[-8:]
            for msg in valid_history:
                role = msg.get("role")
                content = msg.get("content", "").strip()
                if role in ["user", "assistant"] and content:
                    formatted.append({"role": role, "content": content})

        # Append current user prompt if not already last in history
        if not history or history[-1].get("content") != user_message:
            formatted.append({"role": "user", "content": user_message})

        return formatted

    async def generate_chat_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        project_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Non-streaming request to OpenRouter API with automatic model fallback."""
        if not self.api_key:
            logger.warning("OpenRouter API key missing.")
            return {
                "success": False,
                "error_code": "KEY_MISSING",
                "message": "ConArk AI service is not configured with an OpenRouter API key.",
                "model": self.primary_model
            }

        messages = self.format_messages(message, history, project_context)
        models_to_try = [self.primary_model] + [m for m in self.FALLBACK_MODELS if m != self.primary_model]

        url = f"{self.base_url}/chat/completions"
        async with httpx.AsyncClient(timeout=45.0) as client:
            for target_model in models_to_try:
                payload = {
                    "model": target_model,
                    "messages": messages,
                    "temperature": 0.3,
                    "max_tokens": 2048
                }
                try:
                    response = await client.post(url, headers=self._get_headers(), json=payload)
                    if response.status_code == 200:
                        data = response.json()
                        content = data["choices"][0]["message"]["content"]
                        return {
                            "success": True,
                            "message": content,
                            "model": target_model
                        }
                    elif response.status_code == 429:
                        logger.warning(f"OpenRouter 429 Rate Limit on model {target_model}")
                        continue
                    else:
                        logger.warning(f"OpenRouter {response.status_code} on model {target_model}: {response.text}")
                        continue
                except Exception as e:
                    logger.warning(f"OpenRouter exception on {target_model}: {e}")
                    continue

        return {
            "success": False,
            "error_code": "ALL_MODELS_FAILED",
            "message": "Unable to reach the intelligence service right now. Please try again in a moment.",
            "model": self.primary_model
        }

    async def stream_chat_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        project_context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """Streaming Server-Sent Events generator for OpenRouter API with fallback."""
        if not self.api_key:
            err_json = json.dumps({
                "error": True,
                "message": "ConArk AI service is not configured with an OpenRouter API key.",
                "done": True
            })
            yield f"data: {err_json}\n\n"
            return

        messages = self.format_messages(message, history, project_context)
        models_to_try = [self.primary_model] + [m for m in self.FALLBACK_MODELS if m != self.primary_model]
        url = f"{self.base_url}/chat/completions"

        async with httpx.AsyncClient(timeout=60.0) as client:
            for target_model in models_to_try:
                payload = {
                    "model": target_model,
                    "messages": messages,
                    "temperature": 0.3,
                    "max_tokens": 2048,
                    "stream": True
                }
                try:
                    async with client.stream("POST", url, headers=self._get_headers(), json=payload) as response:
                        if response.status_code != 200:
                            logger.warning(f"Streaming failed on {target_model} with status {response.status_code}")
                            continue

                        got_data = False
                        async for line in response.aiter_lines():
                            if not line:
                                continue
                            if line.startswith("data: "):
                                data_str = line[6:].strip()
                                if data_str == "[DONE]":
                                    done_json = json.dumps({"done": True})
                                    yield f"data: {done_json}\n\n"
                                    return
                                try:
                                    chunk_obj = json.loads(data_str)
                                    choices = chunk_obj.get("choices", [])
                                    if choices:
                                        delta = choices[0].get("delta", {})
                                        delta_content = delta.get("content", "")
                                        if delta_content:
                                            got_data = True
                                            out_json = json.dumps({"chunk": delta_content, "done": False})
                                            yield f"data: {out_json}\n\n"
                                except Exception:
                                    continue

                        if got_data:
                            return
                except Exception as e:
                    logger.warning(f"Streaming exception on model {target_model}: {e}")
                    continue

        err_json = json.dumps({
            "error": True,
            "message": "Unable to reach the intelligence service right now. Please try again in a moment.",
            "done": True
        })
        yield f"data: {err_json}\n\n"
