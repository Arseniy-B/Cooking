from src.domain.ports.recipe import RecipePort
from src.domain.entities.recipe import Recipe as RecipeSchema, RecipeSearch
from src.infrastructure.services.db.models import Recipe, RecipeStep, Ingredient, RecipeStepIngredient
from src.infrastructure.services.db.db import AsyncSession
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import apaginate
from fastapi_pagination import Params
from sqlalchemy import select, desc, and_, func, or_, Select
from sqlalchemy.orm import selectinload


class RecipeAdapter(RecipePort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def match_recipe(self, search: RecipeSearch, page: int = 1, size: int = 20) -> list[RecipeSchema]:
        stmt = await self._get_main_stmt()
        db_recipes = await apaginate(self.session, stmt, params=Params(page=page, size=size))
        return [RecipeSchema.model_validate(recipe) for recipe in db_recipes.items]

    async def _get_main_stmt(self) -> Select:
        stmt = (
            select(Recipe)
            .options(
                selectinload(Recipe.recipe_steps).options(
                    selectinload(RecipeStep.ingredients).options(
                        selectinload(RecipeStepIngredient.ingredient)
                    )
                )
            )
            .order_by(Recipe.name)
        )
        return stmt

    async def _add_name_to_search(self, stmt: Select):
        ...
        
