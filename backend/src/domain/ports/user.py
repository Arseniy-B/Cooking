from abc import ABC, abstractmethod
from uuid import UUID


class UserPort(ABC):
    @abstractmethod
    async def get_user_data(self, user_uuid: UUID) -> float:
        pass

    @abstractmethod
    async def change_password(self):
        pass
