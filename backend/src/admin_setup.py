from fastapi import FastAPI
import bcrypt
from src.infrastructure.services.db.models import User
from contextlib import asynccontextmanager
from src.infrastructure.services.db.db import db_helper
from src.infrastructure.services.db import admin_models
from sqlalchemy import select
from src.config import config


async def create_superuser():
    async with db_helper.session_factory() as session:
        ans = await session.scalars(select(User).where(User.is_superuser))
        users = ans.all()

        hash_password = bcrypt.hashpw(
            config.admin_panel.ADMIN_PASSWORD.encode(), bcrypt.gensalt()
        ).decode()

        match len(users):
            case 0:
                session.add(
                    User(
                        username=config.admin_panel.ADMIN_USERNAME,
                        hash_password=hash_password,
                        is_superuser=True,
                    )
                )
            case 1:
                users[0].is_superuser = True
            case _:
                return None
        await session.commit()


@asynccontextmanager
async def lifespan(*_: FastAPI):
    await create_superuser()
    yield
