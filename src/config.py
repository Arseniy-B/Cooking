from pydantic import BaseModel
from pydantic_settings import BaseSettings, SettingsConfigDict

from pathlib import Path


BASE_DIR = Path(__file__).parent.parent


class PostgresSettings(BaseSettings):
    DB_HOST: str
    DB_PORT: str
    DB_USER: str
    DB_PASS: str
    DB_NAME: str

    db_echo: bool = True

    @property
    def DATABASE_URL(self):
        return f"postgresql+asyncpg://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


class AdminPanel(BaseSettings):
    ADMIN_PASSWORD: str
    ADMIN_USERNAME: str
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", extra="allow")


class Config(BaseModel):
    db: PostgresSettings = PostgresSettings()  # pyright: ignore
    admin_panel: AdminPanel = AdminPanel()  # pyright: ignore


config = Config()
