import typing as tp
import uuid
from datetime import timedelta

import bcrypt
from fastadmin import SqlAlchemyModelAdmin, register
from sqlalchemy import Boolean, Float, ForeignKey, Integer, String, Text, select, update
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    declared_attr,
    mapped_column,
    relationship,
)
from sqlalchemy.types import Time

from src.infrastructure.services.db.db import db_helper


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    id: Mapped[int] = mapped_column(primary_key=True, index=True)


class Ingredient(Base):
    name: Mapped[str] = mapped_column(unique=True)
    fats: Mapped[float]
    proteins: Mapped[float]
    carbohydrates: Mapped[float]
    descriptions: Mapped[str]


class Recipe(Base):
    name: Mapped[str]
    country: Mapped[str]
    difficulty: Mapped[int]

    steps = relationship(
        "RecipeStep", back_populates="recipe", cascade="all, delete-orphan"
    )


class RecipeStep(Base):
    step_number: Mapped[int]
    image_path: Mapped[str]
    description: Mapped[str]
    time_seconds: Mapped[int]

    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipe.id"), index=True)
    recipe = relationship("Recipe", back_populates="steps")
    ingredients = relationship(
        "RecipeStepIngredient", back_populates="recipe_step", cascade="all, delete-orphan"
    )


class RecipeStepIngredient(Base):
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredient.id"), index=True)
    recipe_step_id: Mapped[int] = mapped_column(ForeignKey("recipestep.id"), index=True)
    quantity: Mapped[float]

    recipe_step = relationship("RecipeStep", back_populates="ingredients")
    ingredient = relationship("Ingredient", back_populates="steps")


class User(Base):
    username: Mapped[str] = mapped_column(String(length=255), nullable=False)
    hash_password: Mapped[str] = mapped_column(String(length=255), nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __str__(self):
        return self.username


@register(Ingredient, sqlalchemy_sessionmaker=db_helper.session_factory)
class IngredientAdmin(SqlAlchemyModelAdmin):
    pass


@register(RecipeStep, sqlalchemy_sessionmaker=db_helper.session_factory)
class RecipStepAdmin(SqlAlchemyModelAdmin):
    pass


@register(RecipeStepIngredient, sqlalchemy_sessionmaker=db_helper.session_factory)
class StepIngredientAdmin(SqlAlchemyModelAdmin):
    pass


@register(Recipe, sqlalchemy_sessionmaker=db_helper.session_factory)
class RecipeAdmin(SqlAlchemyModelAdmin):
    pass


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
