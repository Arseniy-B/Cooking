from abc import ABC, abstractmethod
from src.domain.entities.recipe import RecipeSearch, Recipe, IngredientSearch, Ingredient


class RecipePort(ABC):
    @abstractmethod
    async def match_recipe(self, search: RecipeSearch, page: int = 1, size: int = 20) -> list[Recipe]: pass

    @abstractmethod
    async def get_ingredients(self, search: IngredientSearch) -> list[Ingredient]: pass
