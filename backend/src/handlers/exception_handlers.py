from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse
from starlette import status

from src.infrastructure.adapters.auth.exceptions import NotAuthenticatedError
from src.infrastructure.adapters.user.exceptions import UserNotFoundError
from src.infrastructure.adapters.recipe.exceptions import (
    InsufficientFundsError,
    RecipeAlreadyPurchasedError,
    RecipeNotFoundError
)

async def not_found_handler(_: Request, __: Exception):
    return JSONResponse(
        status_code=status.HTTP_404_NOT_FOUND,
        content={"detail": "sourse not found"}
    )

async def insufficient_funds_handler(_: Request, __: Exception):
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"detail": "Insufficient funds"},
    )


async def recipe_already_purchased_handler(_: Request, __: Exception):
    return JSONResponse(
        status_code=status.HTTP_409_CONFLICT,
        content={"detail": "Recipe already purchased"},
    )

async def not_authenticated_handler(_: Request, __: Exception):
    return JSONResponse(
        status_code=status.HTTP_401_UNAUTHORIZED,
        content={"detail": "you are unauthorized"}
    )

EXCEPTION_HANDLERS = {
    InsufficientFundsError: insufficient_funds_handler,
    RecipeAlreadyPurchasedError: recipe_already_purchased_handler,
    NotAuthenticatedError: not_authenticated_handler,
    UserNotFoundError: not_found_handler,
    RecipeNotFoundError: not_found_handler
}

def register_exception_handlers(app: FastAPI):
    for exc, handler in EXCEPTION_HANDLERS.items():
        app.add_exception_handler(exc, handler)
