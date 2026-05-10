from app.config import USERNAME, PASSWORD
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def auth_header():
    return {"Authorization": "Bearer sherlock-token"}


def test_login_success():
    res = client.post(
        "/api/auth/login", json={"username": USERNAME, "password": PASSWORD}
    )
    assert res.status_code == 200
    assert res.json()["token"] == "sherlock-token"


def test_login_wrong_password():
    res = client.post(
        "/api/auth/login", json={"username": "detective", "password": "wrong"}
    )
    assert res.status_code == 401


def test_protected_route_without_token():
    res = client.get("/api/documents")
    assert res.status_code == 422