from fastapi import APIRouter, Body, status
from fastapi.exceptions import HTTPException
from src.handlers.api.v1.depends import RecipeAdapterDep, AuthAdapterDep
from uuid import UUID
from src.infrastructure.adapters.auth.exceptions import NotAuthenticatedError


router = APIRouter(prefix="/basket")


@router.get("/")
async def get_recipe_from_basket(
    recipe_adapter: RecipeAdapterDep, auth: AuthAdapterDep, page: int, size: int
):
    try:
        user_uuid = await auth.is_authenticated()
        recipes = await recipe_adapter.get_user_basket(user_uuid, page, size)
        return recipes
    except NotAuthenticatedError:
        return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


@router.post("/add")
async def add_to_basket(
    recipe_adapter: RecipeAdapterDep, auth: AuthAdapterDep, recipe_uuid: UUID = Body()
):
    try:
        user_uuid = await auth.is_authenticated()
        await recipe_adapter.add_to_basket(recipe_uuid, user_uuid)
        return {"success": True}
    except NotAuthenticatedError:
        return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


@router.post("/remove")
async def remove_from_basket(
    recipe_adapter: RecipeAdapterDep, auth: AuthAdapterDep, recipe_uuid: UUID = Body()
):
    try:
        user_uuid = await auth.is_authenticated()
        await recipe_adapter.remove_from_basket(recipe_uuid, user_uuid)
        return {"success": True}
    except NotAuthenticatedError:
        return HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

