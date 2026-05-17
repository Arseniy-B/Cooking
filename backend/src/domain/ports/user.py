from abc import ABC, abstractmethod
from uuid import UUID
from pathlib import Path

from src.domain.entities.user import UserData


class UserPort(ABC):
    @abstractmethod
    async def get_user_data(self, user_uuid: UUID) -> UserData:
        pass

    @abstractmethod
    async def increase_balance(self, amount, user_uuid: UUID):
        pass

    @abstractmethod
    async def change_password(self):
        pass

    @abstractmethod
    async def change_avatar(
        self, user_uuid: UUID, file_name: str | None, file_content: bytes
    ):
        pass

    @abstractmethod
    async def get_avatar(self, user_uuid: UUID) -> Path:
        pass
