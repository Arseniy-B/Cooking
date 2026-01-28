from pydantic import BaseModel


class IngredientCreate(BaseModel):
    name: str
    fats: float 
    proteins: float
    carbohydrates: float
    descriptions: float


class IngredientUpdate(BaseModel):
    fats: float 
    proteins: float
    carbohydrates: float
    descriptions: float
