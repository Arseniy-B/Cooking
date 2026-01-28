from src.domain.ports.recipe import RecipePort
from src.domain.entities.recipe import Ingredient, Recipe


class RecipeAdapter(RecipePort):
    async def match_by_ingredients(self, ingredients: list[Ingredient]) -> list[Recipe]:
        ...
