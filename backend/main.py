from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import profile, contact

app = FastAPI(
    title="bathaee.de — Portfolio API",
    description="REST API for the freelance team portfolio. "
                "Backed by JsonProfileRepository — swap for SqlProfileRepository to migrate to DB.",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(profile.router, prefix="/api")
app.include_router(contact.router, prefix="/api")


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}
