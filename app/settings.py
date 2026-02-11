import sys

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str
    test_database_url: str
    secret_key: str
    algorithm: str
    app_env: str

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    def model_post_init(self, __context) -> None:
        if "pytest" in sys.modules:
            object.__setattr__(self, "database_url", self.test_database_url)


settings = Settings()