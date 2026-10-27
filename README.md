# Fitness Hub — storefront template

The energy of a running track for gyms, studios, trainers and sports shops:
a tartan hero whose lane lines sweep in along the photo, categories as the
track's lanes, horizontal cards and session durations on a scoreboard. Design
plan: [`DESIGN.md`](DESIGN.md).

## How it works

React 18 + Vite + Tailwind. Everything the store shows is data — branding,
CMS copy (`home`, `about`, `products`, `contact`), products and services,
categories, contact — read through `src/core/`, vendored from the monorepo's
`templates/_core` (do not edit it here). Template code is the design:
`src/components`, `src/pages`, `src/theme`, `src/i18n`.

`/config.json`: `{ "mode": "demo", "templateId": … }` shows the template's demo
rows; a provisioned store gets `{ "mode": "live", "orgId": … }`.

## Pages

`/` · `/products` (`?type=`, `?category=`, `?sale=1`, `?q=`, `?sort=`) ·
`/products/:id` · `/about` · `/contact` · 404. Old URLs (`/deals`,
`/services`, `/programs`, `/category/:slug`…) redirect into the catalog.

## Effects

CSS and SVG only: the lane lines sweep in once and route changes wipe on a
slant. Reduced motion (the system setting or `?motion=reduce`) shows the
final state.

## Development

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc + vite build → dist/
```

Against a local management-be: `TSURU_DEV_API=http://localhost:5000
VITE_PUBLIC_API_URL=http://localhost:5173 pnpm dev`.

## Deployment

`.github/workflows/deploy.yml`: `develop` → GitHub Pages
(`fitness-hub.examples.tsuru.jcampos.dev`, dev); `main` → production example
hosting (`fitness-hub.examples.tsuru.lat`); each deploy notifies the
provisioner to refresh stores using this template.
