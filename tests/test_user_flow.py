from fastapi.testclient import TestClient


def test_register_happy_path(client: TestClient) -> None:
    response = client.post("/api/register", json={
        "email": "test@test.com",
        "username": "testuser",
        "password": "Testpassword1234!",
        "first_name": "Test",
        "last_name": "User",
        "gender": "male",
        "user_type": "producer",
    })
    assert response.status_code == 201
    data = response.json()
    assert "id" in data
    assert data["username"] == "testuser"
    assert "created_at" in data
    assert data["user_type"] == "producer"


def test_register_password_too_weak(client: TestClient) -> None:
    response = client.post("/api/register", json={
        "email": "test2@test.com",
        "username": "testuser2",
        "password": "qw",
        "first_name": "Test",
        "last_name": "User",
        "gender": "male",
        "user_type": "producer",
    })
    assert response.status_code == 400
    assert response.json()["detail"] == "Password too weak"


def test_register_username_already_taken(client: TestClient) -> None:
    response = client.post("/api/register", json={
        "email": "test@test.com",
        "username": "testuser",
        "password": "Testpassword1234!",
        "first_name": "Test",
        "last_name": "User",
        "gender": "male",
        "user_type": "producer",
    })

    response = client.post("/api/register", json={
        "email": "test3@test.com",
        "username": "testuser",
        "password": "Testpassword1234!",
        "first_name": "Test",
        "last_name": "User",
        "gender": "male",
        "user_type": "producer",
    })
    assert response.status_code == 409
    assert response.json()["detail"] == "Username taken"