from pydantic_settings import BaseSettings, SettingsConfigDict


class PydanticSettings(BaseSettings):
    POSTGRES_URL: str = ""
    LOGGING: str = "error"

    JWT_SECRET: str = "your_secret_key"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 12
    ALGORITHM = "HS256"

    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_CHAT_ID: str = ""

    admin_login: str = "admin"
    admin_password: str = "admin"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = PydanticSettings()
