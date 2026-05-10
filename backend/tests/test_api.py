from app.config import USERNAME, PASSWORD
from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


# Helper function to get auth header for tests

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

# Test document upload, listing and deletion

def test_upload_valid_text_file():
    res = client.post(
        "/api/documents",
        files={"file": ("test.txt", b"This is a test case file.", "text/plain")},
        headers=auth_header(),
    )
    assert res.status_code == 200
    assert res.json()["filename"] == "test.txt"

def test_list_documents():
    res = client.get("/api/documents", headers=auth_header())
    assert res.status_code == 200
    assert "documents" in res.json()


def test_delete_document():
    res = client.delete("/api/documents/test.txt", headers=auth_header())
    assert res.status_code == 200
    assert res.json()["deleted"] == "test.txt"


def test_delete_nonexistent_document():
    res = client.delete("/api/documents/ghost.txt", headers=auth_header())
    assert res.status_code == 404


def test_empty_question():
    res = client.post(
        "/api/query",
        json={"question": ""},
        headers=auth_header(),
    )
    assert res.status_code == 400


def test_valid_question():
    res = client.post(
        "/api/query",
        json={"question": "Who are the suspects in the Silver Hollow case?"},
        headers=auth_header(),
    )
    assert res.status_code == 200
    assert "answer" in res.json()
    assert len(res.json()["answer"]) > 0