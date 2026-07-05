# Ojen — Corporate QL Dashboard (Demo)

A self-contained clone of the Ojen corporate portal (inspired by
`demo.theojen.com/en/profile/ql-overview2`), built with **Vue 3 + Vite +
TypeScript + Tailwind CSS**.

The core feature is a **live Quality of Life (QL) calculation engine**: HR
sends pulse-survey links to employees, employees answer an 8-question pulse
survey, and every score on the dashboard (per-metric cards, department
breakdown, primary focus area, and the recommended improvement plan) is
recalculated **instantly and reactively** from the stored survey responses —
no page reload needed. Data is persisted to `localStorage` so it survives a
refresh (there is no backend in this demo).

## Pages

- **QL Dashboard** (`/en/profile/ql-overview`) — headline QL score gauge,
  the 7 QL metric cards (Engagement, Stress, Alignment, Energy, Workload
  Balance, Growth & Dev, Team Connection), department focus overview, and a
  dynamically generated 3-option improvement plan.
- **Corporate Profile** (`/en/profile`) — account stats, baseline survey
  answers, account details.
- **Employees** (`/en/employees`) — send pulse-survey invitations, track
  invitation status, and view the employee roster.
- **Subscriptions**, **Bookings**, **Payments** — supporting tabs with
  filtering and mock/store-backed data.
- **Pulse survey** (`/survey/:token`) — the public-facing form employees fill
  out; submitting it updates the dashboard immediately.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Deployment

Pushes to `main` (and the active feature branch) build and deploy
automatically to **GitHub Pages** via `.github/workflows/deploy.yml`. Make
sure the repository's Pages source is set to **GitHub Actions** under
*Settings → Pages*.
