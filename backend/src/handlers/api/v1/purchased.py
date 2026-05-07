from fastapi import APIRouter, status, HTTPException, Query, Body
from fastapi.responses import JSONResponse
from uuid import UUID
from src.handlers.api.v1.depends import AuthAdapterDep, PurchaseAdapterDep
from src.infrastructure.adapters.auth.exceptions import NotAuthenticatedError

router = APIRouter(prefix="/purchased")


@router.get("/")
async def get_purchased(
    auth: AuthAdapterDep,
    purchase_adapter: PurchaseAdapterDep,
    page: int = Query(),
    size: int = Query(),
):
    try:
        user_uuid = await auth.is_authenticated()
        return await purchase_adapter.get_purchased(user_uuid=user_uuid, page=page, size=size)
    except NotAuthenticatedError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


@router.post("/")
async def buy_recipe(
    auth: AuthAdapterDep,
    purchase_adapter: PurchaseAdapterDep,
    recipe_uuid: UUID = Body(...)
):
    try:
        user_uuid = await auth.is_authenticated()
        await purchase_adapter.buy_recipe(user_uuid, recipe_uuid)
        return JSONResponse({"success": True})
    except NotAuthenticatedError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
