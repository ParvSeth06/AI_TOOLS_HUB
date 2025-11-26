Overview

This repository has been split into two deployable projects:

- `frontend/` — Vite + React app. Intended for Vercel (or any static host).
- `backend/` — Express TypeScript API. Intended for Render (or any Node host).

Quick instructions

Frontend (Vercel)
- In the Vercel dashboard, create a new project and point it at this repo.
- Set Project Root to `frontend`.
- Build Command: `npm run build`
- Output Directory: `dist` (or leave blank if Vercel detects `dist`)
- Environment variables:
  - `VITE_API_URL` — set to the public URL of your backend (e.g. `https://your-backend.onrender.com`).

Backend (Render)
- Create a new Web Service on Render and connect to repo.
- Set Build Command: `npm install && npm run build` (runs `esbuild` to bundle)
- Start Command: `npm start`
- Environment variables required by the backend (examples):
  - `DATABASE_URL` — Postgres URL
  - `OPENAI_API_KEY` — OpenAI key (if used)
  - `ALLOW_ORIGIN` — allowed origins for CORS (comma-separated), e.g. `https://your-frontend.vercel.app`

Notes & important changes made

- `frontend/package.json` and `backend/package.json` were added so each folder can install deps independently.
- The frontend now reads `VITE_API_URL` (Vite env prefix) to call the backend. If not set, it falls back to relative `/api` paths.
- `backend/app.ts` now includes `cors` middleware. Set `ALLOW_ORIGIN` to restrict origins.
- `backend/index-prod.ts` serves the built frontend from `dist/public` if you build both in the root. For independent builds you won't use this path — Render will host only the API.

Recommended deployment flow (Option A)
1. Deploy backend to Render first. Provide `ALLOW_ORIGIN` with your frontend URL and other env vars.
2. Deploy frontend to Vercel and set `VITE_API_URL` to your Render service URL.

Local dev (how to run both locally)

- Frontend only
```powershell
Set-Location -Path "D:\AI_Tools_Hub\AiToolHub\frontend"
npm install
npm run dev
```

- Backend only
```powershell
Set-Location -Path "D:\AI_Tools_Hub\AiToolHub\backend"
npm install
npm run dev
```

- Full local run (root-based)
```powershell
Set-Location -Path "D:\AI_Tools_Hub\AiToolHub"
npm install
npm run dev
# This runs backend in dev mode which proxies to Vite middleware for frontend
```

If you want, I can:
- Run local installs/builds to confirm everything compiles here.
- Add `.vercel`/Render service templates or example `render.yaml`.
- Harden CORS and provide an example `.env` file.
