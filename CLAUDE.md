# Shawn Han — Personal Site & Sports Analytics Blog

> Workspace memory for this repo. **Last verified: 2026-10-18.**
> If you change the structure, routes, or pipeline, update this file.

## Overview

A static Astro 6 site at **https://shawnhdx0710.github.io/**. It is both a personal
portfolio/blog and a lab notebook for Python soccer-analytics projects.

- **Live:** https://shawnhdx0710.github.io/
- **Repo:** https://github.com/shawnhdx0710/shawnhdx0710.github.io
- **Deploy:** push to `main` → GitHub Actions → GitHub Pages (no PR previews)
- **Author:** Shawn Dexuan Han — StatsML @ Carnegie Mellon University

## Snapshot (as of 2026-10-18)

- **Git:** the 2026-10-18 fixes are committed locally on `main` (**1 commit ahead of
  `origin/main`, not pushed**). Working tree only has the pre-existing
  `.claude/settings.local.json` modification. `CLAUDE.md` is now tracked; `.cache/`,
  `data/`, `.venv/` are gitignored.
- **Build:** `npm run build` passes — 6 pages, ~2 s. Last CI deploy succeeded (2026-08-16).
- **Live:** homepage, `/blog/`, `/projects/`, both posts, the project page, and the
  interactive HTML all return 200.
- **Local toolchain:** Node v24.15.0, npm 11.12.1. `package.json` requires Node >=22.12;
  CI pins Node 22.
- **Python:** use the repo-local `.venv` (created 2026-10-18) — `.venv/bin/python
  scripts/...` works. The global `python3` is still broken (NumPy 2 vs PyArrow ABI), so
  always use the venv. See Known Issues #1.
- **Content:** 2 blog posts, 1 project.

| Type | Source | Date | Tags | Live URL |
|------|--------|------|------|----------|
| Blog | `blogs/maradona-1986` | 2026-06-11 | Soccer Analytics, Event data, Visualization | `/blog/maradona-1986/maradona-1986/` |
| Blog | `blogs/event-datasets` | 2026-07-31 (updated 2026-08-09) | Open Data, Soccer Analytics | `/blog/event-datasets/event-datasets/` |
| Project | `projects/xTgrid` | 2026-06-20 | Soccer Analytics, Data Engineering, xT, Python | `/projects/xtgrid/xtgrid/` |

The **event-datasets** post is a "living document" — update its `Last updated:` line
whenever the guide changes. The **xTgrid** project has a companion interactive page at
`/projects/xtgrid/xt_voxel_terrain.html` (5.2 MB self-contained Plotly HTML).

## Commands

```bash
npm install       # once
npm run dev       # dev server, localhost:4321, hot reload
npm run build     # production build → dist/
npm run preview   # serve the built output locally
```

Deploy is just `git push` to `main`; GitHub Actions does the rest.

Python pipeline — always use the repo-local venv (the global `python3` is broken):

```bash
python3 -m venv .venv                     # one-time setup
.venv/bin/pip install -r requirements-xt.txt
.venv/bin/python scripts/01_cache_spadl.py          # populate sb_cache (already complete — no-op)
.venv/bin/python scripts/02_train_xt.py             # train 32×24 grid → output/xt_grid_32x24.*
.venv/bin/python scripts/03_visualize_xt.py         # 2D heatmap → output/xt_heatmap_32x24.png
.venv/bin/python scripts/04_voxel_terrain.py        # 3D voxel PNG → output/xt_voxel_terrain.png
.venv/bin/python scripts/05_voxel_terrain_plotly.py # interactive HTML → output/xt_voxel_terrain.html
```

## Repository map

```
/
├── src/
│   ├── components/
│   │   ├── Header.astro            # sticky nav: Home / Projects / Blog
│   │   ├── Footer.astro            # school + copyright
│   │   ├── MosaicBackground.astro  # pure-CSS 5×2 flip grid (2×2 on mobile)
│   │   └── SocialIcons.astro       # inline SVG: Instagram, X, LinkedIn
│   ├── content/
│   │   ├── blogs/
│   │   │   ├── maradona-1986/      # .mdx + charts + notebook (dev reference)
│   │   │   └── event-datasets/     # .mdx + cover + screenshot
│   │   └── projects/
│   │       └── xTgrid/             # .mdx + pipeline/heatmap/terrain images
│   ├── content.config.ts           # collections: blog, projects (glob loader)
│   ├── layouts/BaseLayout.astro    # head/OG, header, footer, social sidebar
│   ├── pages/
│   │   ├── index.astro             # homepage: mosaic + headline + CTA
│   │   ├── blog/index.astro        # post listing
│   │   ├── blog/[...slug].astro    # post template
│   │   ├── projects/index.astro    # project listing
│   │   └── projects/[...slug].astro# project template
│   └── styles/global.css           # Tailwind v4 theme + article typography
├── public/
│   ├── images/mosaic/              # front-01..10.webp, back-01..10.webp
│   └── projects/xtgrid/            # xt_voxel_terrain.html (tracked, 5.2 MB)
├── scripts/                        # xT pipeline (01..05) + xt_utils.py
├── sb_cache/spadl_parquet/         # 3,927 cached Parquets, ~210 MB (gitignored)
├── output/                         # trained grid + renders (gitignored)
├── .venv/                          # local Python env, NumPy 1.x + PyArrow 16 (gitignored)
├── data/1986-wc/                   # valid offline copy of match 3750191 (gitignored)
├── .cache/                         # statsbombpy joblib cache (gitignored)
├── dist/                           # build output (gitignored)
├── .github/workflows/deploy.yml    # CI: npm ci → build → Pages
├── astro.config.mjs                # site URL + react/mdx/tailwind integrations
├── package.json                    # Astro 6, React 19, Tailwind 4
├── requirements-xt.txt             # Python 3.12 pins for the xT pipeline
├── tsconfig.json                   # extends astro/tsconfigs/strict
└── CLAUDE.md                       # this file
```

## How the site is put together

### Collections & routing

`src/content.config.ts` defines two collections with Astro's **glob loader**:

- `blog` → `./src/content/blogs/**/*.mdx`
- `projects` → `./src/content/projects/**/*.mdx`
- Shared schema: `title`, `description?`, `date` (coerced to `Date`), `coverImage?`
  (Astro image), `tags?` (default `[]`).

**Important:** collection IDs are Astro slugs derived from the file path *including the
filename*, and they are **lowercased**. This produces the site's URL shape:

| File | ID | URL |
|------|----|-----|
| `blogs/event-datasets/event-datasets.mdx` | `event-datasets/event-datasets` | `/blog/event-datasets/event-datasets/` |
| `blogs/maradona-1986/maradona-1986.mdx` | `maradona-1986/maradona-1986` | `/blog/maradona-1986/maradona-1986/` |
| `projects/xTgrid/xTgrid.mdx` | `xtgrid/xtgrid` | `/projects/xtgrid/xtgrid/` |

So blog/project URLs contain a **doubled segment**, and uppercase directory names are
slugified (`xTgrid` → `xtgrid`). Keep the `<dir>/<dir>.mdx` convention; published URLs
depend on it. Changing it would require redirects.

### Pages

- **Homepage** (`index.astro`) uses `fullScreen` + `hideFooter`. The mosaic is absolutely
  positioned over the top 50vh with a gradient fade to cream; the headline
  "ALL IN THE GAME." sits over it in white with a text shadow. Below: intro paragraph,
  Blog/Projects pills, horizontal social icons.
- **Listings** (`blog/index.astro`, `projects/index.astro`) call `getCollection`, sort
  newest-first, and render cards with cover, date, title, description, tags.
- **Post pages** (`*/[...slug].astro`) render a back link, title, date, cover image, MDX
  content, and `showSocialSidebar`. Both templates are nearly identical copies — change
  them together.

### BaseLayout props

`src/layouts/BaseLayout.astro`:

- `title` (required), `description`
- `coverImageUrl` / `coverImageWidth` / `coverImageHeight` — OG image meta
- `showSocialSidebar` — floating vertical social icons (post pages)
- `hideFooter` — homepage
- `fullScreen` — `h-screen overflow-hidden` body (homepage)
- `mainClass` — appended to `<main>` classes

It also sets `og:title`, `og:description`, `og:type=article`, and a `twitter:card` that
switches between `summary_large_image` and `summary` based on cover presence.

### Homepage mosaic

`MosaicBackground.astro` uses **zero JavaScript**: static HTML + CSS 3D transforms.
Autonomous flip every 20 s (staggered via `--delay`) plus `:hover` flip on desktop.
Grid constants: `DESKTOP_COLS = 5`, `MOBILE_COLS = 2`, `ROWS = 2`; tiles 1–4 are the only
ones visible on mobile.

### Theme & typography

Tailwind v4 via `@tailwindcss/vite`; tokens in `global.css`:

```css
--color-cream: #faf9f7;     /* page background */
--color-warm-white: #f5f1eb;
--color-ink: #1a1a1a;       /* main text */
--color-soft-ink: #555555;  /* secondary text */
--color-accent: #2563eb;    /* links */
--color-accent-warm: #d97706;
--color-border: #e5e0d8;
--font-sans: 'Inter';
--font-serif: 'Newsreader';
--font-mono: 'JetBrains Mono';
```

Fonts load from Google Fonts in `BaseLayout`. Article typography lives in `global.css`
(`article h2` is centered; tables are borderless with wide first column). Scoped
`<style>` in `.astro` files only applies to that component.

## Content workflows

### Add a blog post

1. Create `src/content/blogs/<slug>/`.
2. Add `<slug>.mdx` (same name as the directory) with:

   ```mdx
   ---
   title: "Post Title"
   description: "Short description for listings and meta tags."
   date: YYYY-MM-DD
   coverImage: ./cover-image.png
   tags: ['Soccer Analytics', 'Visualization']
   ---
   ```

3. Put images in the same directory and reference them as `./filename.ext` (Astro
   optimizes and fingerprints them).
4. It auto-appears on `/blog/` and at `/blog/<slug>/<slug>/`. No registration needed.

### Add a project

Same as a blog post, but under `src/content/projects/<slug>/`; it appears on `/projects/`
at `/projects/<slug>/<slug>/`.

### Add a standalone interactive page

Static HTML that Astro should not process goes in `public/`. Current example:

- `public/projects/xtgrid/xt_voxel_terrain.html` → `/projects/xtgrid/xt_voxel_terrain.html`
- Linked from the project body with a relative link: `../xt_voxel_terrain.html`
  (works because the post URL is one level deeper).

When regenerating from `scripts/05_voxel_terrain_plotly.py`, copy
`output/xt_voxel_terrain.html` over the copy in `public/projects/xtgrid/`.

### Update mosaic images

1. Put images in `public/images/mosaic/`.
2. Naming: `front-01.webp` … `front-10.webp` and `back-01.webp` … `back-10.webp`
   (pairs must both exist).
3. Front = sports photos, back = data visualizations.
4. Tiles 1–4 show on mobile; all 10 on desktop. Grid size is set by the constants in
   `MosaicBackground.astro`.

## xT pipeline (`scripts/`)

End-to-end Expected Threat grid trained from StatsBomb Open Data on an M1 MacBook Air
(8 GB RAM). The write-up is the `xTgrid` project post.

| Step | Script | What it does | Output |
|------|--------|--------------|--------|
| 1 | `01_cache_spadl.py` | Fetch every open match, convert to SPADL, cache Parquet (resumable) | `sb_cache/spadl_parquet/` — 3,927 files, ~210 MB |
| 2 | `02_train_xt.py` | Train 32×24 xT grid via `socceraction.ExpectedThreat` | `output/xt_grid_32x24.{npy,csv,json}` |
| 3 | `03_visualize_xt.py` | 2D heatmap | `output/xt_heatmap_32x24.png` |
| 4 | `04_voxel_terrain.py` | Matplotlib 3D voxel terrain | `output/xt_voxel_terrain.png` |
| 5 | `05_voxel_terrain_plotly.py` | Self-contained interactive Plotly terrain | `output/xt_voxel_terrain.html` (~5.2 MB) |

- `xt_utils.py` is a **custom StatsBomb→SPADL converter** that bridges modern
  `statsbombpy` (flattened columns) and `socceraction` 1.5.3 (expects legacy nested
  `extra` dicts). This is the core reason the pipeline exists as custom code.
- `requirements-xt.txt` pins `socceraction==1.5.3`, `numpy<2`, `pyarrow<17`, and
  `multimethod<2.0.0` (pandera 0.17 compatibility). Python 3.12; install into `.venv`.
- Reported numbers: 3,927 matches, ~14 M raw events, 13.7 M SPADL actions, 5.6 M moving
  actions, ~17 s training in the writeup; a 2026-10-18 rerun on this machine loaded
  13.67 M actions in 1.6 s and finished in 11 s.
- The cache is **complete**: `01_cache_spadl.py` currently reports every match as cached.
  Regenerating outputs only needs steps 2–5.
- `src/content/blogs/maradona-1986/maradona-1986.ipynb` is a dev reference for that
  post's charts; it is not part of the build.

## Deploy & verification

`.github/workflows/deploy.yml` runs on every push to `main`: `npm ci` (Node 22) →
`npm run build` → `upload-pages-artifact` → `deploy-pages`. No tests, no PR previews.

After pushing, wait ~1 minute, then verify the real URLs (the Pages API can lag):

```bash
for u in / /blog/ /projects/ /blog/event-datasets/event-datasets/ \
         /projects/xtgrid/xtgrid/ /projects/xtgrid/xt_voxel_terrain.html; do
  curl -s -o /dev/null -w "%{http_code} $u\n" "https://shawnhdx0710.github.io$u"
done
```

## Known issues & gotchas

1. **Always run the pipeline with `.venv/bin/python`.** The global `python3`
   (Anaconda, Python 3.12) has NumPy 2.3.1, while its `pyarrow`/`numexpr`/`bottleneck`
   are compiled against NumPy 1.x, so `import pyarrow` fails with
   `numpy.core.multiarray failed to import`. The repo-local `.venv` works (NumPy 1.26.4,
   PyArrow 16.1.0, pandas 2.3.3, socceraction 1.5.3, plotly 7.1.0). Why the pins:
   `socceraction 1.5.3` → `pandera 0.17.2`, which does not support NumPy 2; and
   `pyarrow>=17` requires NumPy 2. Hence `numpy<2` + `pyarrow<17` in
   `requirements-xt.txt`. This is a *different* conflict from the statsbombpy ↔
   socceraction API mismatch documented in the xT writeup (and solved by `xt_utils.py`);
   both are real and both had to be fixed.
2. **URL shape is slugified and doubled.** IDs include the `.mdx` basename and are
   lowercased. Don't rename content directories casually; live URLs and OG tags point at
   them.
3. **`data/1986-wc/3750191.json` was restored on 2026-10-18** to a valid, complete
   2,748-event copy (2.3 MB). It is an offline convenience only: the notebook fetches all
   three matches live from the StatsBomb GitHub repo (`3750191`, `3889148`, `3889149`), so
   the post never depended on this local file. `data/` is now gitignored.
4. **`client:load` / `client:only` with React** caused flash-and-vanish on the homepage.
   Prefer pure Astro/CSS for decorative elements; use React islands only when JS is
   genuinely needed. React is configured (`@astrojs/react`, React 19) but there are
   currently **no** `.tsx`/`.jsx` components.
5. **Tailwind v4 spacing scale** jumps `mt-48` → `mt-56`; `mt-52` does not exist and is
   silently ignored. Use arbitrary values like `mt-[13rem]`.
6. **Astro scoped `<style>`** only styles elements in that `.astro` file. Styles for
   React-rendered content must go in `global.css`.
7. **Pages API lags** after deploy; verify with `curl`, not the API status.
8. **5.2 MB interactive HTML is tracked** in `public/`. It is intentional (served as a
   static asset) but makes clones heavier; don't add more giant assets casually.
9. **`afa-badge.png` is used by the Maradona notebook** (AFA badge on
   `formation-352.svg`); the unused `afa-badge.jpg` was removed on 2026-10-18. Don't
   delete the `.png`.
10. **`.DS_Store` files** are scattered and ignored.

## Working conventions

- Shawn pushes straight to `main`; there is no branch/PR workflow. **Do not push unless
  he asks.**
- Always run `npm run build` before declaring a change done. Use `npm run dev` to preview.
- Keep published URLs stable; check the built routes in `dist/` when unsure.
- Site copy is English; conversation is Chinese.
- Don't reformat or "clean up" unrelated files — the repo is intentionally a bit messy.
- Generated artifacts (`dist/`, `sb_cache/`, `output/`, `.cache/`) stay out of git.
- Keep this file current: update the snapshot/table when content or structure changes.

## Preferences

- CMU StatsML student building a sports-analytics portfolio.
- Prefers to preview locally (`npm run dev` → `localhost:4321`) before pushing.
- Edits `.mdx` directly in VS Code — no CMS.
- Clean, minimal design: Newsreader for headings, Inter for body, cream/ink palette.
- Social: Instagram, X, LinkedIn (inline SVGs, no icon library).
- Long-form writing values concrete numbers, tables, and reproducible pipelines.

## Possible housekeeping (not done — ask first)

- `main` is 1 commit ahead of `origin/main` (fixes + this file). Push when ready; pushing
  triggers a deploy, but the site output is unchanged by these fixes.
- `.claude/settings.local.json` was already modified before this session; leave it alone
  unless you want Claude Code's local permissions versioned.
- Optionally flatten the doubled URLs via a custom `generateId` + redirects (would change
  live links; do it deliberately).
