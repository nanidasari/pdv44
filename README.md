# Pixcel Studio

A responsive React + Vite studio website with liquid-glass visuals, animated gradients, mouse-reactive glow, portfolio pages, About/Founder page and Decap CMS configuration.

## 1. Run locally

Requirements: Node.js 18+.

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal.

## 2. Build for production

```bash
npm run build
npm run preview
```

The production output is `dist/`.

## 3. Deploy to Netlify

1. Create a GitHub repository and push this project.
2. In Netlify, choose Add new site → Import an existing project.
3. Select the GitHub repository.
4. Build command: `npm run build`
5. Publish directory: `dist`
6. Deploy.

### Decap CMS

The admin UI is already included at `/admin/`.

For the simplest Netlify setup, enable Netlify Identity and Git Gateway for the site. In Netlify:
- Identity → Enable Identity
- Identity → Services → Git Gateway → Enable
- Invite your CMS editors/users
- Open `https://YOUR-DOMAIN/admin/`

If your hosting provider does not support Git Gateway, switch `backend.name` in `public/admin/config.yml` to `github` and configure a GitHub OAuth app / authentication flow appropriate to your host.

## 4. Add real portfolio images

Decap uploads images to:

`public/uploads/`

Portfolio entries live in:

`content/portfolio/`

After publishing a CMS entry, connect your frontend data layer to those Markdown files (or replace the starter hard-coded `portfolio` array in `src/main.jsx` with a generated/remote content source). The starter site intentionally includes sample entries so it works immediately after cloning.

## 5. Change social links

Edit `content/settings.yml` and/or the footer links in `src/main.jsx`.

Current placeholders:
- Instagram
- Behance
- LinkedIn

Replace them with the studio's real URLs.

## 6. Customize

Main visual system:
- `src/styles.css` — colors, gradients, glass, animations, responsive breakpoints.
- `src/main.jsx` — page content, navigation, portfolio cards and testimonials.
- `public/images/` — starter artwork.
- `content/` — editable CMS content.

## Pages

- `/` — animated homepage
- `/work` — filterable portfolio
- `/about` — studio + founder
- `/admin/` — Decap CMS

## Notes

The footer is present on every route and includes Instagram, Behance, LinkedIn and Email. Replace placeholder social URLs before launch.

## Updated CMS coverage

The `/admin/` panel now includes editable collections for:
- Portfolio
- Testimonials
- Services
- Home page content
- About page + founder content
- Global settings, social links, footer copy and SEO
- Favicon upload field

The current React starter still uses bundled starter content for guaranteed instant preview; the CMS content files are structured for connecting to a static-content build pipeline. For a fully dynamic production CMS, the next step is wiring the Markdown/YAML collections into the Vite build (for example with a small build-time content loader).

## Navigation fix

The site now uses `HashRouter`, so navigation works reliably on static hosting without requiring server-side route rewrites. URLs appear as `/#/`, `/#/work`, and `/#/about`. A catch-all route is also included to prevent blank pages on unknown routes.
