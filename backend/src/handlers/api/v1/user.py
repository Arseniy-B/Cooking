from fastapi import APIRouter, status, HTTPException, Body
from fastapi.responses import JSONResponse
from src.handlers.api.v1.depends import AuthAdapterDep, UserAdapterDep
from src.infrastructure.adapters.auth.exceptions import NotAuthenticatedError


router = APIRouter(prefix="/user")


@router.get("/")
async def get_user_data(
    auth: AuthAdapterDep,
    user_adapter: UserAdapterDep,
): 
    try:
        user_uuid = await auth.is_authenticated()
        user_data = await user_adapter.get_user_data(user_uuid)
        return JSONResponse({"data": user_data})
    except NotAuthenticatedError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


@router.post("/password")
async def change_password(
    auth: AuthAdapterDep,
    user_adapter: UserAdapterDep,
    new_password: str = Body()
):
    await user_adapter.change_password()
    ...
