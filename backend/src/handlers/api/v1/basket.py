from fastapi import APIRouter, Body
from src.handlers.api.v1.depends import BasketAdapterDep, AuthAdapterDep
from uuid import UUID


router = APIRouter(prefix="/basket")


@router.get("/")
async def get_recipe_from_basket(
    basket_adapter: BasketAdapterDep, auth: AuthAdapterDep, page: int, size: int
):
    user_uuid = await auth.is_authenticated()
    recipes = await basket_adapter.get_user_basket(user_uuid, page, size)
    return recipes


@router.post("/add")
async def add_to_basket(
    basket_adapter: BasketAdapterDep, auth: AuthAdapterDep, recipe_uuid: UUID = Body()
):
    user_uuid = await auth.is_authenticated()
    await basket_adapter.add_to_basket(recipe_uuid, user_uuid)
    return {"success": True}


@router.post("/remove")
async def remove_from_basket(
    basket_adapter: BasketAdapterDep, auth: AuthAdapterDep, recipe_uuid: UUID = Body()
):
    user_uuid = await auth.is_authenticated()
    await basket_adapter.remove_from_basket(recipe_uuid, user_uuid)
    return {"success": True}
