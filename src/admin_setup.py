from fastapi import FastAPI
import bcrypt
from src.infrastructure.services.db.models import User
from contextlib import asynccontextmanager
from src.infrastructure.services.db.db import db_helper
from sqlalchemy import select
from src.config import config


async def create_superuser():
    session = db_helper.get_scoped_session()
    user = await session.scalar(
        select(User).where(User.is_superuser)
    )

    hash_password = bcrypt.hashpw(config.admin_panel.ADMIN_PASSWORD.encode(), bcrypt.gensalt()).decode()
    if not user:
        session.add(User(username=config.admin_panel.ADMIN_USERNAME, hash_password=hash_password, is_superuser=True))

    await session.commit()



@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_superuser()
    yield
