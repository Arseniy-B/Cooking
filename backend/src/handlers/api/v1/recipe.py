from fastapi import APIRouter, Depends, Query, Body

from src.domain.entities.recipe import (
    IngredientSearch,
    Recipe,
    Search,
    RecipeDisplay,
)
from uuid import UUID
from src.handlers.api.v1.depends import RecipeAdapterDep

router = APIRouter(prefix="/recipes")


@router.post("/")
async def find_suitable_recipe(
    recipe_adapter: RecipeAdapterDep,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1),
    search: Search = Body()
) -> list[RecipeDisplay]:
    recipes = await recipe_adapter.match_recipe(search=search.recipe_search, tags=search.tags, size=size, page=page)
    return recipes


@router.get("/full")
async def get_full_recipe(recipe_adapter: RecipeAdapterDep, recipe_uuid: UUID):
    recipe: Recipe = await recipe_adapter.get_full_recipe(recipe_uuid)
    return recipe


@router.get("/ingredients")
async def get_suitable_ingredients(
    recipe_adapter: RecipeAdapterDep,
    search: IngredientSearch = Query(),
):
    ingredients = await recipe_adapter.get_ingredients(search)
    return ingredients

@router.get("/tag")
async def get_suitable_tags(
    recipe_adapter: RecipeAdapterDep,
    name: str = Query()
):
    tags = await recipe_adapter.get_tag(name)
    return [i.name for i in tags]
