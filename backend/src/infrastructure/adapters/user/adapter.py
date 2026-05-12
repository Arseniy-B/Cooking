from uuid import UUID, uuid4

from sqlalchemy import select
from pathlib import Path
from src.config import USERS_MEDIA_DIR

from src.domain.entities.user import UserData
from src.domain.ports.user import UserPort
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import User


class UserAdapter(UserPort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_user_data(self, user_uuid: UUID) -> UserData:
        user = await self.session.scalar(select(User).where(User.uuid == user_uuid))
        if not user:
            raise
        user_data = UserData.model_validate(user.__dict__)
        return user_data

    async def increase_balance(self, amount, user_uuid: UUID):
        user = await self.session.scalar(select(User).where(User.uuid == user_uuid))
        if not user:
            raise
        user.balance += abs(amount)
        await self.session.commit()

    async def change_password(self): ...

    async def change_avagar(
        self,
        user_uuid: UUID,
        file_name: str | None,
        file_content: bytes,
    ):
        ext = ""
        if file_name:
            ext = Path(file_name).suffix
        new_filename = f"{uuid4()}{ext}"

        file_path = USERS_MEDIA_DIR / new_filename
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        user = await self.session.scalar(select(User).where(User.uuid == user_uuid))
        if not user:
            raise 

        user.avatar_url = new_filename
        await self.session.commit()

    async def get_avatar(self, user_uuid: UUID) -> Path:
        user = await self.session.scalar(select(User).where(User.uuid == user_uuid))
        if not user:
            raise

        if not user.avatar_url:
            raise

        file_path = USERS_MEDIA_DIR / user.avatar_url
        if not Path(file_path).exists():
            raise

        return file_path
        
