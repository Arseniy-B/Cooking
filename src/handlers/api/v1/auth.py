from fastapi import APIRouter
from src.domain.entities.user import UserLogin, UserSignUp
from src.infrastructure.adapters.auth.adapter import AuthAdapter


router = APIRouter(prefix="/auth")




@router.post("/sign_up")
async def sign_up(UserLogin):
    auth = AuthAdapter()
    auth.sign_up()

@router.post("/login")
async def sign_in():
    ...

@router.post("/refresh")
async def refresh_token():
    ...
