# Pixcel Studio

Liquid-glass animated React/Vite website for Pixcel Studio.

## Refresh-safe navigation

The website uses hash navigation:
- `/#/`
- `/#/work`
- `/#/about`

This means clicking Work/About and then pressing browser refresh will still load the correct page. It does not depend on server-side routing.

## Deploy

Netlify:
- Build command: `npm run build`
- Publish directory: `dist`

The included `netlify.toml` already contains these settings.

## Local

```bash
npm install
npm run dev
```

## Decap CMS

Open `/admin/` after deployment. CMS files are included in `public/admin/` and `content/`.
