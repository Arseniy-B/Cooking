from fastapi import Request, Response, Depends
from typing import Annotated
from src.domain.ports.auth import AuthPort
from src.infrastructure.services.db.db import AsyncSession, db_helper
from src.infrastructure.adapters.auth.adapter import AuthAdapter
from src.domain.ports.recipe import RecipePort
from src.infrastructure.adapters.recipe.adapter import RecipeAdapter


SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


async def get_recipe_adapter(session: SessionDep) -> RecipePort:
    return RecipeAdapter(session)


RecipeAdapterDep = Annotated[RecipePort, Depends(get_recipe_adapter)]


async def get_auth_adapter(
    session: SessionDep, request: Request, response: Response
) -> AuthPort:
    return AuthAdapter(session, request, response)


AuthAdapterDep = Annotated[AuthPort, Depends(get_auth_adapter)]
