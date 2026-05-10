from fastapi import Header, HTTPException

from .config import USERNAME, PASSWORD


TOKEN = "sherlock-token"


def login(username, password):
    if username != USERNAME or password != PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": TOKEN}


def require_authentication(authorization: str = Header(...)):
    if authorization != f"Bearer {TOKEN}":
        raise HTTPException(status_code=401, detail="Unauthorized")