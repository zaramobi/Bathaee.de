import { Profile, ProfileMeta, ContactMessage, ContactResponse } from "@/types/profile";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    next: { revalidate: 3600 },
    ...options,
  });
  if (!res.ok) {
    let detail = `API ${path} → ${res.status}`;
    try {
      const body = await res.json();
      if (body?.detail) detail = body.detail;
    } catch {}
    throw new Error(detail);
  }
  return res.json() as Promise<T>;
}

// ── Read ──────────────────────────────────────────────────────────────────────

export const getProfiles = () =>
  apiFetch<ProfileMeta[]>("/api/profiles");

export const getProfile = (id: string) =>
  apiFetch<Profile>(`/api/profiles/${id}`);

// ── Contact ───────────────────────────────────────────────────────────────────
//
// Uses a RELATIVE path ("/api/contact") so the request goes to the Next.js
// route handler (frontend/src/app/api/contact/route.ts), which proxies it to
// FastAPI.  This avoids the "Failed to fetch" error that occurs when the
// browser tries to reach the Docker-internal hostname (http://backend:8000)
// directly.

export async function sendContactMessage(msg: ContactMessage): Promise<ContactResponse> {
  const res = await fetch("/api/contact", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify(msg),
    cache:   "no-store",
  });

  let data: ContactResponse;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Contact form failed (${res.status})`);
  }

  if (!res.ok) {
    throw new Error(data?.detail ?? `Contact form failed (${res.status})`);
  }

  return data;
}
