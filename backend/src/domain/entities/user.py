from pydantic import BaseModel
from uuid import UUID


class User(BaseModel):
    uuid: UUID
    username: str
    hash_password: str
    is_superuser: bool
    is_active: bool
    avatar_url: str | None


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str

