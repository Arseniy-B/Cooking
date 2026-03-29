from fastapi import APIRouter
from src.domain.entities.user import UserLogin, UserCreate
from src.handlers.api.v1.depends import AuthAdapterDep


router = APIRouter(prefix="/auth")


@router.post("/sign_up")
async def sign_up(auth: AuthAdapterDep, user: UserCreate):
    ans = await auth.sign_up(user)
    return {"success": ans}


@router.post("/login")
async def sign_in(auth: AuthAdapterDep, user: UserLogin):
    ans = await auth.login(user)
    return {"success", ans}
