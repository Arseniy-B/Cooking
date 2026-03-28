from abc import ABC, abstractmethod



class AuthPort(ABC):
    @abstractmethod
    async def is_authenticated(self) -> bool:pass

    @abstractmethod
    async def sign_up(self): pass

    @abstractmethod
    async def login(self): pass

    @abstractmethod
    async def refresh(self): pass

