# Studio — Freelance Team Portfolio

A lean, production-ready team portfolio for a small group of freelance developers.
Presents the team, their profiles, and invites project inquiries.

```
studio/
├── data/
│   └── profiles.json        # Single source of truth — all team members
├── frontend/                # Next.js 15 + TailwindCSS
├── backend/                 # FastAPI — two endpoints only
├── infra/k8s/               # Kubernetes manifests
├── import_profile.py        # CLI tool to add new team members
├── docker-compose.yml       # Production stack
├── docker-compose.dev.yml   # Hot-reload dev stack
└── Makefile
```

---

## Pages

| Route              | Description                              |
|--------------------|------------------------------------------|
| `/`                | Homepage — hero + team cards + contact   |
| `/team/[id]`       | Full profile — experience, skills, bio   |
| `/team/[id]/cv`    | Printable / ATS-friendly CV              |

## API

| Method | Path                    | Description              |
|--------|-------------------------|--------------------------|
| GET    | `/api/profiles`         | All team members (cards) |
| GET    | `/api/profiles/{id}`    | Full profile by id       |
| GET    | `/health`               | Health check             |

Swagger UI: `http://localhost:8000/docs`

---

## Development (hot-reload)

```bash
# First time
docker compose up --build
# or: make dev-build

# Subsequent runs
make dev
```

Changes in `frontend/src/`, `backend/**/*.py`, or `data/profiles.json` reload instantly.

---

## Production

```bash
docker compose up --build
# or: make prod-build
```

| Service  | URL                           |
|----------|-------------------------------|
| Site     | http://localhost:3000         |
| API      | http://localhost:8000         |
| API docs | http://localhost:8000/docs    |

---

## Local development (no Docker)

```bash
# Backend
cd backend
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev
```

---

## Adding a team member

```bash
# Parse a CV PDF and append to profiles.json
python import_profile.py --cv /path/to/cv.pdf --linkedin https://linkedin.com/in/someone

# Preview without writing
python import_profile.py --cv /path/to/cv.pdf --dry-run

# Interactive guided entry
python import_profile.py --interactive
```

The script:
1. Extracts name, title, email, phone, summary, experience, skills from the PDF
2. Generates a unique kebab-case `id` (e.g. `jane-smith`)
3. Appends to `data/profiles.json`
4. Prints the avatar path to copy your photo to

---

## Data structure (`data/profiles.json`)

```jsonc
{
  "profiles": [
    {
      "id": "jane-smith",           // kebab-case, URL-safe
      "cardId": "<uuid>",           // for visit cards (future use)
      "personal": { "name": "...", "title": "...", "email": "...", ... },
      "summary": "...",
      "experience": [ { "id": "...", "company": "...", "bullets": [...], ... } ],
      "skills": { "backend": ["TypeScript", ...], "cloud": ["AWS", ...] },
      "education": [ ... ],
      "certifications": [ ... ],
      "awards": [ ... ],
      "languages": [ { "language": "English", "level": "Fluent" } ]
    }
  ]
}
```

**To switch to PostgreSQL:** implement `SqlProfileRepository` with the same
5-method interface as `JsonProfileRepository`, then change one line in
`backend/app/deps.py`. Routes and service layer are unaffected.

---

## Tech stack

| Layer         | Technology                          |
|---------------|-------------------------------------|
| Frontend      | Next.js 15, React 19, TailwindCSS   |
| Backend       | FastAPI, Pydantic v2, uvicorn       |
| Data          | `data/profiles.json` (→ PostgreSQL) |
| Container     | Docker, Docker Compose              |
| Orchestration | Kubernetes, NGINX Ingress, HPA      |
