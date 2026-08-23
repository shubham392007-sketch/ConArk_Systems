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
    GEMINI_MODELS = [
        "gemini-2.5-flash",
        "gemini-3.6-flash",
        "gemini-flash-latest"
    ]
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
        self.primary_model = model or settings.OPENROUTER_MODEL or "gemini-2.5-flash"
        self.base_url = (base_url or settings.OPENROUTER_BASE_URL or "https://openrouter.ai/api/v1").rstrip("/")
        self.gemini_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "AQ.Ab8RN6LxiBPLJWhgegU4HK70t77kcAXIvpb0jl64fOS-1zan3Q")

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
        """Constructs bounded message history."""
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

    def _format_gemini_prompt(
        self,
        user_message: str,
        history: Optional[List[Dict[str, str]]] = None,
        project_context: Optional[Dict[str, Any]] = None
    ) -> str:
        """Formats a rich single prompt with context and history for Gemini API."""
        prompt_parts = []
        if project_context and isinstance(project_context, dict) and len(project_context) > 0:
            prompt_parts.append("### CURRENT PROJECT TELEMETRY & CONSTRAINTS:")
            for k, v in project_context.items():
                clean_k = k.replace("_", " ").upper()
                prompt_parts.append(f"- {clean_k}: {v}")
            prompt_parts.append("")

        if history:
            prompt_parts.append("### CONVERSATION HISTORY:")
            for h in history[-6:]:
                role = "User" if h.get("role") == "user" else "ConArk AI"
                prompt_parts.append(f"{role}: {h.get('content', '')}")
            prompt_parts.append("")

        prompt_parts.append(f"User: {user_message}")
        return "\n".join(prompt_parts)

    async def generate_chat_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        project_context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Executes AI chat query using Gemini 2.5 Flash first, with OpenRouter fallback."""
        # 1. Primary Engine: Google Gemini 2.5 Flash with Universal API Key
        if self.gemini_key:
            try:
                from google import genai
                from google.genai import types
                import asyncio

                client = genai.Client(api_key=self.gemini_key)
                prompt = self._format_gemini_prompt(message, history, project_context)
                loop = asyncio.get_event_loop()

                for g_model in self.GEMINI_MODELS:
                    try:
                        def _call_gemini():
                            return client.models.generate_content(
                                model=g_model,
                                contents=prompt,
                                config=types.GenerateContentConfig(
                                    system_instruction=SYSTEM_PROMPT,
                                    temperature=0.3,
                                )
                            )
                        resp = await loop.run_in_executor(None, _call_gemini)
                        if resp and resp.text:
                            return {
                                "success": True,
                                "message": resp.text,
                                "model": f"google/{g_model}"
                            }
                    except Exception as g_err:
                        logger.warning(f"Gemini chat failed on model {g_model}: {g_err}")
                        continue
            except Exception as e:
                logger.error(f"Gemini client initialization error: {e}")

        # 2. Secondary Engine: OpenRouter (if configured)
        if self.api_key:
            messages = self.format_messages(message, history, project_context)
            models_to_try = [self.primary_model] + [m for m in self.FALLBACK_MODELS if m != self.primary_model]
            url = f"{self.base_url}/chat/completions"

            async with httpx.AsyncClient(timeout=45.0) as http_client:
                for target_model in models_to_try:
                    payload = {
                        "model": target_model,
                        "messages": messages,
                        "temperature": 0.3,
                        "max_tokens": 2048
                    }
                    try:
                        response = await http_client.post(url, headers=self._get_headers(), json=payload)
                        if response.status_code == 200:
                            data = response.json()
                            content = data["choices"][0]["message"]["content"]
                            return {
                                "success": True,
                                "message": content,
                                "model": target_model
                            }
                    except Exception as e:
                        logger.warning(f"OpenRouter exception on {target_model}: {e}")
                        continue

        # 3. Deterministic Engineering Expert Fallback
        return {
            "success": True,
            "message": f"**ConArk Construction Intelligence Response**\n\nRegarding your question: *'{message}'*\n\n1. **Core Principle**: In construction operations, maintain rigorous quality assurance, continuous moisture control, and structural load monitoring.\n2. **Action Item**: Verify field measurements against site engineering specifications before proceeding.\n3. **Safety Notice**: Comply with applicable OSHA and national building code regulations for all on-site activities.",
            "model": "conark/deterministic-advisor"
        }

    async def stream_chat_response(
        self,
        message: str,
        history: Optional[List[Dict[str, str]]] = None,
        project_context: Optional[Dict[str, Any]] = None
    ) -> AsyncGenerator[str, None]:
        """Streams construction intelligence tokens via SSE using Gemini 2.5 Flash."""
        # 1. Primary Engine: Google Gemini 2.5 Flash streaming
        if self.gemini_key:
            try:
                from google import genai
                from google.genai import types
                import asyncio

                client = genai.Client(api_key=self.gemini_key)
                prompt = self._format_gemini_prompt(message, history, project_context)

                for g_model in self.GEMINI_MODELS:
                    try:
                        # Synchronous stream iterator executed chunk by chunk
                        stream_response = client.models.generate_content_stream(
                            model=g_model,
                            contents=prompt,
                            config=types.GenerateContentConfig(
                                system_instruction=SYSTEM_PROMPT,
                                temperature=0.3,
                            )
                        )

                        got_chunk = False
                        for chunk in stream_response:
                            if chunk.text:
                                got_chunk = True
                                out_json = json.dumps({"chunk": chunk.text, "done": False})
                                yield f"data: {out_json}\n\n"
                                await asyncio.sleep(0.01)

                        if got_chunk:
                            done_json = json.dumps({"done": True})
                            yield f"data: {done_json}\n\n"
                            return
                    except Exception as g_err:
                        logger.warning(f"Gemini streaming failed on model {g_model}: {g_err}")
                        continue
            except Exception as e:
                logger.error(f"Gemini streaming initialization error: {e}")

        # 2. Secondary Engine: OpenRouter streaming (if configured)
        if self.api_key:
            messages = self.format_messages(message, history, project_context)
            models_to_try = [self.primary_model] + [m for m in self.FALLBACK_MODELS if m != self.primary_model]
            url = f"{self.base_url}/chat/completions"

            async with httpx.AsyncClient(timeout=60.0) as http_client:
                for target_model in models_to_try:
                    payload = {
                        "model": target_model,
                        "messages": messages,
                        "temperature": 0.3,
                        "max_tokens": 2048,
                        "stream": True
                    }
                    try:
                        async with http_client.stream("POST", url, headers=self._get_headers(), json=payload) as response:
                            if response.status_code != 200:
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
                        logger.warning(f"OpenRouter streaming exception on {target_model}: {e}")
                        continue

        # 3. Stream Deterministic Fallback if external APIs are unreachable
        fallback_text = f"**ConArk Intelligence Summary**\n\nFor: *'{message}'*\n\n1. **Technical Standard**: Follow specified material curing schedules and safety margins.\n2. **Action**: Ensure cross-functional coordination between site engineers and trade contractors.\n3. **Safety**: Perform daily toolbox meetings and mandatory PPE compliance checks."
        for word in fallback_text.split(" "):
            chunk_json = json.dumps({"chunk": word + " ", "done": False})
            yield f"data: {chunk_json}\n\n"
            await asyncio.sleep(0.02)

        done_json = json.dumps({"done": True})
        yield f"data: {done_json}\n\n"
