# Shawn Han — Personal Site & Sports Analytics Blog

> Workspace memory for this repo. **Last verified: 2026-10-18.**
> This repo is the **frontend only**. Engineering code lives in separate repos
> (see "Project repos"). Update this file when the site structure changes.

## Overview

A static Astro 6 site at **https://shawnhdx0710.github.io/**. It is the public portfolio,
blog, and project write-up layer; it does not contain project source code.

- **Live:** https://shawnhdx0710.github.io/
- **Repo:** https://github.com/shawnhdx0710/shawnhdx0710.github.io (public)
- **Deploy:** push to `main` → GitHub Actions → GitHub Pages (no PR previews)
- **Author:** Shawn (Dexuan) Han — 韩德轩, freshman studying statistics, machine learning,
  and artificial intelligence at Carnegie Mellon University

## Snapshot (as of 2026-10-18)

- **Git:** all site changes are committed on `main`; the branch tracks `origin/main`.
  Working tree only has the pre-existing `.claude/settings.local.json` change.
- **Build:** `npm run build` passes — 11 pages (8 content + 3 legacy `/blog/` redirects),
  ~2 s.
- **Live:** the dark redesign is deployed and live.
- **Local toolchain:** Node v24.15.0, npm 11.12.1. `package.json` requires Node >=22.12;
  CI pins Node 22.
- **Content:** 2 blog posts, 1 published project, 3 Misc entries.
- **Design:** the whole site is dark (`#0e1410` page, `#141c16` cards, cream text). The
  homepage is a full-bleed night-pitch canvas behind a centered narrow column of
  left-aligned prose; no visible title and no homepage section grid.

| Type | Source | Date | Tags | Live URL |
|------|--------|------|------|----------|
| Blog | `blogs/maradona-1986` | 2026-06-11 | Soccer Analytics, Event data, Visualization | `/blogs/maradona-1986/maradona-1986/` |
| Blog | `blogs/event-datasets` | 2026-07-31 (updated 2026-08-09) | Open Data, Soccer Analytics | `/blogs/event-datasets/event-datasets/` |
| Project | `projects/xTgrid` | 2026-06-20 | Soccer Analytics, Data Engineering, xT, Python | `/projects/xtgrid/xtgrid/` |

The **event-datasets** post is a "living document" — update its `Last updated:` line
whenever the guide changes. The **xTgrid** project links to the standalone
`xt-pipeline` repo.

## Project repos

Project code must **not** live in this repo. Current repos:

| Project | Repo | Visibility | Notes |
|---------|------|------------|-------|
| xT pipeline | https://github.com/shawnhdx0710/xt-pipeline | public | `scripts/`, `requirements-xt.txt`; caches/data ignored |
| 2023 WWC xT + Weighted PageRank | https://github.com/shawnhdx0710/xT-weighted-PageRank-on-passing-networks | public | paper accepted by SIURO; no raw data |
| Maradona 1986 analysis | https://github.com/shawnhdx0710/maradona-1986 | public | notebook + AFA badge; raw JSON ignored |
| StatsBomb Passmap Explorer | not created yet | — | 15-112 project; create when code is ready |

When a new project is ready: create a separate repo, add a README + `.gitignore`, keep raw
data/caches out, then add a write-up under `src/content/projects/`.

## Commands

```bash
npm install       # once
npm run dev       # dev server, localhost:4321, hot reload
npm run build     # production build → dist/
npm run preview   # serve the built output locally
```

Deploy is just `git push` to `main`; GitHub Actions does the rest.

## Repository map

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro            # sticky nav: Projects / Blogs / Readings / Misc
│   │   ├── Footer.astro            # name + copyright only
│   │   ├── FootballBackground.astro# fixed canvas night-pitch animation
│   │   └── SocialIcons.astro       # Instagram, X, LinkedIn, GitHub, Gmail, CMU
│   ├── content/
│   │   ├── blogs/
│   │   │   ├── maradona-1986/      # .mdx + images (notebook is in its own repo)
│   │   │   └── event-datasets/     # .mdx + cover + screenshot
│   │   └── projects/
│   │       └── xTgrid/             # .mdx + pipeline/heatmap/terrain images
│   ├── content.config.ts           # collections: blog, projects (glob loader)
│   ├── layouts/BaseLayout.astro    # head/OG, header, footer, social sidebar
│   ├── pages/
│   │   ├── index.astro             # homepage: dark football canvas + intro
│   │   ├── blogs/index.astro       # post listing
│   │   ├── blogs/[...slug].astro   # post template
│   │   ├── blog/index.astro        # legacy redirect → /blogs/
│   │   ├── blog/[...slug].astro    # legacy redirect → /blogs/<id>/
│   │   ├── projects/index.astro    # project listing
│   │   ├── projects/[...slug].astro# project template
│   │   ├── readings/index.astro    # reading notes (blank until entries exist)
│   │   └── misc/index.astro        # editorial misc page: film, book, archive links
│   └── styles/global.css           # Tailwind v4 theme + article typography
├── public/
│   ├── projects/xtgrid/            # xt_voxel_terrain.html (tracked, 5.2 MB)
│   └── misc/                       # book PDF + HTML edition
├── .github/workflows/deploy.yml    # CI: npm ci → build → Pages
├── astro.config.mjs                # site URL + integrations (github-dark Shiki)
├── package.json, tsconfig.json
└── CLAUDE.md
```

## How the site is put together

### Collections & routing

`src/content.config.ts` defines two collections with Astro's **glob loader**:

- `blog` → `./src/content/blogs/**/*.mdx`
- `projects` → `./src/content/projects/**/*.mdx`
- Shared schema: `title`, `description?`, `date`, `coverImage?`, `tags?`.

Collection IDs are slugs derived from the file path **including the filename**, and they
are **lowercased**:

| File | URL |
|------|-----|
| `blogs/event-datasets/event-datasets.mdx` | `/blogs/event-datasets/event-datasets/` |
| `blogs/maradona-1986/maradona-1986.mdx` | `/blogs/maradona-1986/maradona-1986/` |
| `projects/xTgrid/xTgrid.mdx` | `/projects/xtgrid/xtgrid/` |

The public route is `/blogs/`, but the content directory remains `src/content/blogs/`.
Old `/blog/...` URLs are kept as meta-refresh redirects in `src/pages/blog/`.

### Pages

- **Homepage** (`index.astro`) uses `hideFooter` and a full-height `mainClass`. The fixed
  `FootballBackground` canvas sits at z-0; a centered narrow column (`max-w-2xl`) with
  **left-aligned prose** sits at z-10. It has a hidden `<h1>`, three intro paragraphs at
  `font-weight: 500`, and left-aligned social icons. No visible title or section grid.
- **Listings** (`blogs/index.astro`, `projects/index.astro`) sort newest-first and render
  dark cards with cover, date, title, description, tags.
- **Readings** uses the same `font-serif text-4xl` H1 + description scale as
  Blogs/Projects; its data array is empty, so the page shows only the header.
- **Misc** is deliberately **not** a card grid. It is a hand-written editorial page with
  three sections: *Offside Dreams* (documentary), *From Colonials to Collapse* (book with
  first-page preview + expandable in-page PDF reader), and the RSSSF/cfadata archive
  links. Images live in `src/assets/misc/`; the book PDF/HTML live in `public/misc/`.
- **Post pages** render a back link, title, date, cover, MDX content, and social sidebar.
  Blog and project templates are near-copies — change them together.

### Homepage background

`FootballBackground.astro` is a fixed full-viewport canvas with no framework:

- full-bleed dark surface, mowing stripes, halfway line, center circle, penalty spots;
  **no outer pitch border**;
- standard markings at both ends: goals (mouth line + posts only), goal areas, penalty
  areas, penalty spots, penalty "D"; **no net grid**. Box depth derives from width to keep
  the 40.32:16.5 and 18.32:5.5 ratios;
- left/right on desktop, top/bottom on portrait (top goal below the header);
- two 11-player formations that continuously float, with passing lines, moving data
  packets, a ball with a glowing trail, dashed pass arc, pulse rings, player halos, a
  radar sweep on the center circle, ambient flow particles, and a breathing centre glow;
- `prefers-reduced-motion` renders one static frame; pauses when the tab is hidden.

The mouse repels players within 130px. Keep canvas z-0 and content above it.

### BaseLayout props

- `title` (required), `description`
- `coverImageUrl` / `coverImageWidth` / `coverImageHeight` — OG meta
- `showSocialSidebar` — vertical social icons on post pages
- `hideFooter` — homepage
- `fullScreen` — `h-screen overflow-hidden` body (currently unused)
- `mainClass` — replaces the default `<main>` classes (`max-w-3xl mx-auto px-6 py-12`)

### Social icons

`SocialIcons.astro` renders inline SVGs: Instagram, X, LinkedIn, GitHub, Gmail, CMU email.
The Gmail "M" links to `shawnhdx0710@gmail.com`; the graduation cap links to
`dexuanh@andrew.cmu.edu`. Used horizontally on the homepage and vertically on post pages.

### Theme & typography

```css
--color-cream: #0e1410;       /* page background */
--color-warm-white: #141c16;  /* card surface */
--color-ink: #f2efe7;         /* main text */
--color-soft-ink: #a7b0a7;    /* secondary text */
--color-accent: #8ab4ff;      /* links */
--color-accent-warm: #e0a45e;
--color-border: rgba(242,239,231,0.12);
--font-sans: 'Inter';
--font-serif: 'Newsreader';
--font-mono: 'JetBrains Mono';
```

`html` sets `color-scheme: dark`; `body` uses `bg-cream` / `text-ink`. Cards use
`bg-warm-white` + `border-white/10`; article text is `#d6ddd5`; Shiki is `github-dark`;
theme color is `#0e1410`. Token names are historical (`--color-cream` is dark).

## Content workflows

### Add a blog post

1. Create `src/content/blogs/<slug>/`.
2. Add `<slug>.mdx` with `title`, `description`, `date`, `coverImage`, `tags`.
3. Put images in the same directory, reference `./filename.ext`.
4. It appears at `/blogs/<slug>/<slug>/`.

### Add a project

Same pattern under `src/content/projects/<slug>/`; it appears at
`/projects/<slug>/<slug>/`. Link to the project's separate code repo in the body.

### Add a standalone interactive page

Static HTML goes in `public/`; current example:
`public/projects/xtgrid/xt_voxel_terrain.html` →
`/projects/xtgrid/xt_voxel_terrain.html`, linked with `../xt_voxel_terrain.html`.

### Add a reading

Edit the `readings` array at the top of `src/pages/readings/index.astro`:
`{ title, authors, year, link, note }`. Empty array → header only.

### Add a misc item

Misc is hand-written in `src/pages/misc/index.astro` (no card array). Add a `<section>`
with the same eyebrow/H2/body rhythm, put images in `src/assets/misc/`, and static
PDF/HTML in `public/misc/`. The book section uses a first-page image plus a collapsible
`<details>` PDF iframe so the page never shows a blank reader by default.

## Deploy & verification

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` (Node 22) →
`npm run build` → Pages. After pushing, verify real URLs:

```bash
for u in / /blogs/ /projects/ /readings/ /misc/ \
         /blogs/event-datasets/event-datasets/ \
         /projects/xtgrid/xtgrid/ /projects/xtgrid/xt_voxel_terrain.html; do
  curl -s -o /dev/null -w "%{http_code} $u\n" "https://shawnhdx0710.github.io$u"
done
```

## Known issues & gotchas

1. **Keep this repo public.** GitHub Pages on a private repo needs GitHub Pro/Team; on
   Free, switching to private disables Pages and the site returns 404. Even on paid plans,
   the published Pages site is public.
2. **URL shape is slugified and doubled.** IDs include the `.mdx` basename. Old `/blog/...`
   URLs are meta-refresh redirects in `src/pages/blog/`; don't delete them.
3. **`client:load` / `client:only` with React** caused flash-and-vanish on the homepage.
   Prefer pure Astro/CSS; React is configured but unused.
4. **Tailwind v4 spacing** jumps `mt-48` → `mt-56`; `mt-52` doesn't exist. Use arbitrary
   values like `mt-[13rem]`.
5. **Astro scoped `<style>`** only applies to that component; global styles go in
   `global.css`.
6. **Pages API lags** after deploy; verify with `curl`.
7. **5.2 MB interactive HTML is tracked** in `public/`; intentional, but don't add more
   giant assets casually.
8. **`.DS_Store` files** are scattered and ignored.

## Working conventions

- Shawn pushes straight to `main`; there is no branch/PR workflow. **Do not push unless
  he asks.**
- Always run `npm run build` before declaring a change done; preview with `npm run dev`.
- Keep published URLs stable; check built routes in `dist/`.
- Site copy is English; conversation is Chinese.
- Format content dates with `timeZone: 'UTC'`; otherwise a UTC-midnight YAML date renders
  as the previous day in US zones.
- **Do not add project code, notebooks, raw data, or caches to this repo.** Link to the
  separate project repos instead.
- Don't reformat unrelated files; the repo is intentionally a bit messy.
- Update this file when structure/content changes.

## Preferences

- CMU StatsML student building a sports-analytics portfolio.
- Prefers to preview locally (`npm run dev` → `localhost:4321`) before pushing.
- Edits `.mdx` directly in VS Code — no CMS.
- Clean, minimal design: Newsreader headings, Inter body. Whole site dark; homepage is a
  full-bleed night-pitch treatment with centered narrow left-aligned prose.
- About Shawn: from Shanghai; plays soccer and basketball; enjoys sports analytics,
  collecting jerseys and 1:64 car models, cooking, and the humanities.
- Design reference: nathanchen.me — centered, quiet, serif-led, subtle full-screen
  animation. Shawn wants a football version: dark, edge-to-edge, no visible pitch
  boundary, no homepage section grid.
- Social: Instagram, X, LinkedIn, GitHub, Gmail, CMU email (inline SVGs, no icon library).
- Long-form writing values concrete numbers, tables, and reproducible pipelines.

## Possible housekeeping (not done — ask first)

- Create a repo for StatsBomb Passmap Explorer when its code is ready (15-112).
- Optionally flatten the doubled URLs via `generateId` + redirects (changes live links).
- `.claude/settings.local.json` was modified before this session; leave it alone unless
  you want Claude Code permissions versioned.
