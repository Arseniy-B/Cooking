class BaseRecipeAdapterError(Exception):
    pass

class RecipeNotFoundError(BaseRecipeAdapterError):
    pass


class BasketExistError(BaseRecipeAdapterError):
    pass
