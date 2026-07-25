from config.settings import settings

def test_settings_load():
    assert settings.APP_NAME == "ARGUS - Intelligence & Investigation Platform"
    assert settings.PORT == 8000
    assert settings.JWT_ALGORITHM == "HS256"
    assert settings.REQUIRE_EXPLANATION_SHAP is True
    assert settings.AUDIT_LOG_IMMUTABLE is True

def test_database_urls():
    pg_url = settings.get_postgres_url()
    assert "postgresql+asyncpg://" in pg_url
    assert settings.POSTGRES_DB in pg_url
