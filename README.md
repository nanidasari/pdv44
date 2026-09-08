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


## Important: Decap CMS updates

This is a static Vite site. Decap CMS saves changes to the Git repository, and Netlify must rebuild the site before the public client page changes. The frontend reads Services, Portfolio and Testimonials directly from the `content/` files at build time, so newly created CMS entries are included automatically on the next Netlify build.

Do not use a one-time drag-and-drop deploy if you want CMS changes to update automatically. Connect the site to the Git repository and enable Netlify continuous deployment. After publishing in `/admin/`, wait for the Netlify deploy to finish, then hard-refresh the client page.
