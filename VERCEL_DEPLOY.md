# Axyomis-X — Vercel Deployment Guide

Ready to deploy with zero configuration needed. Here's everything you need to know.

## Quick Deploy (30 seconds)

### Option 1: Vercel CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Login and deploy
vercel login
vercel --prod
```

### Option 2: GitHub Integration (Recommended)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Vercel auto-detects the Vite framework — just click **Deploy**

## Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `GEMINI_API_KEY` | Your Google Gemini API key | ✅ Yes |
| `GROQ_API_KEY` | Your Groq API key | ✅ Yes |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key | ✅ Yes |
| `GMAIL_USER` | Gmail address (for parent reports) | ❌ Optional |
| `GMAIL_APP_PASSWORD` | Gmail app password | ❌ Optional |

**Note:** `GEMINI_API_KEY` is used at build time (injected into the bundle) and must be set as a Vercel environment variable with the same name.

## After Deploying: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/) → Authentication → Settings → Authorized domains
2. Add your Vercel domain:
   - `https://your-project.vercel.app`
   - Or your custom domain if you added one
3. Google Sign-In will work immediately after this step

## What Got Set Up For You

| File | Purpose |
|------|---------|
| `vercel.json` | Routes API calls to serverless functions, serves static frontend |
| `api/*.js` | 6 serverless functions: YouTube, multilingual YouTube, Groq chat, email, health |
| `vite.vercel.config.ts` | Production Vite config (no Replit plugins, stripped for Vercel) |
| `.vercelignore` | Keeps deploy size small by excluding dev files |
| `package.json` | `vercel-build` script for the build pipeline |
| `artifacts/axyomis/dist/public/` | Vite build output (auto-generated on deploy) |

## API Endpoints (Serverless Functions)

All API routes are handled by Vercel Functions at the `/api/` path:

- `POST /api/chat` — Groq AI chat proxy
- `POST /api/youtube` — YouTube video search
- `POST /api/youtube-multilingual` — Multilingual YouTube (EN/HI/NE)
- `POST /api/send-report` — Parent report email
- `GET /api/healthz` — Health check

CORS is enabled on all endpoints — no extra config needed.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "auth/unauthorized-domain" on login | Add your Vercel domain to Firebase Console → Auth → Authorized domains |
| Build fails | Check that `GEMINI_API_KEY`, `GROQ_API_KEY`, `YOUTUBE_API_KEY` are set in Vercel env vars |
| API 404 errors | The `vercel.json` rewrites should handle this — check that the `api/` folder was pushed to git |
| YouTube videos not loading | Verify `YOUTUBE_API_KEY` quota hasn't been exceeded at Google Cloud Console |
| Blank page after deploy | The `_redirects` file handles SPA routing — this should work out of the box |

## What's Included in the Deployment

- ✅ React 19 + Vite production build
- ✅ Serverless API functions (no Express server needed)
- ✅ Firebase Auth with Google + email sign-in
- ✅ YouTube video search (multilingual)
- ✅ Groq AI chat (ASTRA tutor)
- ✅ Wikipedia-powered ebook chapters with LaTeX
- ✅ PWA service worker with offline support
- ✅ TailwindCSS v4 + motion animations
- ✅ 3D globe visualization (cobe)
- ✅ Quiz engine with 3 difficulty levels
- ✅ Mermaid diagrams + math rendering

## Build Tested Successfully ✅

The production build was verified locally with:
```bash
pnpm run vercel-build
```

Output: clean build at `artifacts/axyomis/dist/public/` with chunked assets, service worker, and SPA fallback.
