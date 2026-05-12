from fastapi import Request, Response, Depends
from typing import Annotated
from src.domain.ports.auth import AuthPort
from src.infrastructure.services.db.db import AsyncSession, db_helper
from src.infrastructure.adapters.auth.adapter import AuthAdapter
from src.domain.ports.recipe import RecipePort, BasketPort, PurchasePort
from src.domain.ports.user import UserPort
from src.infrastructure.adapters.recipe.adapter import RecipeAdapter, BasketAdapter, PurchaseAdapter
from src.infrastructure.adapters.user.adapter import UserAdapter
from typing import TypeVar, Callable

SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


PortT = TypeVar("PortT")
def adapter_dep(
    adapter: Callable[[SessionDep], PortT],
):
    def dependency(session: SessionDep) -> PortT:
        return adapter(session)

    return dependency

RecipeAdapterDep = Annotated[
    RecipePort,
    Depends(adapter_dep(RecipeAdapter))
]
BasketAdapterDep = Annotated[
    BasketPort,
    Depends(adapter_dep(BasketAdapter))
]
PurchaseAdapterDep = Annotated[
    PurchasePort,
    Depends(adapter_dep(PurchaseAdapter))
]
UserAdapterDep = Annotated[
    UserPort,
    Depends(adapter_dep(UserAdapter))
]

async def get_auth_adapter(
    session: SessionDep, request: Request, response: Response
) -> AuthPort:
    return AuthAdapter(session, request, response)

AuthAdapterDep = Annotated[AuthPort, Depends(get_auth_adapter)]
