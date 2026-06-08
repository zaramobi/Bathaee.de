export interface Personal {
  name: string;
  title: string;
  tagline: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  avatarUrl: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  type: string;
  start: string;
  end: string | null;
  current: boolean;
  location: string;
  description: string;
  bullets: string[];
  skills: string[];
}

export interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
}

export interface Certification {
  name: string;
  issuer: string;
}

export interface Award {
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface Language {
  language: string;
  level: string;
}

export interface Profile {
  id: string;
  cardId: string;
  personal: Personal;
  summary: string;
  experience: ExperienceItem[];
  skills: Record<string, string[]>;
  education: EducationItem[];
  certifications: Certification[];
  awards: Award[];
  languages: Language[];
}

/** Lightweight shape returned by GET /api/profiles — used for team cards. */
export interface ProfileMeta {
  id: string;
  name: string;
  title: string;
  tagline: string;
  location: string;
  avatarUrl: string;
  summary: string;
  topSkills: string[];
}

// ── Contact form ─────────────────────────────────────────────────────────────

export interface ContactMessage {
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  detail: string;
}
