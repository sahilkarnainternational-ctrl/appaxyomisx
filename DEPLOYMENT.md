# Deployment Guide

This project is configured for deployment on **Vercel**, **Netlify**, and **Render**.

## Environment Variables

Before deploying, optionally set these environment variables in your platform:

- `PORT` - Server port (defaults to 3000)
- `BASE_PATH` - Base path for the app (defaults to /)
- `NODE_ENV` - Set to `production` for production builds
- `GEMINI_API_KEY` - Your Gemini API key (required for API features)

## Vercel Deployment

✅ **Pre-configured in `vercel.json`**

```bash
vercel
```

The app will automatically build using `pnpm run vercel-build` and deploy from `artifacts/axyomis/dist/public`.

## Netlify Deployment

✅ **Pre-configured in `netlify.toml`**

```bash
netlify deploy
```

The app will automatically build and deploy with proper SPA routing.

## Render Deployment

✅ **Pre-configured in `render.yaml`**

Push your repository and Render will detect the `render.yaml` configuration automatically.

## Local Development

```bash
# Install dependencies
pnpm install

# Start development server
cd artifacts/axyomis
pnpm dev

# Build for production
pnpm run vercel-build
```

## Build Configuration

- **Vite Config**: `artifacts/axyomis/vite.config.ts` - Main build config (works on Replit, Vercel, Netlify, Render)
- **Node Version**: 20 (specified in `.nvmrc`)

## How It Works

The `vite.config.ts` has been updated to:
- Use sensible defaults for `PORT` (3000) and `BASE_PATH` (/) when not provided
- Set `strictPort: false` for cloud deployments that assign dynamic ports
- Disable source maps for production builds
- Properly handle environment variables across all platforms

This means your app will work correctly on:
- ✅ Replit (with PORT/BASE_PATH env vars)
- ✅ Vercel (via vercel.json)
- ✅ Netlify (via netlify.toml)
- ✅ Render (via render.yaml)

## Troubleshooting

### Build fails
- Check that all dependencies are installed: `pnpm install`
- Ensure Node 20+ is available
- Check build logs for specific errors

### GEMINI_API_KEY undefined
- Add the environment variable to your deployment platform
- The app will work without it but API features will be limited

### Static assets not loading
- Verify the output directory `artifacts/axyomis/dist/public` exists after build
- Check your platform's configuration points to the correct output directory
