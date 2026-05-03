from fastapi import Request, Response, Depends
from typing import Annotated
from src.domain.ports.auth import AuthPort
from src.infrastructure.services.db.db import AsyncSession, db_helper
from src.infrastructure.adapters.auth.adapter import AuthAdapter
from src.domain.ports.recipe import RecipePort
from src.domain.ports.buy import BuyPort
from src.infrastructure.adapters.recipe.adapter import RecipeAdapter
from src.infrastructure.adapters.buy.adapter import BuyAdapter


SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


async def get_recipe_adapter(session: SessionDep) -> RecipePort:
    return RecipeAdapter(session)


RecipeAdapterDep = Annotated[RecipePort, Depends(get_recipe_adapter)]


async def get_auth_adapter(
    session: SessionDep, request: Request, response: Response
) -> AuthPort:
    return AuthAdapter(session, request, response)


async def get_pay_adapter(
    session: SessionDep
) -> BuyPort:
    return BuyAdapter(session)


AuthAdapterDep = Annotated[AuthPort, Depends(get_auth_adapter)]
BuyAdapterDep = Annotated[BuyPort, Depends(get_pay_adapter)]
