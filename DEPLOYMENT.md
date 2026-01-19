# Deployment Guide

This guide covers local development with Docker Postgres and a basic production
Docker image for the backend API.

## Local development (Docker Postgres + Node API)

1) Start Postgres:
```
docker compose up -d
```

2) Configure backend env:
- Copy `backend/.env.example` to `backend/.env`.
- Ensure `DATABASE_URL` matches the Postgres port:
  - `postgresql://postgres:postgres@localhost:5432/speakeasy?schema=public`

3) Install and migrate:
```
cd backend
npm install
npx prisma db push
```

4) Start API:
```
npm run dev
```

## Tests (local)

```
cd backend
npm test
```

## Production (backend only)

1) Build image:
```
docker build -t speakeasy-backend ./backend
```

2) Run container (set env):
```
docker run -d --name speakeasy-api \
  --env-file ./backend/.env \
  -p 3000:3000 \
  speakeasy-backend
```

Notes:
- For production, set strong `JWT_SECRET` and a real Postgres host in `DATABASE_URL`.
- If running behind a proxy, set `TRUST_PROXY=true`.
