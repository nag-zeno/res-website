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

## Free demo deployment (Vercel + Render + Neon)

### 1) Neon (Postgres)
1. Create a free Neon project and database.
2. Copy the connection string and set it as `DATABASE_URL` on Render later.

### 2) Render (Backend API)
1. Create a new Web Service from this repo.
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add environment variables:
   - `DATABASE_URL` (Neon connection string)
   - `JWT_SECRET` (strong random string)
   - `GEMINI_API_KEY` (your key)
   - `CORS_ORIGIN` (your Vercel domain, example: `https://your-app.vercel.app`)
   - `NODE_ENV=production`
   - Optional: `TRUST_PROXY=true`
6. Deploy and copy the Render service URL, e.g. `https://your-api.onrender.com`

### 3) Vercel (Frontend)
1. Create a new Vercel project from this repo.
2. Framework: **Other**.
3. Output directory: `.`
4. Before deploy, set the API base URL in `js/config.js`:
   - `API_BASE_URL: 'https://your-api.onrender.com/api'`
5. Deploy, then update `CORS_ORIGIN` on Render if your Vercel domain changes.
