import os
import typing as tp
import uuid
from base64 import b64decode
from uuid import uuid4

import bcrypt
from fastadmin import SqlAlchemyModelAdmin, WidgetType, register
from sqlalchemy import (
    select,
    update,
)

from src.config import RECIPES_MEDIA_DIR
from src.infrastructure.services.db.db import db_helper
from src.infrastructure.services.db.models import (
    Ingredient,
    Recipe,
    RecipeStep,
    RecipeStepIngredient,
    User,
)


@register(Ingredient, sqlalchemy_sessionmaker=db_helper.session_factory)
class IngredientAdmin(SqlAlchemyModelAdmin):
    list_display = ("id", "name", "proteins", "carbohydrates", "description")
    list_display_links = ("id", "name")
    list_filter = ("id", "name", "proteins", "carbohydrates", "description")
    search_fields = "name"


@register(RecipeStep, sqlalchemy_sessionmaker=db_helper.session_factory)
class RecipStepAdmin(SqlAlchemyModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    list_filter = ("id", "name")
    search_fields = ("id", "name")


@register(RecipeStepIngredient, sqlalchemy_sessionmaker=db_helper.session_factory)
class StepIngredientAdmin(SqlAlchemyModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    list_filter = ("id", "name")
    search_fields = ("id", "name")


@register(Recipe, sqlalchemy_sessionmaker=db_helper.session_factory)
class RecipeAdmin(SqlAlchemyModelAdmin):
    list_display = ("id", "name", "country", "difficulty", "image_path", "cost", "views")
    list_display_links = ("id", "country", "difficulty", "image_path", "cost", "views")
    list_filter = "id"
    formfield_overrides = {
        "image_path": (
            WidgetType.Upload,
            {
                "autoUpload": True,
            },
        ),
    }

    async def orm_save_upload_field(self, obj, field, base64: str):
        header, encoded = base64.split(",", 1)
        ext = header.split("/")[1].split(";")[0]
        ext = f".{ext}"
        file_content = b64decode(encoded)
        new_filename = f"{uuid4()}{ext}"
        file_path = RECIPES_MEDIA_DIR / new_filename
        with open(file_path, "wb") as f:
            f.write(file_content)
        file_url = f"/media/recipes/{new_filename}"

        sessionmaker = self.get_sessionmaker()
        async with sessionmaker() as session:
            query = (
                update(self.model_cls)
                .where(self.model_cls.id == obj.id)
                .values(**{field: file_url})
            )
            await session.execute(query)
            await session.commit()


@register(User, sqlalchemy_sessionmaker=db_helper.session_factory)
class UserAdmin(SqlAlchemyModelAdmin):
    exclude = ("hash_password",)
    list_display = ("id", "username", "is_superuser", "is_active")
    list_display_links = ("id", "username")
    list_filter = ("id", "username", "is_superuser", "is_active")
    search_fields = ("username",)

    async def authenticate(
        self, username: str, password: str
    ) -> uuid.UUID | int | None:
        sessionmaker = self.get_sessionmaker()
        async with sessionmaker() as session:
            query = select(self.model_cls).filter_by(
                username=username, is_superuser=True
            )
            result = await session.scalars(query)
            obj = result.first()
            if not obj:
                return None
            if not bcrypt.checkpw(password.encode(), obj.hash_password.encode()):
                return None
            return obj.id

    async def change_password(self, id: uuid.UUID | int, password: str) -> None:
        sessionmaker = self.get_sessionmaker()
        async with sessionmaker() as session:
            hash_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
            query = (
                update(self.model_cls)
                .where(User.id.in_([id]))
                .values(hash_password=hash_password)
            )
            await session.execute(query)
            await session.commit()

    async def orm_save_upload_field(self, obj: tp.Any, field: str, base64: str) -> None:
        sessionmaker = self.get_sessionmaker()
        async with sessionmaker() as session:
            # convert base64 to bytes, upload to s3/filestorage, get url and save or save base64 as is to db (don't recomment it)
            query = (
                update(self.model_cls)
                .where(User.id.in_([obj.id]))
                .values(**{field: base64})
            )
            await session.execute(query)
            await session.commit()
