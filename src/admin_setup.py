from fastapi import FastAPI
import bcrypt
from src.infrastructure.services.db.models import User
from contextlib import asynccontextmanager
from src.infrastructure.services.db.db import db_helper
from sqlalchemy import select
from src.config import config


class TooManySuperusers(Exception):
    """There must be only one superuser"""


async def create_superuser():
    session = db_helper.get_scoped_session()
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
            raise TooManySuperusers
    await session.commit()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_superuser()
    yield
