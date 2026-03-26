from fastadmin import fastapi_app as admin_app
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi_pagination import add_pagination

from src.admin_setup import lifespan
from src.config import RECIPES_MEDIA_DIR
from src.handlers.api.v1.recipe import router as recipe_router


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.mount("/media", StaticFiles(directory=RECIPES_MEDIA_DIR), name="media")
app.mount("/admin", admin_app)
add_pagination(app)
app.include_router(recipe_router)
