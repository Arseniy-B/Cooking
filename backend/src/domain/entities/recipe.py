from pydantic import BaseModel, model_validator, ConfigDict, field_serializer
from datetime import timedelta
from src.domain.exceptions import ValidationError, FrendlyValidationError
from uuid import UUID


class Ingredient(BaseModel):
    name: str
    fats: float
    proteins: float
    carbohydrates: float
    description: str

    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def validator(self):
        if not all([self.fats >= 0, self.proteins >= 0, self.carbohydrates >= 0]):
            raise FrendlyValidationError(
                "nutrients should not be negative",
                fields=["fats", "proteins", "carbohydrates"],
            )
        if self.fats + self.proteins + self.carbohydrates > 100:
            raise FrendlyValidationError(
                "Dimension - how many grams of fat/protein/carbohydrates per 100 grams of product",
                fields=["fats", "proteins", "carbohydrates"],
            )
        return self

    @field_serializer("name")
    def name_serialize(self, name: str):
        return name.lower()


class Tag(BaseModel):
    id: int
    name: str
    model_config = ConfigDict(from_attributes=True)


class RecipeStepIngredient(BaseModel):
    ingredient: Ingredient
    quantity: float
    model_config = ConfigDict(from_attributes=True)


class RecipeStep(BaseModel):
    step_number: int
    image_path: str | None = None
    time_seconds: int
    description: str
    ingredients: list[RecipeStepIngredient]
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def validator(self):
        if self.step_number < 0:
            raise ValidationError(fields=["number"])
        return self


class Recipe(BaseModel):
    uuid: UUID
    name: str
    country: str | None
    difficulty: int
    views: int
    recipe_steps: list[RecipeStep]
    tags: list[Tag]
    image_path: str
    cost: float
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def validator(self):
        if not (0 <= self.difficulty <= 5):
            raise ValidationError(fields=["difficulty"])
        return self

    @field_serializer("name")
    def name_serialize(self, name: str):
        return name.lower()


class RecipeDisplay(BaseModel):
    uuid: UUID
    name: str
    country: str | None
    difficulty: int
    views: int
    tags: list[Tag] | None = None
    image_path: str
    cost: float
    model_config = ConfigDict(from_attributes=True)

    @model_validator(mode="after")
    def validator(self):
        if not (0 <= self.difficulty <= 5):
            raise ValidationError(fields=["difficulty"])
        return self

    @field_serializer("name")
    def name_serialize(self, name: str):
        return name.lower()


class RecipeSearch(BaseModel):
    name: str | None = None
    difficulty: int | None = None
    country: str | None = None
    total_time_from: timedelta | None = None
    total_time_to: timedelta | None = None
    popular: bool | None = None
    cost: bool | None = None

    model_config = ConfigDict(from_attributes=True)


class Search(BaseModel):
    recipe_search: RecipeSearch
    tags: list[str] | None = None


class IngredientSearch(BaseModel):
    name: str

    @field_serializer("name")
    def serialize(self, name: str):
        return name.lower()
