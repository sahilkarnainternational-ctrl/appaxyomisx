# Deployment Guide

This project is configured for deployment on **Render** only.

## Environment Variables

Before deploying, optionally set these environment variables in Render:

- `PORT` - Server port (provided by Render)
- `BASE_PATH` - Base path for the app (defaults to `/`)
- `NODE_ENV` - Set to `production` for production builds
- `GEMINI_API_KEY` - Your Gemini API key (required for API features)

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
pnpm run render-build
```

## Build Configuration

- **Vite Config**: `artifacts/axyomis/vite.config.ts` - Main build config
- **Render config**: `render.yaml`
- **Node Version**: 22.13.0 (specified in `render.yaml`)

## How It Works

The Render pipeline uses `render.yaml` to:
- install dependencies with pnpm
- build the frontend with Vite using `vite.render.config.ts`
- serve the built app from `artifacts/axyomis/dist/public`

## Troubleshooting

### Build fails
- Check that all dependencies are installed: `pnpm install`
- Ensure Node 22+ is available
- Check Render build logs for specific errors

### GEMINI_API_KEY undefined
- Add the environment variable to Render environment variables
- The app will work without it but API features may be limited

### Static assets not loading
- Verify the output directory `artifacts/axyomis/dist/public` exists after build
- Check Render is using `render.yaml` from the repository root
