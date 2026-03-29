from abc import ABC, abstractmethod
from src.domain.entities.recipe import RecipeSearch, Recipe, IngredientSearch, Ingredient, RecipeDisplay
from uuid import UUID


class RecipePort(ABC):
    @abstractmethod
    async def match_recipe(self, search: RecipeSearch, page: int = 1, size: int = 20) -> list[RecipeDisplay]: pass

    @abstractmethod
    async def get_full_recipe(self, recipe_uuid: UUID) -> Recipe: pass

    @abstractmethod
    async def get_ingredients(self, search: IngredientSearch) -> list[Ingredient]: pass
