from fastapi import APIRouter, Depends, HTTPException
from app.models import Profile, ProfileMeta
from app.services.profile_service import ProfileService
from app.deps import get_service

router = APIRouter()


@router.get("/profiles", response_model=list[ProfileMeta])
def list_profiles(svc: ProfileService = Depends(get_service)) -> list[ProfileMeta]:
    return svc.list_meta()


@router.get("/profiles/{profile_id}", response_model=Profile)
def get_profile(
    profile_id: str, svc: ProfileService = Depends(get_service)
) -> Profile:
    profile = svc.get_profile(profile_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile
