from pydantic_settings import BaseSettings, SettingsConfigDict


class PydanticSettings(BaseSettings):
    postgres_url: str = ""
    logging: str = "error"
    jwt_secret: str = "your_secret_key"
    access_token_expire_minutes: int = 60 * 12

    admin_login: str = "admin"
    admin_password: str = "admin"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = PydanticSettings()
