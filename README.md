# Portfolio · Víctor López Rodríguez

Bilingual (EN/ES) portfolio built with [Astro](https://astro.build). Static output, plain CSS, and one small client script.

## Run it

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
npm run check    # type-check (.astro and .ts)
```

Needs Node 20+.

## How it is organised

```
src/
  pages/
    index.astro         picks a language (saved choice, then browser) and redirects
    [lang]/index.astro  the site: /en/ and /es/ are generated from this one page
  layouts/Base.astro    <head>, SEO (title, description, canonical, hreflang), header, footer
  components/           one file per view: Home, Career, Hoopline, About, Contact
  i18n/
    en.ts, es.ts        all static copy; es.ts is typed against en.ts so a missing key fails the check
    index.ts            getDict(lang)
  data/                 bilingual data the browser script renders: architecture, career, how-i-work,
                        hoopline (stats, repo tour), screenshots (App Store images), site (contact email)
  scripts/main.js       router (#view-subview), theme, architecture explorer, career trace,
                        screenshot gallery, test-run terminal, command palette
  styles/global.css     design tokens and every style
  assets/               photos
public/favicon.svg
public/screens/<lang>/  App Store screenshots as WebP (en, es, fr, de)
public/cv/            CV PDFs (en, es); sources in cv/
```

### Editing copy

Static text lives in `src/i18n/en.ts` and `es.ts`. Change both together. Texts that are generated in
the browser (flows of the architecture explorer, career timeline, repo tour, test run) live in
`src/data/` as `[en, es]` pairs. Only the command palette labels stay in `src/scripts/main.js`, through
`t("English", "Español")`.

### Screenshots

Images are in `public/screens/<lang>/<id>.webp`; the list and alt text are in `src/data/screenshots.js`.
Remove an id from that list to take a screenshot off the site.

### CV

`cv/cv.en.html` and `cv/cv.es.html` are the sources of the downloadable CV (A4, one page). The PDFs the
site serves are `public/cv/Victor-Lopez-CV-en.pdf` and `-es.pdf`, linked from `src/data/site.js`.
To regenerate one: open the HTML file in Chrome, print, choose A4, margins None, turn on Background
graphics, and save as PDF over the file in `public/cv/`. Keep the text in sync with `src/i18n`.

### Fonts

Self-hosted with Fontsource (Bricolage Grotesque, Figtree, DM Mono), imported in `Base.astro`.
No request goes to Google Fonts.

### Language

`/en/` and `/es/` are separate pages, so each one is indexable on its own. The EN/ES switch is a link
to the other page and keeps the current `#view-subview`.

## Deploy (Cloudflare Pages)

Framework preset: Astro. Build command: `npm run build`. Output directory: `dist`.
The domain is `vlopez.dev` (set in `astro.config.mjs`; it feeds canonical, hreflang and the share image).
Static files: `public/og.png` (share image, 1200x630), `robots.txt`, `sitemap.xml` (update if pages are added).

## Not done yet

- Measurable results in the Career section (waiting for the numbers).
