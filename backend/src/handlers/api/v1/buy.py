from fastapi import APIRouter, status, HTTPException, Body
from fastapi.responses import JSONResponse
from uuid import UUID
from src.handlers.api.v1.depends import AuthAdapterDep, BuyAdapterDep
from src.infrastructure.adapters.auth.exceptions import NotAuthenticatedError


router = APIRouter(prefix="/buy")


@router.post("/")
async def buy_recipe(
    auth: AuthAdapterDep,
    pay_adapter: BuyAdapterDep,
    recipe_uuid: UUID = Body(...)
):
    try:
        user_uuid = await auth.is_authenticated()
        await pay_adapter.buy(user_uuid, recipe_uuid)
        return JSONResponse({"success": True})
    except NotAuthenticatedError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


@router.get("/balance")
async def get_user_balance(
    auth: AuthAdapterDep,
    pay_adapter: BuyAdapterDep,
): 
    try:
        user_uuid = await auth.is_authenticated()
        balance = await pay_adapter.get_balance(user_uuid)
        return JSONResponse({"balance": balance})
    except NotAuthenticatedError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

