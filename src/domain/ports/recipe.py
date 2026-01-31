from abc import ABC, abstractmethod
from src.domain.entities.recipe import RecipeSearch, Recipe
from fastapi_pagination import Page


class RecipePort(ABC):
    @abstractmethod
    async def match_recipe(self, search: RecipeSearch) -> Page[list[Recipe]]: pass
