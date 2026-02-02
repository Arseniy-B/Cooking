from fastapi import FastAPI
from fastadmin import fastapi_app as admin_app
from src.admin_setup import lifespan
from fastapi_pagination import add_pagination


app = FastAPI(lifespan=lifespan)
app.mount("/admin", admin_app)
add_pagination(app)
