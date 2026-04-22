from sqlalchemy import (
    Boolean,
    ForeignKey,
    String,
    Text,
    Index,
    Uuid
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    declared_attr,
    mapped_column,
    relationship,
)
from uuid import UUID, uuid4


class Base(DeclarativeBase):
    __abstract__ = True

    @declared_attr.directive
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    id: Mapped[int] = mapped_column(primary_key=True, index=True)


class Tag(Base):
    name: Mapped[str] = mapped_column(unique=True)

    __table_args__ = (
        Index(
            "ix_tag_name_trgm",
            "name",
            postgresql_using="gin",
            postgresql_ops={"name": "gin_trgm_ops"},
        ),
    )


class TagRecipe(Base):
    tag_id: Mapped[int] = mapped_column(ForeignKey("tag.id", ondelete="CASCADE"), index=True)
    recipe_uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("recipe.uuid", ondelete="CASCADE"), index=True)

    recipe = relationship("Recipe", back_populates="recipe_tags")
    tag = relationship("Tag")


class Ingredient(Base):
    name: Mapped[str] = mapped_column(unique=True)
    fats: Mapped[float]
    proteins: Mapped[float]
    carbohydrates: Mapped[float]
    description: Mapped[str]

    __table_args__ = (
        Index(
            "ix_ingredient_name_trgm",
            "name",
            postgresql_using="gin",
            postgresql_ops={"name": "gin_trgm_ops"},
        ),
    )

    def __str__(self):
        return self.name


class Recipe(Base):
    uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), unique=True, index=True, default=uuid4)
    name: Mapped[str]
    country: Mapped[str]
    difficulty: Mapped[int]
    image_path: Mapped[str] = mapped_column(nullable=True)
    views: Mapped[int]
    cost: Mapped[int]

    recipe_steps = relationship(
        "RecipeStep", back_populates="recipe", cascade="all, delete-orphan"
    )
    recipe_tags = relationship(
        "TagRecipe", back_populates="recipe", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index(
            "ix_recipe_name_trgm",
            "name",
            postgresql_using="gin",
            postgresql_ops={"name": "gin_trgm_ops"},
        ),
    )

    def __str__(self):
        return self.name


class RecipeStep(Base):
    step_number: Mapped[int]
    image_path: Mapped[str]
    time_seconds: Mapped[int]
    description: Mapped[str]

    recipe_id: Mapped[int] = mapped_column(ForeignKey("recipe.id"), index=True)
    recipe = relationship("Recipe", back_populates="recipe_steps")
    ingredients = relationship(
        "RecipeStepIngredient",
        back_populates="recipe_step",
        cascade="all, delete-orphan",
    )

    @property
    def name(self):
        s = str()
        if self.recipe:
            s += self.recipe.name + " "
        s += self.description
        return s


class RecipeStepIngredient(Base):
    ingredient_id: Mapped[int] = mapped_column(ForeignKey("ingredient.id"), index=True)
    recipe_step_id: Mapped[int] = mapped_column(ForeignKey("recipestep.id"), index=True)
    quantity: Mapped[float]

    recipe_step = relationship("RecipeStep", back_populates="ingredients")
    ingredient = relationship("Ingredient")

    @property
    def name(self):
        return f"{self.ingredient} + {self.recipe_step.__str__()}"


class Basket(Base):
    user_uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("user.uuid", ondelete="CASCADE"), index=True)
    recipe_uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), ForeignKey("recipe.uuid", ondelete="CASCADE"), index=True)


class User(Base):
    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    uuid: Mapped[UUID] = mapped_column(Uuid(as_uuid=True), unique=True, index=True, default=uuid4)
    username: Mapped[str] = mapped_column(String(length=255), nullable=False)
    hash_password: Mapped[str] = mapped_column(String(length=255), nullable=False)
    is_superuser: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    avatar_url: Mapped[str | None] = mapped_column(Text, nullable=True)

    def __str__(self):
        return self.username
