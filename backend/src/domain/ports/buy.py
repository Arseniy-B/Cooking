from abc import ABC, abstractmethod
from uuid import UUID


class BuyPort(ABC):
    @abstractmethod
    async def buy(self, user_uuid: UUID, recipe_uuid: UUID): pass

    @abstractmethod
    async def get_balance(self, user_uuid: UUID) -> float: pass
    
