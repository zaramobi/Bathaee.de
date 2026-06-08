from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, EmailStr


class Personal(BaseModel):
    name: str
    title: str
    tagline: str
    email: str
    phone: str
    location: str
    linkedin: str
    github: str
    website: str
    avatarUrl: str = ""


class ExperienceItem(BaseModel):
    id: str
    company: str
    role: str
    type: str
    start: str
    end: Optional[str]
    current: bool
    location: str
    description: str
    bullets: list[str]
    skills: list[str]


class EducationItem(BaseModel):
    institution: str
    degree: str
    field: str
    start: str
    end: str


class Certification(BaseModel):
    name: str
    issuer: str


class Award(BaseModel):
    title: str
    issuer: str
    date: str
    description: str


class Language(BaseModel):
    language: str
    level: str


class Profile(BaseModel):
    id: str
    cardId: str
    personal: Personal
    summary: str
    experience: list[ExperienceItem]
    skills: dict[str, list[str]]
    education: list[EducationItem]
    certifications: list[Certification]
    awards: list[Award]
    languages: list[Language]


class ProfileMeta(BaseModel):
    """Lightweight card — returned by GET /api/profiles."""
    id: str
    name: str
    title: str
    tagline: str
    location: str
    avatarUrl: str
    summary: str
    topSkills: list[str]


# ── Contact form ──────────────────────────────────────────────────────────────

class ContactMessage(BaseModel):
    email: EmailStr
    subject: str
    message: str


class ContactResponse(BaseModel):
    success: bool
    detail: str
