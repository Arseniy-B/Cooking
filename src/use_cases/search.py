from src.domain.entities.recipe import Ingredient
from src.domain.ports.recipe import RecipeAdapter


async def match_by_ingredients(ingredients: list[Ingredient], Recipe: RecipeAdapter):
    return await Recipe.match_by_ingredients(ingredients)
    
