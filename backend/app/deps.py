"""
Dependency injection wiring.

To swap the storage backend, change the repository constructor below.
To swap the email provider, change build_email_service() or set env vars.
Everything above (service, routes) is unaffected.
"""
import os
from pathlib import Path

from app.repositories.json_repo import JsonProfileRepository
from app.services.profile_service import ProfileService
from app.services.email_service import EmailService, build_email_service

_repo_default       = Path(__file__).parent.parent.parent / "data" / "profiles.json"
_container_default  = Path("/data/profiles.json")

_PROFILES_PATH = Path(
    os.getenv(
        "PROFILES_JSON_PATH",
        str(_container_default) if _container_default.exists() else str(_repo_default),
    )
)

_repository    = JsonProfileRepository(_PROFILES_PATH)
_service       = ProfileService(_repository)
_email_service = build_email_service()


def get_service() -> ProfileService:
    return _service


def get_email_service() -> EmailService:
    return _email_service
