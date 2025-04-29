from app.config import settings
from fastapi import HTTPException, Request
from itsdangerous import URLSafeTimedSerializer

SECRET_KEY = f"csrf_{settings.JWT_SECRET}"
CSRF_TOKEN_EXPIRATION = 1800

serializer = URLSafeTimedSerializer(SECRET_KEY)

def generate_csrf_token(session_id: str) -> str:
    """Generates CSRF-token based on the identifier of the session."""
    return serializer.dumps(session_id)

def validate_csrf_token(token: str, session_id: str) -> None:
    """Checks CSRF token."""
    try:
        decoded_session_id = serializer.loads(token, max_age=CSRF_TOKEN_EXPIRATION)
        if decoded_session_id != session_id:
            raise HTTPException(status_code=403, detail="Invalid CSRF token")
    except Exception:
        raise HTTPException(status_code=403, detail="Invalid or expired CSRF token")