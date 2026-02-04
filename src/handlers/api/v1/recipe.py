from fastapi import APIRouter, Depends, Query
from fastapi.responses import JSONResponse
from typing import Annotated
from src.domain.entities.recipe import RecipeSearch, Recipe
from src.infrastructure.services.db.db import db_helper, AsyncSession
from src.infrastructure.adapters.recipe.adapter import RecipeAdapter
from src.domain.ports.recipe import RecipePort
from fastapi_pagination import Page


router = APIRouter(prefix="/recipe")


SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


async def get_recipe_adapter(session: SessionDep) -> RecipePort:
    return RecipeAdapter(session)


RecipeAdapterDep = Annotated[RecipePort, Depends(get_recipe_adapter)]


@router.get("/match/{search}")
async def find_suitable_recipe(
    recipe_adapter: RecipeAdapterDep,
    search: RecipeSearch,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1),
) -> Page[list[Recipe]]:
    recipes = await recipe_adapter.match_recipe(search, size=size, page=page)
    return recipes
