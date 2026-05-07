from abc import ABC, abstractmethod
from src.domain.entities.user import UserCreate, UserLogin
from uuid import UUID


class AuthPort(ABC):
    @abstractmethod
    async def is_authenticated(self) -> UUID:
        pass

    @abstractmethod
    async def sign_up(self, user: UserCreate):
        pass

    @abstractmethod
    async def login(self, user_login: UserLogin):
        pass

    @abstractmethod
    async def logout(self):
        pass
