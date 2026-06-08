"""
JsonProfileRepository — ProfileRepository backed by a single profiles.json file.

Thread-safe for concurrent reads; uses a lock for writes (append).
Replace this class with SqlProfileRepository to migrate to a database without
touching any route or service code.
"""
import json
import threading
from pathlib import Path

from app.models import Profile

_SENTINEL = object()


class JsonProfileRepository:
    def __init__(self, path: Path) -> None:
        self._path = path
        self._lock = threading.Lock()
        self._cache: dict[str, Profile] | None = None
        self._contact_email: str | None = None

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _load(self) -> dict[str, Profile]:
        if self._cache is None:
            with open(self._path, encoding="utf-8") as f:
                raw = json.load(f)
            self._contact_email = raw.get("contact_email", "")
            self._cache = {p["id"]: Profile(**p) for p in raw["profiles"]}
        return self._cache

    def _invalidate(self) -> None:
        self._cache = None
        self._contact_email = None

    # ------------------------------------------------------------------
    # ProfileRepository interface
    # ------------------------------------------------------------------

    def get_all(self) -> list[Profile]:
        return list(self._load().values())

    def get_by_id(self, profile_id: str) -> Profile | None:
        return self._load().get(profile_id)

    def id_exists(self, profile_id: str) -> bool:
        return profile_id in self._load()

    def get_contact_email(self) -> str:
        self._load()  # ensure loaded
        return self._contact_email or ""

    def append(self, profile: Profile) -> None:
        """Persist a new profile. Raises ValueError on duplicate id."""
        with self._lock:
            self._invalidate()
            try:
                with open(self._path, encoding="utf-8") as f:
                    data = json.load(f)
            except FileNotFoundError:
                data = {"contact_email": "", "profiles": []}

            if any(p["id"] == profile.id for p in data["profiles"]):
                raise ValueError(f"Profile id '{profile.id}' already exists")

            data["profiles"].append(json.loads(profile.model_dump_json()))

            with open(self._path, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
