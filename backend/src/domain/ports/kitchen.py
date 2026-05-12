from abc import ABC, abstractmethod


class KitchenPort(ABC):
    @abstractmethod
    async def create_recipe(self): pass

    @abstractmethod
    async def get_recieps(self): pass

    @abstractmethod
    async def add_photo(self): pass

