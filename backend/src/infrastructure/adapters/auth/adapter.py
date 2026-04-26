from fastapi import Request, Response
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import User as UserModel
from src.infrastructure.adapters.auth.utils import hash_password, validate_password
from sqlalchemy import select
from src.domain.ports.auth import AuthPort
import secrets
from src.domain.entities.user import UserLogin, UserCreate
from src.infrastructure.services.redis.redis_helper import redis_helper
from datetime import timedelta
from uuid import UUID
from src.infrastructure.adapters.auth.exceptions import (
    NotAuthenticatedError,
    UserAlreadyExists,
)


class AuthAdapter(AuthPort):
    def __init__(self, session: AsyncSession, request: Request, response: Response):
        self.request = request
        self.response = response
        self.session = session

    async def is_authenticated(self) -> UUID:
        redis = await redis_helper.get_redis()
        session_id = self.request.cookies.get("token")
        user_uuid_str = await redis.get(f"session:{session_id}")
        if not user_uuid_str:
            raise NotAuthenticatedError
        return UUID(user_uuid_str.decode())

    async def sign_up(self, user: UserCreate):
        ans = await self.session.execute(
            select(UserModel).where(UserModel.username == user.username)
        )
        exists_user = ans.scalar_one_or_none()
        if exists_user:
            raise UserAlreadyExists
        new_user = UserModel(
            username=user.username, hash_password=hash_password(user.password)
        )
        self.session.add(new_user)
        await self.session.commit()

    async def login(self, user_login: UserLogin):
        stmt = select(UserModel).where(UserModel.username == user_login.username)
        ans = await self.session.execute(stmt)
        user = ans.scalar_one()
        if not validate_password(user_login.password, user.hash_password):
            raise
        token = await self._create_new_token(user.uuid)
        self.response.set_cookie(
            key="token",
            value=token,
            httponly=True,
            secure=True,
            samesite="lax",
            max_age=int(timedelta(minutes=60 * 24 * 7).total_seconds()),
        )

    async def _create_new_token(
        self, user_uuid: UUID, ttl_minutes: int = 60 * 24 * 7
    ) -> str:
        session_id = secrets.token_urlsafe(32)
        key = f"session:{session_id}"
        redis = await redis_helper.get_redis()
        await redis.set(key, str(user_uuid))
        await redis.expire(key, timedelta(minutes=ttl_minutes))
        return session_id

    async def logout(self):
        token = self.request.cookies.get("token")
        if not token:
            raise NotAuthenticatedError
        redis = await redis_helper.get_redis()
        if redis.exists(token):
            redis.delete(token)
        self.response.delete_cookie(
            key="token",
            httponly=True,
            secure=True,
            samesite="lax",
        )
