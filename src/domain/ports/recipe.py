from abc import ABC, abstractmethod
from src.domain.entities.recipe import RecipeSearch, Recipe


class RecipePort(ABC):
    @abstractmethod
    async def match_recipe(self, search: RecipeSearch, page: int = 1, size: int = 20) -> list[Recipe]: pass
