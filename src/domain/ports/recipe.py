from abc import ABC, abstractmethod
from src.domain.entities.recipe import Ingredient, Recipe


class RecipeAdapter(ABC):
    @abstractmethod
    async def match_by_ingredients(self, ingredients: list[Ingredient]) -> list[Recipe]: pass
