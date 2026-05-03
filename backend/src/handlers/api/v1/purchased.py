from fastapi import APIRouter, status, HTTPException, Query, Body
from fastapi.responses import JSONResponse
from uuid import UUID
from src.handlers.api.v1.depends import AuthAdapterDep, RecipeAdapterDep
from src.infrastructure.adapters.auth.exceptions import NotAuthenticatedError

router = APIRouter(prefix="/purchased")


@router.get("/")
async def get_purchased(
    auth: AuthAdapterDep,
    recipe_adapter: RecipeAdapterDep,
    page: int = Query(),
    size: int = Query(),
):
    try:
        user_uuid = await auth.is_authenticated()
        return await recipe_adapter.get_purchased(user_uuid=user_uuid, page=page, size=size)
    except NotAuthenticatedError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
