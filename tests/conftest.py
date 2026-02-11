import asyncio

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import init_db, drop_db


@pytest.fixture(scope="session")
def setup_test_db() -> None:
    asyncio.run(init_db())
    yield
    asyncio.run(drop_db())


@pytest.fixture(scope="session")
def client(setup_test_db: None) -> TestClient:
    with TestClient(app) as c:
        yield c