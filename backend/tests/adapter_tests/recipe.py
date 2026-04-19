from src.infrastructure.adapters.recipe.adapter import RecipeAdapter
from src.infrastructure.services.db.db import db_helper, AsyncSession
from src.infrastructure.services.db.models import Ingredient, RecipeStep, RecipeStepIngredient, Recipe
from src.domain.entities.recipe import RecipeSearch, Ingredient as IngredientSchema
import pytest
import pytest_asyncio


@pytest_asyncio.fixture
async def session():
    async with db_helper.engine.connect() as connection:
        async with connection.begin() as outer_transaction:
            session = AsyncSession(
                bind=connection,
                expire_on_commit=False,
                join_transaction_mode = "create_savepoint"
            )
            try:
                yield session
            finally:
                await outer_transaction.rollback()
                await session.close()
                await connection.close()


@pytest.mark.asyncio
async def test_success(session: AsyncSession):
    ing1 = Ingredient(name="томат", fats=0.2, proteins=0.9, carbohydrates=3.9, description="")
    ing2 = Ingredient(name="курица", fats=3.6, proteins=27.5, carbohydrates=0.0, description="")
    session.add_all([ing1, ing2])
    await session.flush()

    recipe1 = Recipe(name="Салат", difficulty=2, country="Италия")
    recipe2 = Recipe(name="Куриный суп", difficulty=3, country="")
    session.add_all([recipe1, recipe2])
    await session.flush()

    step1 = RecipeStep(recipe=recipe1, step_number=1, time_seconds=300, image_path="", description="...")
    step2 = RecipeStep(recipe=recipe2, step_number=1, time_seconds=1200, image_path="", description="...")
    session.add_all([step1, step2])
    await session.flush()

    si1 = RecipeStepIngredient(recipe_step=step1, ingredient=ing1, quantity=200)
    si2 = RecipeStepIngredient(recipe_step=step2, ingredient=ing2, quantity=300)
    session.add_all([si1, si2])
    await session.commit()

    search = RecipeSearch(name="томат")
    recipe_adapter = RecipeAdapter(session)
    ans = await recipe_adapter.match_recipe(search)
    
    assert len(ans) == 2
