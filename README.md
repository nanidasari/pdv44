# Pixcel Studio — Dynamic Decap CMS

The site now reads content from the files managed by Decap CMS at build time.

### CMS-controlled content
- Portfolio: title, category, tag, image
- Testimonials
- Services: name, number, description, icon, enabled
- Home page: hero, statement, CTA
- About page: intro, studio copy, founder
- Global settings: studio name, email, Instagram, Behance, LinkedIn, footer and SEO

### Important deployment setup

For CMS edits to appear on the public website:

1. Put this project in the same GitHub repository configured in Decap CMS.
2. Connect that GitHub repository to Netlify.
3. Netlify should use Build command `npm run build` and Publish directory `dist`.
4. Enable Netlify Identity / Git Gateway for the Decap CMS login.
5. Edit content in `/admin/` and click **Publish**.
6. Decap commits the changed content to GitHub.
7. Netlify detects the commit and automatically rebuilds the site.
8. After the build finishes, the public site shows the new content.

If the site was deployed only by dragging a `dist` folder into Netlify, CMS changes cannot rebuild that deployment. Connect the GitHub repository instead.

### Local development

```bash
npm install
npm run dev
```

### Production build

```bash
npm run build
```

Navigation remains refresh-safe using `/#/`, `/#/work`, and `/#/about`.
