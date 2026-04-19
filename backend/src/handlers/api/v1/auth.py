from fastapi import APIRouter, Body
from src.domain.entities.user import UserLogin, UserCreate
from src.handlers.api.v1.depends import AuthAdapterDep


router = APIRouter(prefix="/auth")


@router.post("/sign_up")
async def sign_up(auth: AuthAdapterDep, user: UserCreate = Body()):
    ans = await auth.sign_up(user)
    return {"success": ans}


@router.post("/login")
async def sign_in(auth: AuthAdapterDep, user: UserLogin = Body()):
    ans = await auth.login(user)
    return {"success": ans}


@router.get("/is_login")
async def is_login(auth:AuthAdapterDep):
    if await auth.is_authenticated():
        return {"success": True}
    return {"success": False}


@router.get("/logout")
async def logout(auth: AuthAdapterDep):
    await auth.logout()
    return {"success": True}
