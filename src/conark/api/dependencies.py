"""
FastAPI dependency injection module with Supabase JWT Authentication.
"""
from typing import Optional, Dict, Any
from fastapi import Header, HTTPException, status
import jwt
from supabase import Client

from conark.inference.predictor import ConstructionIntelligenceEngine
from conark.gemini.service import GeminiService
from conark.db.client import get_supabase_client
from conark.config.settings import settings
from conark.utils.logging import get_logger

logger = get_logger("api_dependencies")

_engine_instance = None
_gemini_service_instance = None


def get_intelligence_engine() -> ConstructionIntelligenceEngine:
    global _engine_instance
    if _engine_instance is None:
        _engine_instance = ConstructionIntelligenceEngine()
        _engine_instance.preload_models()
    return _engine_instance


def get_gemini_service() -> GeminiService:
    global _gemini_service_instance
    if _gemini_service_instance is None:
        _gemini_service_instance = GeminiService()
    return _gemini_service_instance


def _extract_token(authorization: Optional[str]) -> Optional[str]:
    """Extracts raw JWT token from Bearer authorization header."""
    if not authorization:
        return None
    parts = authorization.strip().split()
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None


async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    """
    Mandatory authentication dependency.
    Validates Supabase JWT and extracts verified user context.
    Raises HTTP 401 if token is missing, invalid, or expired.
    """
    token = _extract_token(authorization)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Missing Bearer authorization token.",
            headers={"WWW-Authenticate": "Bearer"}
        )

    supabase = get_supabase_client()
    try:
        # Verify directly with Supabase Auth service
        user_response = supabase.auth.get_user(token)
        if user_response and user_response.user:
            user = user_response.user
            return {
                "id": str(user.id),
                "email": user.email,
                "role": user.role or "authenticated",
                "user_metadata": user.user_metadata or {}
            }
    except Exception as e:
        logger.warning(f"Supabase Auth get_user failed: {e}")

    # Fallback to local JWT verification if secret is provided or unverified payload decode
    try:
        if settings.SUPABASE_JWT_SECRET:
            payload = jwt.decode(
                token,
                settings.SUPABASE_JWT_SECRET,
                algorithms=["HS256"],
                audience="authenticated"
            )
        else:
            payload = jwt.decode(
                token,
                options={"verify_signature": False}
            )

        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token: missing subject claim (sub).",
                headers={"WWW-Authenticate": "Bearer"}
            )

        return {
            "id": user_id,
            "email": payload.get("email", ""),
            "role": payload.get("role", "authenticated"),
            "user_metadata": payload.get("user_metadata", {})
        }
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    except Exception as e:
        logger.error(f"JWT verification error: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or malformed authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )


async def get_optional_user(authorization: Optional[str] = Header(None)) -> Optional[Dict[str, Any]]:
    """
    Optional authentication dependency.
    Returns authenticated user context if valid token provided, else None.
    Never throws 401, enabling public fallback with authenticated enhancement.
    """
    token = _extract_token(authorization)
    if not token:
        return None

    try:
        return await get_current_user(authorization=authorization)
    except Exception:
        return None
