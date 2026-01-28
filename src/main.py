from fastapi import FastAPI
from src.admin_setup import admin

app = FastAPI()
app.mount("/admin", admin.app)
