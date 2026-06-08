from app.models import Profile, ProfileMeta
from app.repositories.base import ProfileRepository

_TOP_SKILLS_COUNT = 8


def _top_skills(profile: Profile) -> list[str]:
    result: list[str] = []
    for items in profile.skills.values():
        result.extend(items)
        if len(result) >= _TOP_SKILLS_COUNT:
            break
    return result[:_TOP_SKILLS_COUNT]


class ProfileService:
    def __init__(self, repo: ProfileRepository) -> None:
        self._repo = repo

    def list_meta(self) -> list[ProfileMeta]:
        return [
            ProfileMeta(
                id=p.id,
                name=p.personal.name,
                title=p.personal.title,
                tagline=p.personal.tagline,
                location=p.personal.location,
                avatarUrl=p.personal.avatarUrl,
                summary=p.summary,
                topSkills=_top_skills(p),
            )
            for p in self._repo.get_all()
        ]

    def get_profile(self, profile_id: str) -> Profile | None:
        return self._repo.get_by_id(profile_id)

    def get_contact_email(self) -> str:
        return self._repo.get_contact_email()
