import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from .auth import login
from .routes import documents, query

app = FastAPI(title="Sherlock Backend API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/api/auth/login")
def auth_login(req: LoginRequest):
    return login(req.username, req.password)


app.include_router(documents.router, prefix="/api")
app.include_router(query.router, prefix="/api")


# to runn the frontend from the same container as static files, must be mounted last
if os.path.exists("static"):
    app.mount("/", StaticFiles(directory="static", html=True), name="static")
