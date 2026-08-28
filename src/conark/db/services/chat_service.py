"""
AI chat conversation and message database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
import json
from conark.db.client import get_db_cursor
from conark.db.services.project_service import ProjectService
from conark.utils.logging import get_logger

logger = get_logger("chat_service")

class ChatService:
    @staticmethod
    def list_conversations(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Lists all conversations for user ordered by recent activity."""
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    """
                    SELECT c.*,
                           (SELECT COUNT(*) FROM public.ai_messages m WHERE m.conversation_id = c.id) as message_count,
                           (SELECT content FROM public.ai_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message
                    FROM public.ai_conversations c
                    WHERE c.user_id::text = %s
                    ORDER BY c.updated_at DESC
                    LIMIT %s
                    """,
                    (u_id_str, limit)
                )
                rows = cur.fetchall()
                return [dict(r) for r in rows]
        except Exception as err:
            logger.error(f"ChatService.list_conversations error: {err}")
            return []

    @staticmethod
    def get_conversation(conv_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single conversation with its message history."""
        c_id_str = str(conv_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    "SELECT * FROM public.ai_conversations WHERE id::text = %s AND user_id::text = %s",
                    (c_id_str, u_id_str)
                )
                conv = cur.fetchone()
                if not conv:
                    return None

                cur.execute(
                    "SELECT * FROM public.ai_messages WHERE conversation_id::text = %s ORDER BY created_at ASC",
                    (c_id_str,)
                )
                messages = cur.fetchall()

                conv_dict = dict(conv)
                conv_dict["messages"] = [dict(m) for m in messages]
                return conv_dict
        except Exception as err:
            logger.error(f"ChatService.get_conversation error: {err}")
            return None

    @staticmethod
    def create_conversation(user_id: str, title: str = "New Construction Chat", project_id: Optional[str] = None) -> Dict[str, Any]:
        """Creates a new conversation record."""
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                ProjectService.ensure_user_profile_exists(cur, u_id_str)
                cur.execute(
                    """
                    INSERT INTO public.ai_conversations (user_id, project_id, title)
                    VALUES (%s, %s, %s)
                    RETURNING *
                    """,
                    (u_id_str, project_id, title)
                )
                row = cur.fetchone()
                conv = dict(row) if row else {}
                conv["messages"] = []
                return conv
        except Exception as err:
            logger.error(f"ChatService.create_conversation error: {err}")
            return {"user_id": u_id_str, "title": title, "messages": []}

    @staticmethod
    def update_conversation_title(conv_id: str, user_id: str, title: str) -> Optional[Dict[str, Any]]:
        """Updates the conversation title."""
        c_id_str = str(conv_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    """
                    UPDATE public.ai_conversations
                    SET title = %s, updated_at = NOW()
                    WHERE id::text = %s AND user_id::text = %s
                    RETURNING *
                    """,
                    (title, c_id_str, u_id_str)
                )
                row = cur.fetchone()
                return dict(row) if row else None
        except Exception as err:
            logger.error(f"ChatService.update_conversation_title error: {err}")
            return None

    @staticmethod
    def delete_conversation(conv_id: str, user_id: str) -> bool:
        """Deletes a conversation and all cascaded messages."""
        c_id_str = str(conv_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                cur.execute(
                    "DELETE FROM public.ai_conversations WHERE id::text = %s AND user_id::text = %s",
                    (c_id_str, u_id_str)
                )
                return cur.rowcount > 0
        except Exception as err:
            logger.error(f"ChatService.delete_conversation error: {err}")
            return False

    @staticmethod
    def save_message(
        conv_id: str,
        user_id: str,
        role: str,
        content: str,
        model: str = "google/gemma-4-26b-a4b-it:free",
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Saves a message and touches updated_at on the conversation."""
        c_id_str = str(conv_id).strip()
        u_id_str = str(user_id).strip()
        try:
            with get_db_cursor() as cur:
                ProjectService.ensure_user_profile_exists(cur, u_id_str)
                cur.execute(
                    """
                    INSERT INTO public.ai_messages (conversation_id, user_id, role, content, model, metadata)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING *
                    """,
                    (c_id_str, u_id_str, role, content, model, json.dumps(metadata) if metadata else None)
                )
                msg = cur.fetchone()

                # Touch conversation updated_at
                cur.execute(
                    "UPDATE public.ai_conversations SET updated_at = NOW() WHERE id::text = %s",
                    (c_id_str,)
                )

                return dict(msg) if msg else {}
        except Exception as err:
            logger.error(f"ChatService.save_message error: {err}")
            return {"conversation_id": c_id_str, "user_id": u_id_str, "role": role, "content": content}

