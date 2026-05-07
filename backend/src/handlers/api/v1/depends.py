from fastapi import Request, Response, Depends
from typing import Annotated
from src.domain.ports.auth import AuthPort
from src.infrastructure.services.db.db import AsyncSession, db_helper
from src.infrastructure.adapters.auth.adapter import AuthAdapter
from src.domain.ports.recipe import RecipePort, BasketPort, PurchasePort
from src.domain.ports.user import UserPort
from src.infrastructure.adapters.recipe.adapter import RecipeAdapter, BasketAdapter, PurchaseAdapter
from src.infrastructure.adapters.user.adapter import UserAdapter


SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


RecipeAdapterDep = Annotated[
    RecipePort,
    Depends(lambda session=SessionDep: RecipeAdapter(session))
]
BasketAdapterDep = Annotated[
    BasketPort,
    Depends(lambda session=SessionDep: BasketAdapter(session))
]
PurchaseAdapterDep = Annotated[
    PurchasePort,
    Depends(lambda session=SessionDep: PurchaseAdapter(session))
]
UserAdapterDep = Annotated[
    UserPort,
    Depends(lambda session=SessionDep: UserAdapter(session))
]

async def get_auth_adapter(
    session: SessionDep, request: Request, response: Response
) -> AuthPort:
    return AuthAdapter(session, request, response)

AuthAdapterDep = Annotated[AuthPort, Depends(get_auth_adapter)]
