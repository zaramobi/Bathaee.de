#!/usr/bin/env python3
"""
import_profile.py — append a new profile to data/profiles.json.

Usage
-----
  python import_profile.py --cv /path/to/cv.pdf [--linkedin URL]
  python import_profile.py --cv /path/to/cv.pdf --linkedin https://linkedin.com/in/someone
  python import_profile.py --interactive          # guided prompt-by-prompt entry

The script:
  1. Parses the CV PDF (text extraction + heuristic section detection).
  2. Stores the LinkedIn URL as personal.linkedin (no scraping required).
  3. Generates a unique kebab-case id from the candidate's name.
  4. Appends to data/profiles.json; refuses if the id already exists.

Dependencies (all already in backend/.venv):
  pypdf   — text extraction from PDF
  (no external network calls required)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import uuid
from pathlib import Path
from typing import Any

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
REPO_ROOT = Path(__file__).parent
PROFILES_JSON = REPO_ROOT / "data" / "profiles.json"


# ---------------------------------------------------------------------------
# ID generation
# ---------------------------------------------------------------------------

def _slugify(text: str) -> str:
    """Convert a full name to a lowercase kebab-case id. e.g. 'Jane Smith' → 'jane-smith'"""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    return text


def _unique_id(base: str, existing: set[str]) -> str:
    candidate = _slugify(base)
    if candidate not in existing:
        return candidate
    # Append short suffix until unique
    suffix = 2
    while f"{candidate}-{suffix}" in existing:
        suffix += 1
    return f"{candidate}-{suffix}"


# ---------------------------------------------------------------------------
# profiles.json I/O
# ---------------------------------------------------------------------------

def _load_profiles() -> dict[str, Any]:
    if PROFILES_JSON.exists():
        with open(PROFILES_JSON, encoding="utf-8") as f:
            return json.load(f)
    return {"profiles": []}


def _save_profiles(data: dict[str, Any]) -> None:
    with open(PROFILES_JSON, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"\n✓ Saved → {PROFILES_JSON}")


def _existing_ids(data: dict[str, Any]) -> set[str]:
    return {p["id"] for p in data["profiles"]}


# ---------------------------------------------------------------------------
# PDF parsing
# ---------------------------------------------------------------------------

def _extract_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
        reader = PdfReader(str(path))
        return "\n".join(page.extract_text() or "" for page in reader.pages)
    except ImportError:
        sys.exit("pypdf is not installed. Run: pip install pypdf")
    except Exception as exc:
        sys.exit(f"Could not read PDF: {exc}")


def _find_section(text: str, *headers: str) -> str:
    """Return text that follows the first matching section header."""
    pattern = "|".join(re.escape(h) for h in headers)
    parts = re.split(rf"(?im)^\s*(?:{pattern})\s*$", text, maxsplit=2)
    return parts[1].strip() if len(parts) > 1 else ""


def _parse_email(text: str) -> str:
    m = re.search(r"[\w.+-]+@[\w-]+\.[a-zA-Z]{2,}", text)
    return m.group(0) if m else ""


def _parse_phone(text: str) -> str:
    m = re.search(r"(?:\+?\d[\d\s\-().]{7,}\d)", text[:500])
    return m.group(0).strip() if m else ""


def _parse_linkedin(text: str) -> str:
    m = re.search(r"https?://(?:www\.)?linkedin\.com/in/[\w-]+/?", text)
    return m.group(0) if m else ""


def _parse_name_title(text: str) -> tuple[str, str]:
    """Best-effort: first non-empty line is the name, second is the title."""
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    name = lines[0] if lines else ""
    title = lines[1] if len(lines) > 1 else ""
    return name, title


def _parse_experience(section_text: str) -> list[dict[str, Any]]:
    """
    Heuristically split the experience section into job entries.
    Each entry is separated by a blank line or a line that looks like a company/role header.
    """
    if not section_text:
        return []

    entries: list[dict[str, Any]] = []
    # Split on lines that look like "Role | Company" or "Company" followed by a date line
    blocks = re.split(r"\n{2,}", section_text)
    exp_id = 1

    for block in blocks:
        block = block.strip()
        if not block:
            continue
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if len(lines) < 2:
            continue

        # Try to detect "Role | Company" pattern
        role, company = "", lines[0]
        if "|" in lines[0]:
            parts = lines[0].split("|", 1)
            role = parts[0].strip()
            company = parts[1].strip()

        # Date line heuristic
        date_line = ""
        bullets: list[str] = []
        for line in lines[1:]:
            if re.search(r"\d{4}", line) and not date_line:
                date_line = line
            elif line.startswith(("•", "-", "*", "–")):
                bullets.append(re.sub(r"^[•\-*–]\s*", "", line))
            elif not role and not re.search(r"\d{4}", line):
                role = line  # second non-date line as role fallback

        start, end, current = "", None, False
        dates = re.findall(r"(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|\d{4})[^\d]*\d{0,4}", date_line)
        if dates:
            start = dates[0].strip()
            if len(dates) > 1:
                end_raw = dates[-1].strip()
                if "present" in end_raw.lower():
                    current = True
                else:
                    end = end_raw

        entry: dict[str, Any] = {
            "id": f"exp-{exp_id}",
            "company": company,
            "role": role or company,
            "type": "Full-time",
            "start": start,
            "end": end,
            "current": current,
            "location": "",
            "description": "",
            "bullets": bullets,
            "skills": [],
        }
        entries.append(entry)
        exp_id += 1

    return entries


def _parse_education(section_text: str) -> list[dict[str, Any]]:
    if not section_text:
        return []
    result = []
    blocks = re.split(r"\n{2,}", section_text)
    for block in blocks:
        lines = [l.strip() for l in block.splitlines() if l.strip()]
        if not lines:
            continue
        year_match = re.search(r"(\d{4})", block)
        year = year_match.group(1) if year_match else ""
        result.append({
            "institution": lines[0],
            "degree": lines[1] if len(lines) > 1 else "",
            "field": "",
            "start": "",
            "end": year,
        })
    return result[:3]  # cap at 3 to avoid noise


def _parse_skills(section_text: str) -> dict[str, list[str]]:
    """Parse a skills section into a dict of category → [items]."""
    if not section_text:
        return {"skills": []}

    result: dict[str, list[str]] = {}
    current_cat = "skills"
    current_items: list[str] = []

    for line in section_text.splitlines():
        line = line.strip()
        if not line:
            continue
        # A line ending with ":" or all-caps short line → category header
        if line.endswith(":") and len(line) < 40:
            if current_items:
                result[current_cat] = current_items
            current_cat = _slugify(line.rstrip(":"))
            current_items = []
        elif re.match(r"^[A-Z][a-z].*:", line):
            parts = line.split(":", 1)
            if current_items:
                result[current_cat] = current_items
            current_cat = _slugify(parts[0])
            current_items = [s.strip() for s in re.split(r"[,;]", parts[1]) if s.strip()]
        else:
            items = [s.strip() for s in re.split(r"[,;|]", line) if s.strip() and len(s.strip()) > 1]
            current_items.extend(items)

    if current_items:
        result[current_cat] = current_items

    return result or {"skills": []}


def _parse_languages(section_text: str) -> list[dict[str, str]]:
    if not section_text:
        return []
    result = []
    for line in section_text.splitlines():
        line = line.strip()
        if not line:
            continue
        parts = re.split(r"\s{2,}|\t|–|-", line, maxsplit=1)
        if len(parts) == 2:
            result.append({"language": parts[0].strip(), "level": parts[1].strip()})
        elif re.search(r"(native|fluent|b[12]|a[12]|c[12]|beginner|advanced|intermediate)", line, re.I):
            result.append({"language": line, "level": ""})
    return result


def _parse_certifications(section_text: str) -> list[dict[str, str]]:
    if not section_text:
        return []
    certs = []
    for line in section_text.splitlines():
        line = re.sub(r"^[•\-*–]\s*", "", line.strip())
        if line and len(line) > 4:
            certs.append({"name": line, "issuer": ""})
    return certs


# ---------------------------------------------------------------------------
# Parse a full PDF into a partial profile dict
# ---------------------------------------------------------------------------

def parse_cv(pdf_path: Path, linkedin_url: str) -> dict[str, Any]:
    text = _extract_pdf_text(pdf_path)

    name, title = _parse_name_title(text)
    email = _parse_email(text)
    phone = _parse_phone(text)
    linkedin = linkedin_url or _parse_linkedin(text)

    # Section extraction (tolerant of variations in header names)
    exp_text  = _find_section(text, "Professional Experience", "Work Experience", "Experience")
    edu_text  = _find_section(text, "Education")
    skill_text= _find_section(text, "Technical Skills", "Skills", "Core Competencies")
    lang_text = _find_section(text, "Languages")
    cert_text = _find_section(text, "Certifications", "Certificates")
    summary   = _find_section(text, "Professional Summary", "Summary", "About")

    return {
        "name": name,
        "title": title,
        "email": email,
        "phone": phone,
        "linkedin": linkedin,
        "summary": summary[:600] if summary else "",
        "experience": _parse_experience(exp_text),
        "education": _parse_education(edu_text),
        "skills": _parse_skills(skill_text),
        "languages": _parse_languages(lang_text),
        "certifications": _parse_certifications(cert_text),
    }


# ---------------------------------------------------------------------------
# Interactive entry (--interactive mode)
# ---------------------------------------------------------------------------

def _prompt(label: str, default: str = "") -> str:
    suffix = f" [{default}]" if default else ""
    value = input(f"{label}{suffix}: ").strip()
    return value or default


def interactive_entry() -> dict[str, Any]:
    print("\n=== Interactive profile entry ===\n")
    return {
        "name":     _prompt("Full name"),
        "title":    _prompt("Job title"),
        "email":    _prompt("Email"),
        "phone":    _prompt("Phone"),
        "linkedin": _prompt("LinkedIn URL"),
        "summary":  _prompt("Professional summary"),
        "experience": [],
        "education": [],
        "skills": {},
        "languages": [],
        "certifications": [],
    }


# ---------------------------------------------------------------------------
# Assemble a full Profile dict
# ---------------------------------------------------------------------------

def _build_profile(parsed: dict[str, Any], profile_id: str) -> dict[str, Any]:
    return {
        "id": profile_id,
        "cardId": str(uuid.uuid4()),
        "personal": {
            "name":      parsed.get("name", ""),
            "title":     parsed.get("title", ""),
            "tagline":   parsed.get("title", ""),
            "email":     parsed.get("email", ""),
            "phone":     parsed.get("phone", ""),
            "location":  parsed.get("location", ""),
            "linkedin":  parsed.get("linkedin", ""),
            "github":    parsed.get("github", ""),
            "website":   parsed.get("website", ""),
            "avatarUrl": f"/avatars/{profile_id}.jpg",
        },
        "summary":        parsed.get("summary", ""),
        "experience":     parsed.get("experience", []),
        "skills":         parsed.get("skills", {}),
        "education":      parsed.get("education", []),
        "certifications": parsed.get("certifications", []),
        "awards":         [],
        "languages":      parsed.get("languages", []),
    }


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Import a new profile into data/profiles.json",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    parser.add_argument("--cv", metavar="PATH", help="Path to CV/resume PDF")
    parser.add_argument("--linkedin", metavar="URL", default="", help="LinkedIn profile URL")
    parser.add_argument("--interactive", action="store_true", help="Guided prompt-by-prompt entry")
    parser.add_argument("--id", metavar="ID", dest="profile_id", default="",
                        help="Override the generated profile id (kebab-case)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Print the profile JSON without writing to disk")
    args = parser.parse_args()

    if not args.cv and not args.interactive:
        parser.error("Provide --cv <path> or --interactive")

    data = _load_profiles()
    existing = _existing_ids(data)

    # Parse
    if args.interactive:
        parsed = interactive_entry()
    else:
        cv_path = Path(args.cv).expanduser().resolve()
        if not cv_path.exists():
            sys.exit(f"File not found: {cv_path}")
        print(f"Parsing {cv_path.name} …")
        parsed = parse_cv(cv_path, args.linkedin)

    # Determine id
    name = parsed.get("name", "unknown")
    profile_id = args.profile_id or _unique_id(name, existing)

    if profile_id in existing:
        sys.exit(f"Error: id '{profile_id}' already exists in profiles.json. "
                 f"Use --id to specify a different one.")

    profile = _build_profile(parsed, profile_id)

    # Preview
    sep = "-" * 60
    print(f"\n{sep}")
    print(f"  id       : {profile['id']}")
    print(f"  cardId   : {profile['cardId']}")
    print(f"  name     : {profile['personal']['name']}")
    print(f"  title    : {profile['personal']['title']}")
    print(f"  email    : {profile['personal']['email']}")
    print(f"  linkedin : {profile['personal']['linkedin']}")
    print(f"  #exp     : {len(profile['experience'])}")
    print(f"  #skills  : {len(profile['skills'])} categories")
    print(f"  avatarUrl: {profile['personal']['avatarUrl']}  (copy photo here)")
    print(f"{sep}\n")

    if args.dry_run:
        print(json.dumps(profile, indent=2, ensure_ascii=False))
        print("\n[dry-run] Nothing written.")
        return

    confirm = input("Append to profiles.json? [Y/n] ").strip().lower()
    if confirm in ("", "y", "yes"):
        data["profiles"].append(profile)
        _save_profiles(data)
        print(f"\nProfile '{profile_id}' added. "
              f"Don't forget to place the avatar at frontend/public{profile['personal']['avatarUrl']}")
    else:
        print("Aborted.")


if __name__ == "__main__":
    main()
