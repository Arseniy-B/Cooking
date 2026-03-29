from fastapi import APIRouter
from src.handlers.api.v1.depends import RecipeAdapterDep, AuthAdapterDep
from uuid import UUID


router = APIRouter(prefix="/backet")


@router.get("/")
async def get_recipe_from_backet(
    recipe_adapter: RecipeAdapterDep, auth: AuthAdapterDep, page: int, size: int
):
    user_uuid = await auth.is_authenticated()
    if not user_uuid:
        return None
    recipes = await recipe_adapter.get_user_backet(user_uuid, page, size)
    return recipes


@router.post("/add")
async def add_to_backet(recipe_adapter: RecipeAdapterDep, auth: AuthAdapterDep, recipe_uuid: UUID): 
    user_uuid = await auth.is_authenticated()
    if not user_uuid:
        return None
    await recipe_adapter.add_to_backet(recipe_uuid, user_uuid)
    return {"success": True}


@router.post("/remove")
async def remove_from_backet(recipe_adapter: RecipeAdapterDep, auth: AuthAdapterDep, recipe_uuid: UUID): 
    user_uuid = await auth.is_authenticated()
    if not user_uuid:
        return None
    await recipe_adapter.remove_from_backet(recipe_uuid, user_uuid)
    return {"success": True}

