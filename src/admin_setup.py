from crudadmin import CRUDAdmin
from src.infrastructure.services.db.db import db_helper
from src.infrastructure.services.db.models import Ingredient
from src.infrastructure.adapters.recipe.schemas import IngredientCreate, IngredientUpdate


admin = CRUDAdmin(
    session=db_helper.get_session,
    SECRET_KEY="your-secret-key-here",
    initial_admin={
        "username": "admin",
        "password": "secure_password123"
    }
)

admin.add_view(
    model=Ingredient,
    create_schema=IngredientCreate,
    update_schema=IngredientUpdate,
    allowed_actions={"view", "create", "update", "delete"}
)
