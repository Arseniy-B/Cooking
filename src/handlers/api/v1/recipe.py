from typing import Annotated


from fastapi import APIRouter, Body, Depends, File, Query, UploadFile

from src.domain.entities.recipe import IngredientSearch, Recipe, RecipeSearch
from src.domain.ports.recipe import RecipePort
from src.infrastructure.adapters.recipe.adapter import RecipeAdapter
from src.infrastructure.services.db.db import AsyncSession, db_helper

router = APIRouter(prefix="/recipes")


SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


async def get_recipe_adapter(session: SessionDep) -> RecipePort:
    return RecipeAdapter(session)


RecipeAdapterDep = Annotated[RecipePort, Depends(get_recipe_adapter)]


@router.get("/")
async def find_suitable_recipe(
    recipe_adapter: RecipeAdapterDep,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1),
    search: RecipeSearch = Depends(),
) -> list[Recipe]:
    recipes = await recipe_adapter.match_recipe(search, size=size, page=page)
    return recipes


@router.get("/ingredients")
async def get_all_ingredients(
    recipe_adapter: RecipeAdapterDep,
    search: IngredientSearch = Query(),
):
    ingredients = await recipe_adapter.get_ingredients(search)
    return ingredients



@router.get("/offers")
async def get_current_offers():
    ...
