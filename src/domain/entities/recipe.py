from pydantic import BaseModel, model_validator
from datetime import timedelta
from pathlib import Path
from src.domain.exceptions import ValidationError, FrendlyValidationError


class Nutrients(BaseModel):
    fats: float
    proteins: float
    carbohydrates: float

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


class Ingredient(BaseModel):
    name: str
    descriptions: str
    nutrients: Nutrients


class RecipeIngredient:
    ingredient: Ingredient
    quantity: float


class RecipeStep(BaseModel):
    number: int
    description: str
    time: timedelta
    ingredients: list[RecipeIngredient]
    image: Path | None = None

    @model_validator(mode="after")
    def validator(self):
        if self.number < 0:
            raise ValidationError(fields=["number"])
        return self


class Recipe(BaseModel):
    id: int
    name: str
    difficulty: int
    country: str | None
    steps: list[RecipeStep]

    @model_validator(mode="after")
    def validator(self):
        if 0 > self.difficulty > 5:
            raise ValidationError(fields=["difficulty"])
        return self
