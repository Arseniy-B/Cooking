from uuid import UUID

from fastapi_pagination import Params
from fastapi_pagination.ext.sqlalchemy import apaginate
from sqlalchemy import Select, asc, desc, func, select
from sqlalchemy.orm import selectinload

from src.domain.entities.recipe import Ingredient as IngredientSchema
from src.domain.entities.recipe import IngredientSearch, RecipeSearch
from src.domain.entities.recipe import Recipe as RecipeSchema
from src.domain.entities.recipe import RecipeDisplay as RecipeDisplaySchema
from src.domain.ports.recipe import RecipePort
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import (
    Ingredient,
    Recipe,
    RecipeStep,
    RecipeStepIngredient,
)


class RecipeAdapter(RecipePort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def match_recipe(
        self, search: RecipeSearch, page: int = 1, size: int = 20
    ) -> list[RecipeDisplaySchema]:
        stmt = select(Recipe)
        order_by_classes = []
        if search.name:
            stmt = stmt.where(Recipe.name.ilike(f"%{search.name}%"))
            order_by_classes.append(func.similarity(Recipe.name, search.name).desc())
        if search.popular is not None:
            order_by_classes.append(
                desc(Recipe.views) if search.popular else asc(Recipe.views)
            )
        if search.cost is not None:
            order_by_classes.append(
                desc(Recipe.cost) if search.cost else asc(Recipe.cost)
            )

        if order_by_classes:
            stmt = stmt.order_by(*order_by_classes)
        db_recipes = await apaginate(
            self.session, stmt, params=Params(page=page, size=size)
        )
        return [
            RecipeDisplaySchema.model_validate(recipe) for recipe in db_recipes.items
        ]

    async def get_full_recipe(self, recipe_uuid: UUID) -> RecipeSchema:
        stmt = self._get_main_stmt().where(Recipe.uuid == recipe_uuid)
        ans = await self.session.execute(stmt)
        recipe = ans.scalar_one()
        recipe.views += 1
        await self.session.commit()
        return RecipeSchema.model_validate(recipe)

    def _get_main_stmt(self) -> Select:
        stmt = select(Recipe).options(
            selectinload(Recipe.recipe_steps).options(
                selectinload(RecipeStep.ingredients).options(
                    selectinload(RecipeStepIngredient.ingredient)
                )
            )
        )
        return stmt

    async def get_ingredients(
        self, search: IngredientSearch, page: int = 1, size: int = 20
    ) -> list[IngredientSchema]:
        stmt = (
            select(Ingredient)
            .where(Ingredient.name.op("%")(search.name))
            .order_by(func.similarity(Ingredient.name, search.name).desc())
        )
        db_ingredients = await apaginate(
            self.session, stmt, params=Params(page=page, size=size)
        )
        ingredients = [
            IngredientSchema.model_validate(i.__dict__) for i in db_ingredients.items
        ]
        return ingredients
