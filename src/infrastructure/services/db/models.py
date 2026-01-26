from sqlalchemy import ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column
from datetime import timedelta
from pathlib import Path


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    id: Mapped[int] = mapped_column(primary_key=True)


class Ingredient(Base):
    name: Mapped[str] = mapped_column(unique=True)
    fats: Mapped[float]
    proteins: Mapped[float]
    carbohydrates: Mapped[float]
    descriptions: Mapped[str]


class RecipeStep(Base):
    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipe.id"), index=True)
    step_number: Mapped[int]
    image: Mapped[Path]
    description: Mapped[str]
    time: Mapped[timedelta]


class StepIngredient(Base):
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredient.id"), index=True)
    step_id: Mapped[int] = mapped_column(ForeignKey("recipestep.id"), index=True)
    quantity: Mapped[float]


class Recipe(Base):
    name: Mapped[str]
    country: Mapped[str] = mapped_column(nullable=True)
    difficulty: Mapped[int]
