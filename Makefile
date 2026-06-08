# ── Development (hot-reload) ──────────────────────────────────────────────────
# docker-compose.override.yml is auto-merged by Docker Compose.

dev:
	docker compose up

dev-build:
	docker compose up --build

# ── Production (baked images) ─────────────────────────────────────────────────
prod-build:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build

prod:
	docker compose -f docker-compose.yml -f docker-compose.prod.yml up

# ── Teardown ──────────────────────────────────────────────────────────────────
down:
	docker compose down

.PHONY: dev dev-build prod prod-build down
