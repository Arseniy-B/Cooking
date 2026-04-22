import uuid
from uuid import uuid4
from pathlib import Path

import bcrypt
from fastadmin import SqlAlchemyModelAdmin, WidgetType, register
from sqlalchemy import (
    select,
    update,
)

from src.config import RECIPES_MEDIA_DIR, USERS_MEDIA_DIR
from src.infrastructure.services.db.db import db_helper
from src.infrastructure.services.db.models import (
    Ingredient,
    Recipe,
    RecipeStep,
    RecipeStepIngredient,
    User,
    Base,
    Tag,
    TagRecipe
)

class IntegerPKAdmin(SqlAlchemyModelAdmin):
    """Базовый класс для всех моделей, где PK — Integer (id)"""

    async def get_obj(self, id: str | int | uuid.UUID) -> dict | None:
        try:
            return await super().get_obj(int(id))
        except (ValueError, TypeError):
            return None

    async def delete_model(self, id: str | int | uuid.UUID) -> None:
        """Фикс удаления"""
        try:
            id_int = int(id)
        except (ValueError, TypeError):
            return
        return await super().delete_model(id_int)

    async def save_model(self, id: uuid.UUID | int | None | str, payload: dict) -> dict | None:
        """Фикс создания и обновления"""
        if id is not None:
            try:
                id = int(id)
            except (ValueError, TypeError):
                pass

        if isinstance(payload, dict) and "id" in payload and payload.get("id") is not None:
            try:
                payload["id"] = int(payload["id"])
            except (ValueError, TypeError):
                pass

        return await super().save_model(id, payload)


@register(Tag, sqlalchemy_sessionmaker=db_helper.session_factory)
class TagAdmin(IntegerPKAdmin):
    list_display = ("id", "name")
    search_fields = "name"


@register(TagRecipe, sqlalchemy_sessionmaker=db_helper.session_factory)
class TagRecipeAdmin(IntegerPKAdmin):
    list_display = ("id", "recipe_uuid", "tag_id")
    list_display_links = ("id", "recipe_uuid", "tag_id")
    list_filter = ("id", "recipe_uuid", "tag_id")
    search_fields = ("id", "recipe_uuid", "tag_id")

@register(Ingredient, sqlalchemy_sessionmaker=db_helper.session_factory)
class IngredientAdmin(IntegerPKAdmin):
    list_display = ("id", "name", "proteins", "carbohydrates", "description")
    list_display_links = ("id", "name")
    list_filter = ("id", "name", "proteins", "carbohydrates", "description")
    search_fields = "name"


@register(RecipeStep, sqlalchemy_sessionmaker=db_helper.session_factory)
class RecipStepAdmin(IntegerPKAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    list_filter = ("id", "name")
    search_fields = ("id", "name")


@register(RecipeStepIngredient, sqlalchemy_sessionmaker=db_helper.session_factory)
class StepIngredientAdmin(IntegerPKAdmin):
    list_display = ("id", "name")
    list_display_links = ("id", "name")
    list_filter = ("id", "name")
    search_fields = ("id", "name")


@register(Recipe, sqlalchemy_sessionmaker=db_helper.session_factory)
class RecipeAdmin(IntegerPKAdmin):
    list_display = (
        "id",
        "name",
        "country",
        "difficulty",
        "image_path",
        "cost",
        "views",
    )
    list_display_links = ("id", "country", "difficulty", "image_path", "cost", "views")
    list_filter = "id"
    formfield_overrides = {
        "image_path": (WidgetType.UploadImage, {"required": True}),
    }

    async def upload_file(
        self,
        field_name: str,
        file_name: str,
        file_content: bytes,
        obj: Base | None = None,
    ) -> str:
        ext = Path(file_name).suffix
        new_filename = f"{uuid4()}{ext}"

        file_path = RECIPES_MEDIA_DIR / new_filename
        with open(file_path, "wb") as f:
            f.write(file_content)

        return f"/media/recipes/{new_filename}"


@register(User, sqlalchemy_sessionmaker=db_helper.session_factory)
class UserAdmin(IntegerPKAdmin):
    exclude = ("hash_password",)
    list_display = ("id", "username", "is_superuser", "is_active")
    list_display_links = ("id", "username")
    list_filter = ("id", "username", "is_superuser", "is_active")
    search_fields = ("username",)

    formfield_overrides = {
        "avatar_url": (WidgetType.UploadImage, {"required": False}),
    }

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
        

    async def change_password(self, id: uuid.UUID | int | str, password: str) -> None:
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

    async def upload_file(
        self,
        field_name: str,
        file_name: str,
        file_content: bytes,
        obj: Base | None = None,
    ) -> str:
        ext = Path(file_name).suffix
        new_filename = f"{uuid4()}{ext}"

        file_path = USERS_MEDIA_DIR / new_filename
        with open(file_path, "wb") as f:
            f.write(file_content)

        return f"/media/users/{new_filename}"

    async def get_obj(self, id: str | int | uuid.UUID) -> dict | None:
        id_int = int(id)
        ans = await super().get_obj(id_int)
        return ans


    async def save_model(self, id: uuid.UUID | int | str | None, payload: dict) -> dict | None:
        id_int = id
        if id:
            id_int = int(id)
        return await super().save_model(id_int, payload)
