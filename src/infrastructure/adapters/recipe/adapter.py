from src.domain.ports.recipe import RecipePort
from src.domain.entities.recipe import Recipe, RecipeSearch
from src.infrastructure.services.db.models import Recipe as RecipeModel
from src.infrastructure.services.db.db import AsyncSession
from fastapi_pagination import Page
from fastapi_pagination.ext.sqlalchemy import paginate
from sqlalchemy import select

class RecipeAdapter(RecipePort):
    def __init__(self, session: AsyncSession):
        self.session = session

    async def match_recipe(self, search: RecipeSearch) -> Page[list[Recipe]]:
        stmt = select(RecipeModel)
        return await paginate(self.session, stmt) 
