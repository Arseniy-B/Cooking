class BaseRecipeAdapterError(Exception):
    pass


class RecipeNotFoundError(BaseRecipeAdapterError):
    pass


class RecipeAlreadyBasketedError(BaseRecipeAdapterError):
    pass


class RecipeAlreadyPurchasedError(BaseRecipeAdapterError):
    pass


class InsufficientFundsError(BaseRecipeAdapterError):
    pass
