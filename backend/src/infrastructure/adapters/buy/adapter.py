from uuid import UUID
from sqlalchemy import select
from src.infrastructure.services.db.db import AsyncSession
from src.infrastructure.services.db.models import (
    Recipe,
    PurchasedRecipes,
    User,
)
from src.domain.ports.buy import BuyPort


class BuyAdapter(BuyPort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def buy(self, user_uuid: UUID, recipe_uuid: UUID):
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

    async def get_balance(self, user_uuid: UUID) -> float:
        user = await self.session.scalar(
            select(User).where(User.uuid == user_uuid)
        )
        if not user:
            raise
        return user.balance

