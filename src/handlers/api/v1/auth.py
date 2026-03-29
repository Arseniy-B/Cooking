from fastapi import APIRouter, Request, Response, Depends
from typing import Annotated
from src.domain.ports.auth import AuthPort
from src.infrastructure.services.db.db import AsyncSession, db_helper
from src.domain.entities.user import UserLogin, UserCreate
from src.infrastructure.adapters.auth.adapter import AuthAdapter


router = APIRouter(prefix="/auth")


SessionDep = Annotated[AsyncSession, Depends(db_helper.get_session)]


async def get_auth_adapter(
    session: SessionDep, request: Request, response: Response
) -> AuthPort:
    return AuthAdapter(session, request, response)


AuthAdapterDep = Annotated[AuthAdapter, Depends(get_auth_adapter)]


@router.post("/sign_up")
async def sign_up(auth: AuthAdapterDep, user: UserCreate):
    ans = await auth.sign_up(user)
    return {"success": ans}


@router.post("/login")
async def sign_in(auth: AuthAdapterDep, user: UserLogin):
    ans = await auth.login(user)
    return {"success", ans}
