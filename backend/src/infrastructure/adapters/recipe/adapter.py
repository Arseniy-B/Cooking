from uuid import UUID

from fastapi_pagination import Params
from fastapi_pagination.ext.sqlalchemy import apaginate
from sqlalchemy import Select, asc, desc, func, select
from sqlalchemy.orm import selectinload

from src.domain.entities.recipe import (
    Ingredient as IngredientSchema,
)
from src.domain.entities.recipe import IngredientSearch, RecipeSearch
from src.domain.entities.recipe import (
    Recipe as RecipeSchema,
)
from src.domain.entities.recipe import (
    RecipeDisplay as RecipeDisplaySchema,
)
from src.domain.entities.recipe import Tag as TagsSchema
from src.domain.ports.recipe import BasketPort, PurchasePort, RecipePort
from src.infrastructure.adapters.recipe.exceptions import (
    RecipeNotFoundError,
    RecordExistError,
)
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import (
    Basket,
    Ingredient,
    PurchasedRecipes,
    Recipe,
    RecipeStep,
    RecipeStepIngredient,
    Tag,
    User,
)


class RecipeAdapter(RecipePort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def match_recipe(
        self,
        search: RecipeSearch,
        tags: list[str] | None = None,
        page: int = 1,
        size: int = 20,
    ) -> list[RecipeDisplaySchema]:
        stmt = select(Recipe).options(selectinload(Recipe.tags))
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
        if tags:
            stmt = stmt.where(Recipe.tags.any(Tag.name.in_(tags)))

        if order_by_classes:
            stmt = stmt.order_by(*order_by_classes)
        db_recipes = await apaginate(
            self.session, stmt, params=Params(page=page, size=size)
        )
        return [
            RecipeDisplaySchema.model_validate(recipe.__dict__)
            for recipe in db_recipes.items
        ]

    async def get_full_recipe(self, recipe_uuid: UUID) -> RecipeSchema:
        stmt = self._get_main_stmt().where(Recipe.uuid == recipe_uuid)
        recipe = await self.session.scalar(stmt)
        if not recipe:
            raise RecipeNotFoundError
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

    async def get_tag(self, name: str) -> list[TagsSchema]:
        if name:
            stmt = (
                select(Tag)
                .where(Tag.name.op("%")(name))
                .order_by(func.similarity(Tag.name, name).desc())
            )
        else:
            stmt = select(Tag)
        ans = await self.session.execute(stmt)
        tags = ans.scalars()
        return [TagsSchema.model_validate(i.__dict__) for i in tags]


class BasketAdapter(BasketPort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def add_to_basket(self, recipe_uuid: UUID, user_uuid: UUID):
        res = await self.session.execute(
            select(Recipe).where(Recipe.uuid == recipe_uuid)
        )
        recipe = res.scalar_one_or_none()

        if not recipe:
            raise RecipeNotFoundError

        stmt = select(Basket).where(
            Basket.user_uuid == user_uuid, Basket.recipe_uuid == recipe_uuid
        )
        res = await self.session.execute(stmt)
        exist_basket_recipe = res.scalar_one_or_none()
        if exist_basket_recipe:
            raise RecordExistError

        basket = Basket(user_uuid=user_uuid, recipe_uuid=recipe_uuid)
        self.session.add(basket)
        await self.session.commit()

    async def remove_from_basket(self, recipe_uuid: UUID, user_uuid: UUID):
        basket = await self.session.scalar(
            select(Basket).where(
                Basket.recipe_uuid == recipe_uuid, Basket.user_uuid == user_uuid
            )
        )
        if not basket:
            raise RecipeNotFoundError

        await self.session.delete(basket)
        await self.session.commit()

    async def get_user_basket(
        self, user_uuid: UUID, page: int, size: int
    ) -> list[RecipeDisplaySchema]:
        stmt = select(Recipe).join(Basket).where(Basket.user_uuid == user_uuid)
        db_recipes = await apaginate(
            self.session, stmt, params=Params(page=page, size=size)
        )
        return [
            RecipeDisplaySchema.model_validate(i.__dict__) for i in db_recipes.items
        ]


class PurchaseAdapter(PurchasePort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_purchased(
        self, user_uuid: UUID, page: int, size: int
    ) -> list[RecipeDisplaySchema]:
        stmt = (
            select(Recipe)
            .join(PurchasedRecipes)
            .where(PurchasedRecipes.user_uuid == user_uuid)
        )
        db_recipes = await apaginate(
            self.session, stmt, params=Params(page=page, size=size)
        )
        return [
            RecipeDisplaySchema.model_validate(i.__dict__) for i in db_recipes.items
        ]

    async def buy_recipe(self, user_uuid: UUID, recipe_uuid: UUID):
        async with self.session.begin():
            user = await self.session.scalar(
                select(User).where(User.uuid == user_uuid).with_for_update()
            )
            if not user:
                raise
            recipe = await self.session.scalar(
                select(Recipe).where(Recipe.uuid == recipe_uuid)
            )
            if not recipe:
                raise
            if user.balance < recipe.cost:
                raise
            exist_purchased_recipe = await self.session.scalar(
                select(PurchasedRecipes).where(
                    PurchasedRecipes.user_uuid == user_uuid,
                    PurchasedRecipes.recipe_uuid == recipe_uuid,
                )
            )
            if exist_purchased_recipe:
                raise

            user.balance -= recipe.cost
            self.session.add(
                PurchasedRecipes(user_uuid=user_uuid, recipe_uuid=recipe_uuid)
            )
