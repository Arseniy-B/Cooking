from uuid import UUID

from sqlalchemy import select

from src.domain.ports.user import UserPort
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import User


class UserAdapter(UserPort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_data(self, user_uuid: UUID) -> float:
        user = await self.session.scalar(select(User).where(User.uuid == user_uuid))
        if not user:
            raise
        return user.balance

    async def change_password(self): ...
