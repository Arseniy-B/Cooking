from src.domain.entities.recipe import Ingredient
from src.domain.ports.recipe import RecipePort


async def match_by_ingredients(ingredients: list[Ingredient], Recipe: RecipePort):
    return await Recipe.match_by_ingredients(ingredients)
    
