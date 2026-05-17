from fastapi import APIRouter, Query, Body
from fastapi.responses import JSONResponse
from uuid import UUID
from src.handlers.api.v1.depends import AuthAdapterDep, PurchaseAdapterDep


router = APIRouter(prefix="/purchased")


@router.get("/")
async def get_purchased(
    auth: AuthAdapterDep,
    purchase_adapter: PurchaseAdapterDep,
    page: int = Query(),
    size: int = Query(),
):
    user_uuid = await auth.is_authenticated()
    return await purchase_adapter.get_purchased(
        user_uuid=user_uuid, page=page, size=size
    )


@router.post("/")
async def buy_recipe(
    auth: AuthAdapterDep,
    purchase_adapter: PurchaseAdapterDep,
    recipe_uuid: UUID = Body(...),
):
    user_uuid = await auth.is_authenticated()
    full_recipe = await purchase_adapter.buy_recipe(user_uuid, recipe_uuid)
    return full_recipe
    


@router.get("/data")
async def get_purchase_data(
    auth: AuthAdapterDep,
    purchase_adapter: PurchaseAdapterDep,
):
    user_uuid = await auth.is_authenticated()
    data = await purchase_adapter.get_purchase_data(user_uuid)
    return data
