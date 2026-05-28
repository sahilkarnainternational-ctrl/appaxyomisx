# Axyomis-X — Vercel Deployment Guide

## Overview
Axyomis-X is a fullstack React + Serverless app deployed to Vercel.

- **Frontend**: React 19 + Vite + TailwindCSS (static build)
- **Backend**: Serverless functions in `/api/` (Vercel Functions)
- **Auth**: Firebase Auth (client-side)
- **AI**: Groq (via serverless proxy) + Gemini (client-side)
- **YouTube**: YouTube Data API (via serverless proxy)

## Required Environment Variables

Add these in your Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for client-side AI | Yes |
| `GROQ_API_KEY` | Groq API key for serverless chat proxy | Yes |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key for video search | Yes |
| `VITE_YOUTUBE_API_KEY` | Fallback for YouTube key | Optional |
| `GMAIL_USER` | Gmail address for parent report emails | Optional |
| `GMAIL_APP_PASSWORD` | Gmail app password for emails | Optional |

## Deployment Steps

1. **Install Vercel CLI** (if not already):
   ```bash
   npm i -g vercel
   ```

2. **Login and link**:
   ```bash
   vercel login
   vercel
   ```

3. **Set environment variables** in the Vercel dashboard or via CLI:
   ```bash
   vercel env add GEMINI_API_KEY
   vercel env add GROQ_API_KEY
   vercel env add YOUTUBE_API_KEY
   ```

4. **Deploy**:
   ```bash
   vercel --prod
   ```

Or push to a GitHub repo connected to Vercel — it auto-deploys on every push.

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Add your Vercel domain to Authentication → Settings → Authorized domains
3. The domain will be `https://your-project.vercel.app` (or your custom domain)

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "auth/unauthorized-domain" | Add Vercel domain to Firebase Auth authorized domains |
| API routes 404 | Check `vercel.json` routes config matches `/api/*` |
| Build fails on Replit plugins | The `vite.vercel.config.ts` strips all Replit-specific plugins |
| CORS errors | Serverless functions already set `Access-Control-Allow-Origin: *` |
| YouTube videos not loading | Verify `YOUTUBE_API_KEY` is set and quota not exceeded |

## File Structure

```
/
├── api/                          # Vercel serverless functions
│   ├── youtube.js                  # YouTube search proxy
│   ├── youtube-multilingual.js     # Multilingual YouTube search
│   ├── chat.js                     # Groq AI chat proxy
│   ├── send-report.js            # Parent report email sender
│   ├── healthz.js                # Health check endpoint
│   └── index.js                   # Catch-all 404
├── artifacts/axyomis/            # React frontend source
│   ├── src/                       # React components
│   └── dist/public/              # Vite build output (ignored in git)
├── vercel.json                   # Vercel routing & build config
├── vite.vercel.config.ts         # Production Vite config
└── .vercelignore                 # Files to exclude from upload
```
