from fastapi import APIRouter, Body, File, UploadFile
from fastapi.responses import FileResponse
from src.handlers.api.v1.depends import AuthAdapterDep, UserAdapterDep


router = APIRouter(prefix="/user")


@router.get("/")
async def get_user_data(
    auth: AuthAdapterDep,
    user_adapter: UserAdapterDep,
): 
    user_uuid = await auth.is_authenticated()
    user_data = await user_adapter.get_user_data(user_uuid)
    return user_data


@router.post("/balance")
async def increase_balance(
    auth_adapter: AuthAdapterDep,
    user_adapter: UserAdapterDep,
    amount: int = Body()
):
    user_uuid = await auth_adapter.is_authenticated()
    await user_adapter.increase_balance(amount, user_uuid)
 

@router.post("/avatar")
async def add_user_avatar(
    auth_adapter: AuthAdapterDep,
    user_adapter: UserAdapterDep,
    file: UploadFile = File()
):
    user_uuid = await auth_adapter.is_authenticated()
    content = await file.read()
    await user_adapter.change_avatar(user_uuid, file.filename, content)


@router.get("/avatar")
async def get_user_avatar(
    auth_adapter: AuthAdapterDep,
    user_adapter: UserAdapterDep,
):
    user_uuid = await auth_adapter.is_authenticated()
    file_path = await user_adapter.get_avatar(user_uuid)
    return FileResponse(file_path)


@router.post("/password")
async def change_password(
    auth: AuthAdapterDep,
    user_adapter: UserAdapterDep,
    new_password: str = Body()
):
    await user_adapter.change_password()
    ...
