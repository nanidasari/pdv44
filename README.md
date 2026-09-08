# Pixcel Studio — Fully CMS-Driven

All major client-visible content is connected to Decap CMS content:
Home, About, Founder photo, Services, Portfolio, Testimonials, global settings and social links.

Workflow:
Decap CMS → GitHub commit → Netlify build → public website.

Deploy from the GitHub repository (do not use a one-time drag-and-drop build) so every Publish creates a new production build.

Netlify:
- Build command: npm run build
- Publish directory: dist

CMS:
- Open /admin/
- Edit
- Save
- Publish
- Wait for Netlify deploy to finish
- Hard refresh the public site once if your browser cached the old HTML

The runtime also fetches `/content/*` with no-cache headers, so CMS content is not baked only into React constants.
