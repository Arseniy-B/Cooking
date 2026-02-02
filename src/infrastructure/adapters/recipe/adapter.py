from src.domain.ports.recipe import RecipePort
from src.domain.entities.recipe import Recipe as RecipeSchema, RecipeSearch
from src.infrastructure.services.db.models import Recipe, RecipeStep, Ingredient, RecipeStepIngredient
from src.infrastructure.services.db.db import AsyncSession
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select, desc, and_, func, or_
from sqlalchemy.orm import selectinload


class RecipeAdapter(RecipePort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def match_recipe(self, search: RecipeSearch) -> Page[list[RecipeSchema]]:
        return None

    async def _match_recipe(self, search: RecipeSearch) -> Page[Recipe]:
        stmt = self._build_base_stmt()

        stmt = self._apply_basic_filters(stmt, search)
        stmt, time_subquery = self._apply_time_filters(stmt, search)
        stmt = self._apply_ingredient_sort(stmt, search, time_subquery)

        stmt = stmt.order_by(desc("match_count"), Recipe.name.asc())

        return await paginate(self.session, stmt)

    def _build_base_stmt(self):
        return (
            select(Recipe)
            .distinct()
            .options(
                selectinload(Recipe.steps).selectinload(RecipeStep.ingredients)
            )
        )

    def _apply_basic_filters(self, stmt, search: RecipeSearch):
        where_clauses = []

        if search.name:
            where_clauses.append(Recipe.name.ilike(f"%{search.name}%"))

        if search.difficulty is not None:
            where_clauses.append(Recipe.difficulty == search.difficulty)

        if search.country:
            where_clauses.append(Recipe.country.ilike(f"%{search.country}%"))

        if where_clauses:
            stmt = stmt.where(and_(*where_clauses))

        return stmt

    def _apply_time_filters(self, stmt, search: RecipeSearch):
        time_subquery = None
        where_clauses = []

        if search.total_time_from or search.total_time_to:
            total_time = func.sum(RecipeStep.time).label("total_time")

            time_subquery = (
                select(
                    RecipeStep.recipe_id,
                    total_time,
                )
                .group_by(RecipeStep.recipe_id)
                .subquery()
            )

            stmt = stmt.outerjoin(
                time_subquery, Recipe.id == time_subquery.c.recipe_id
            )

            if search.total_time_from:
                where_clauses.append(
                    time_subquery.c.total_time >= search.total_time_from
                )

            if search.total_time_to:
                where_clauses.append(
                    time_subquery.c.total_time <= search.total_time_to
                )

        if where_clauses:
            stmt = stmt.where(and_(*where_clauses))

        return stmt, time_subquery

    def _apply_ingredient_sort(self, stmt, search: RecipeSearch, time_subquery):
        if not search.ingredients or not len(search.ingredients):
            return stmt

        ingredient_conditions = []
        names = []
        
        for req in search.ingredients:
            if not req.ingredient.name:
                continue
            min_qty = req.quantity if req.quantity is not None else 0.0
            ingredient_conditions.append(
                and_(
                    Ingredient.name == req.ingredient.name,
                    StepIngredient.quantity >= min_qty
                )
            )
            names.append(req.ingredient.name)

        if not ingredient_conditions:
            return stmt

        match_cte = (
            select(
                RecipeStep.recipe_id,
                func.count(func.distinct(Ingredient.name)).label("match_count")
            )
            .join(StepIngredient, RecipeStep.id == StepIngredient.step_id)
            .join(Ingredient, StepIngredient.ingredient_id == Ingredient.id)
            .where(
                Ingredient.name.in_(names),
                or_(*ingredient_conditions)   
            )
            .group_by(RecipeStep.recipe_id)
            .cte("match_counts")
        )

        stmt = stmt.outerjoin(
            match_cte,
            Recipe.id == match_cte.c.recipe_id
        )

        stmt = stmt.add_columns(
            func.coalesce(match_cte.c.match_count, 0).label("match_count")
        )

        stmt = stmt.order_by(
            desc("match_count"),
            Recipe.name.asc()
        )

        return stmt
