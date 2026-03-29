from abc import ABC, abstractmethod
from src.domain.entities.user import User, UserCreate, UserLogin



class AuthPort(ABC):
    @abstractmethod
    async def is_authenticated(self) -> bool:pass

    @abstractmethod
    async def sign_up(self, user: UserCreate) -> bool: pass

    @abstractmethod
    async def login(self, user_login: UserLogin) -> bool: pass

