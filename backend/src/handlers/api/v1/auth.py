from fastapi import APIRouter, Body
from src.domain.entities.user import UserLogin, UserCreate
from src.handlers.api.v1.depends import AuthAdapterDep
from src.infrastructure.adapters.auth.exceptions import AuthAdapterError, NotAuthenticatedError


router = APIRouter(prefix="/auth")


@router.post("/sign_up")
async def sign_up(auth: AuthAdapterDep, user: UserCreate = Body()):
    try:
        await auth.sign_up(user)
        return {"success": True}
    except AuthAdapterError:
        return {"success": False}


@router.post("/login")
async def sign_in(auth: AuthAdapterDep, user: UserLogin = Body()):
    try:
        await auth.login(user)
        return {"success": True}
    except AuthAdapterError:
        return {"success": False}


@router.get("/is_login")
async def is_login(auth:AuthAdapterDep):
    try:
        await auth.is_authenticated()
        return {"success": True}
    except NotAuthenticatedError:
        return {"success": False}


@router.get("/logout")
async def logout(auth: AuthAdapterDep):
    try:
        await auth.logout()
        return {"success": True}
    except NotAuthenticatedError:
        return {"success": True}
