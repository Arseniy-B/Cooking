from fastapi import Request, Response
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import User as UserModel
from src.infrastructure.adapters.auth.utils import hash_password, validate_password
from sqlalchemy import select
from src.domain.ports.auth import AuthPort
import secrets
from datetime import datetime, timezone
from src.domain.entities.user import User, UserLogin, UserCreate
from src.infrastructure.services.redis.redis_helper import redis_helper
from datetime import timedelta
from uuid import UUID


class AuthAdapter(AuthPort):
    def __init__(self, session: AsyncSession, request: Request, response: Response):
        self.request = request
        self.response = response
        self.session = session

    async def is_authenticated(self) -> bool:
        redis = await redis_helper.get_redis()
        session_id = self.request.cookies.get("token") 
        if redis.exists(f"session:{session_id}"):
            return True
        return False

    async def sign_up(self, user: UserCreate) -> bool:
        new_user = UserModel(
            username=user.username,
            hash_password=hash_password(user.password)
        )
        self.session.add(new_user)
        await self.session.commit()
        return True

    async def login(self, user_login: UserLogin) -> bool:
        stmt = select(User).where(UserModel.username == user_login.username)
        ans = await self.session.execute(stmt)
        user = ans.scalar_one()
        if validate_password(user_login.password, user.hash_password):
            token = await self._create_new_token(user.uuid)
            self.response.set_cookie(
                key="token",
                value=token,
                httponly=True,
                secure=True,
                samesite="lax",
                max_age=int(timedelta(minutes=60 * 24 * 7).total_seconds())
            )
            return True
        return False

    async def _create_new_token(self, user_uuid: UUID, extra_data: dict = {}, ttl_minutes: int = 60 * 24 * 7) -> str:
        session_id = secrets.token_urlsafe(32)
        session_data = {
            "user_uuid": user_uuid,
            "created_at": str(datetime.now(timezone.utc)),
            "last_activity": str(datetime.now(timezone.utc)),
            **extra_data
        }
        key = f"session:{session_id}"
        redis = await redis_helper.get_redis()
        redis.hset(key, mapping=session_data)
        redis.expire(key, timedelta(minutes=ttl_minutes))
        return session_id

    
