# React Movie Booking App

Movie ticket booking frontend: public site and admin, built with React and a REST API (Cybersoft-style endpoints).

**Purpose:** This repository is a **learning / coursework** project (training exercise). It is **not** intended as a production-ready product; focus is on practicing React, routing, state, and API integration step by step.

## Run locally

**Requirements:** Node.js 18+ (LTS recommended)

```bash
npm install
cp .env.example .env
npm run dev
```

Set variables in `.env` (see `.env.example`): `VITE_API_BASE_URL`, `VITE_TOKEN_CYBERSOFT`, `VITE_MA_NHOM`. Open the URL shown in the terminal (usually `http://localhost:5173`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Stack

| Area | Choice |
|------|--------|
| UI | React 19, JSX (`.jsx`) |
| Build | Vite 8, `@vitejs/plugin-react` |
| Routing | React Router 7 (`BrowserRouter`, lazy routes) |
| State | Redux Toolkit + React Redux |
| HTTP | Axios (`src/services/api.js`) |
| Styling | Tailwind CSS v4 + Flowbite (no `flowbite-react`) |
| Notifications | `react-toastify` |
| Modals / alerts | SweetAlert2 (`sweetalert2`) |
| Lint | ESLint (flat config) |

## Main routes

Configured in `src/routes/index.jsx`.

| Path | Page |
|------|------|
| `/`, `/home` | Home |
| `/login`, `/register` | Sign in / Sign up |
| `/detail/:maPhim` | Movie detail |
| `/ticketroom/:maLichChieu` | Ticket room |
| `/profile` | Profile |
| `/news`, `/about-us`, … | Static / content pages |
| `/admin`, `/admin/...` | Admin area |
| `*` | Not found |

## Roadmap (T00–T12)

| ID | Scope |
|----|--------|
| T00–T05 | Setup through booking and auth |
| T06 | Route guards and auth hardening |
| T07–T09 | Admin: films, showtimes, users |
| T10 | Review and refactor |
| T11 | Profile UI and API |
| T12 | Deploy |

**Current focus:** T06 (route guards), 1/5 — next: Step 2 (RequireAdmin).

## Repository layout

```text
src/
  App.jsx, main.jsx, routes/, pages/, components/, store/, services/, utils/
public/
```
