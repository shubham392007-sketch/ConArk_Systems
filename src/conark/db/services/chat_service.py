"""
AI chat conversation and message database service for ConArk Systems.
"""
from typing import List, Dict, Any, Optional
import json
from conark.db.client import get_db_cursor
from conark.utils.logging import get_logger

logger = get_logger("chat_service")

class ChatService:
    @staticmethod
    def list_conversations(user_id: str, limit: int = 50) -> List[Dict[str, Any]]:
        """Lists all conversations for user ordered by recent activity."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                SELECT c.*,
                       (SELECT COUNT(*) FROM public.ai_messages m WHERE m.conversation_id = c.id) as message_count,
                       (SELECT content FROM public.ai_messages m WHERE m.conversation_id = c.id ORDER BY m.created_at DESC LIMIT 1) as last_message
                FROM public.ai_conversations c
                WHERE c.user_id = %s
                ORDER BY c.updated_at DESC
                LIMIT %s
                """,
                (user_id, limit)
            )
            rows = cur.fetchall()
            return [dict(r) for r in rows]

    @staticmethod
    def get_conversation(conv_id: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single conversation with its message history."""
        with get_db_cursor() as cur:
            cur.execute(
                "SELECT * FROM public.ai_conversations WHERE id = %s AND user_id = %s",
                (conv_id, user_id)
            )
            conv = cur.fetchone()
            if not conv:
                return None

            cur.execute(
                "SELECT * FROM public.ai_messages WHERE conversation_id = %s ORDER BY created_at ASC",
                (conv_id,)
            )
            messages = cur.fetchall()

            conv_dict = dict(conv)
            conv_dict["messages"] = [dict(m) for m in messages]
            return conv_dict

    @staticmethod
    def create_conversation(user_id: str, title: str = "New Construction Chat", project_id: Optional[str] = None) -> Dict[str, Any]:
        """Creates a new conversation record."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO public.ai_conversations (user_id, project_id, title)
                VALUES (%s, %s, %s)
                RETURNING *
                """,
                (user_id, project_id, title)
            )
            row = cur.fetchone()
            conv = dict(row)
            conv["messages"] = []
            return conv

    @staticmethod
    def update_conversation_title(conv_id: str, user_id: str, title: str) -> Optional[Dict[str, Any]]:
        """Updates the conversation title."""
        with get_db_cursor() as cur:
            cur.execute(
                """
                UPDATE public.ai_conversations
                SET title = %s, updated_at = NOW()
                WHERE id = %s AND user_id = %s
                RETURNING *
                """,
                (title, conv_id, user_id)
            )
            row = cur.fetchone()
            return dict(row) if row else None

    @staticmethod
    def delete_conversation(conv_id: str, user_id: str) -> bool:
        """Deletes a conversation and all cascaded messages."""
        with get_db_cursor() as cur:
            cur.execute(
                "DELETE FROM public.ai_conversations WHERE id = %s AND user_id = %s",
                (conv_id, user_id)
            )
            return cur.rowcount > 0

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
        with get_db_cursor() as cur:
            cur.execute(
                """
                INSERT INTO public.ai_messages (conversation_id, user_id, role, content, model, metadata)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING *
                """,
                (conv_id, user_id, role, content, model, json.dumps(metadata) if metadata else None)
            )
            msg = cur.fetchone()

            # Touch conversation updated_at
            cur.execute(
                "UPDATE public.ai_conversations SET updated_at = NOW() WHERE id = %s",
                (conv_id,)
            )

            return dict(msg)
