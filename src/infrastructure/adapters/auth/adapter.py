from src.domain.ports.auth import AuthPort
import secrets
from datetime import datetime
from src.domain.entities.user import User


class AuthAdapter(AuthPort):
    async def is_authenticated(self) -> bool:
        ...

    async def sign_up(self):
        ...

    async def login(self):
        ...

    async def refresh(self):
        ...

    def _create_new_token(self, extra_data: dict | None = None, user: UserLogin) -> str:
        session_id = secrets.token_urlsafe(32)
        session_data = {
            "user_id": user_id,
            "created_at": str(datetime.utcnow()),  
            "last_activity": str(datetime.utcnow()),
            **extra_data
        }

        return
    
