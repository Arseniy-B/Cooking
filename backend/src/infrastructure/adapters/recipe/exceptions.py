class BaseRecipeAdapterError(Exception):
    pass


class RecipeNotFoundError(BaseRecipeAdapterError):
    pass


class RecordExistError(BaseRecipeAdapterError):
    pass
