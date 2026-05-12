from abc import ABC, abstractmethod
from src.domain.entities.recipe import (
    RecipeSearch,
    Recipe,
    IngredientSearch,
    Ingredient,
    RecipeDisplay,
    Tag,
    PurchaseData
)
from uuid import UUID


class RecipePort(ABC):
    @abstractmethod
    async def match_recipe(
        self,
        search: RecipeSearch,
        tags: list[str] | None = None,
        page: int = 1,
        size: int = 20,
    ) -> list[RecipeDisplay]:
        pass

    @abstractmethod
    async def get_ingredients(self, search: IngredientSearch) -> list[Ingredient]:
        pass

    @abstractmethod
    async def get_tag(self, name: str) -> list[Tag]:
        pass


class BasketPort(ABC):
    @abstractmethod
    async def add_to_basket(self, recipe_uuid: UUID, user_uuid: UUID):
        pass

    @abstractmethod
    async def remove_from_basket(self, recipe_uuid: UUID, user_uuid: UUID):
        pass

    @abstractmethod
    async def get_user_basket(
        self, user_uuid: UUID, page: int, size: int
    ) -> list[RecipeDisplay]:
        pass


class PurchasePort(ABC):
    @abstractmethod
    async def get_purchased(
        self, user_uuid: UUID, page: int, size: int
    ) -> list[Recipe]:
        pass

    @abstractmethod
    async def buy_recipe(self, user_uuid: UUID, recipe_uuid: UUID):
        pass

    @abstractmethod
    async def get_purchase_data(self, user_uuid: UUID) -> PurchaseData: 
        pass
