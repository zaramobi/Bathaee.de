"""
ProfileRepository — the single abstraction between the API and any data store.

Swap JsonProfileRepository for SqlProfileRepository (or any other) and the
routes + service layer require zero changes.
"""
from typing import Protocol, runtime_checkable
from app.models import Profile


@runtime_checkable
class ProfileRepository(Protocol):
    def get_all(self) -> list[Profile]: ...
    def get_by_id(self, profile_id: str) -> Profile | None: ...
    def id_exists(self, profile_id: str) -> bool: ...
    def append(self, profile: Profile) -> None: ...
    def get_contact_email(self) -> str: ...
