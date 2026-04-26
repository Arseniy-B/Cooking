from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

from pathlib import Path


BASE_DIR = Path(__file__).parent.parent

MEDIA_DIR = BASE_DIR / "src" / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)
RECIPES_MEDIA_DIR = MEDIA_DIR / "recipes"
RECIPES_MEDIA_DIR.mkdir(parents=True, exist_ok=True)
USERS_MEDIA_DIR = MEDIA_DIR / "users"
USERS_MEDIA_DIR.mkdir(parents=True, exist_ok=True)


class PostgresSettings(BaseSettings):
    DB_HOST: str = "localhost"
    DB_PORT: str = "5432"
    DB_USER: str = "user"
    DB_PASS: str = "password"
    DB_NAME: str = "name"

    db_echo: bool = False

    @property
    def DATABASE_URL(self):
        url = f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@/{self.DB_NAME}?host={self.DB_HOST}&port={self.DB_PORT}"
        return url
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


class RedisSettings(BaseSettings):
    REDIS_HOST: str = "localhost"
    REDIS_PORT: str = "6379"

    @property
    def get_url(self):
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/0"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


class AdminPanel(BaseSettings):
    ADMIN_PASSWORD: str = "admin"
    ADMIN_USERNAME: str = "admin"
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


class Config(BaseModel):
    db: PostgresSettings = PostgresSettings()
    admin_panel: AdminPanel = AdminPanel()
    redis: RedisSettings = RedisSettings()


config = Config()
