from typing import ClassVar

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class PydanticSettings(BaseSettings):
    POSTGRES_URL: str = ""
    LOGGING: str = "INFO"

    JWT_SECRET: SecretStr = SecretStr('your_secret_key')
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 12
    ALGORITHM: ClassVar[str] = "HS256"

    TELEGRAM_BOT_TOKEN: SecretStr = SecretStr("")
    TELEGRAM_CHAT_ID: str = ""

    admin_login: str = "admin"
    admin_password: str = "admin"

    DEV_MODE: bool = False

    BPAY_DEV_MODE: bool = False

    BPAY_SECRET_KEY: SecretStr = SecretStr("")
    BPAY_MERCHANT_ID: SecretStr = SecretStr("")
    BPAY_SERVER_URL: str = "https://pay.bpay.md/"

    DEV_BPAY_SECRET_KEY: SecretStr = SecretStr("xPm40k96")
    DEV_BPAY_MERCHANT_ID: SecretStr = SecretStr("testMerchant44")
    DEV_BPAY_SERVER_URL: str = "https://pay.dev5.bpay.md/"


    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8"
    )


settings = PydanticSettings()
