# React Movie Booking App

Movie ticket booking **frontend** for a Cybersoft-style Movie API: public site (home, detail, booking room) and **admin** (films, users, showtimes). Built with **React 19**, **Vite 8**, **Redux Toolkit**, and **React Router 7**.

**Purpose:** This repository is a **learning / coursework** project. It is **not** a production-ready product; the goal is to practice React, routing, global state, forms, and REST integration.

---

## Requirements

- **Node.js** 18+ (LTS recommended)
- **npm** (see `package-lock.json`)

---

## Quick start

```bash
npm install
cp .env.example .env
```

Edit `.env` and set real values for your Cybersoft Movie API account (see [Environment variables](#environment-variables)). **Never commit** `.env` or real tokens.

```bash
npm run dev
```

Open the URL printed in the terminal (default **http://localhost:5173**).

```bash
npm run build    # output: dist/
npm run preview  # serve dist/ locally
npm run lint     # ESLint (flat config)
```

---

## Environment variables

Defined in `.env.example` and read via `import.meta.env` in `src/constants/index.js`.

| Variable | Description |
|----------|-------------|
| `VITE_SITE_NAME` | Optional site title (fallback in constants). |
| `VITE_API_BASE_URL` | REST API base URL (e.g. Cybersoft Movie API). |
| `VITE_TOKEN_CYBERSOFT` | `TokenCybersoft` header for API access. |
| `VITE_MA_NHOM` | Group code sent on relevant requests (e.g. `GP01`). |
| `VITE_ACCESS_TOKEN_TTL_MS` | Optional client-side session hint (ms); default 1 hour in constants. |

The Axios instance in `src/services/api.js` attaches `TokenCybersoft` and `Authorization: Bearer <token>` when a token exists in `localStorage` (see `src/utils/storage.js`).

---

## Tech stack

| Area | Choice |
|------|--------|
| Language | JavaScript (ES modules), **JSX** in `.jsx` |
| UI | React 19, React DOM 19 |
| Build | Vite 8, `@vitejs/plugin-react`, `@tailwindcss/vite` |
| Routing | React Router 7 (`BrowserRouter`, config + `lazy()` in `src/routes/index.jsx`) |
| State | Redux Toolkit, React Redux (`src/store/index.js`) |
| HTTP | Axios singleton `src/services/api.js` |
| Styling | Tailwind CSS v4, Flowbite theme/plugin in `src/index.css` |
| Icons | `flowbite-react-icons` |
| Notifications | `react-toastify` |
| Modals | SweetAlert2 (`sweetalert2`) |
| Lint | ESLint 9 (flat config `eslint.config.js`) |

---

## Path aliases (Vite)

| Alias | Path |
|-------|------|
| `@` | `src/` |
| `@pages` | `src/pages/` |
| `@services` | `src/services/` |
| `@components` | `src/components/` |
| `@routes` | `src/routes/` |
| `@constants` | `src/constants/` |
| `@utils` | `src/utils/` |
| `@shared` | `src/shared/` |

---

## Main routes

Configured in `src/routes/index.jsx`. Lazy-loaded pages unless noted.

### Public (home template, base path `/`)

| Path | Page |
|------|------|
| `/` | Home (banner, movie list, theaters) |
| `/detail/:maPhim` | Movie detail + showtimes |
| `/ticketroom/:maLichChieu` | Seat map / booking room |
| `/profile` | User profile (**requires auth**) |
| `/news`, `/about-us`, `/privacy-policy`, `/terms-of-service`, `/contact` | Content / static pages |

### Auth

| Path | Page |
|------|------|
| `/login` | Login |
| `/register` | Register |

### Admin (`requiresAuth` + `requiresAdmin`, base `/admin`)

| Path | Page |
|------|------|
| `/admin`, `/admin/dashboard` | Dashboard |
| `/admin/films` | Film list |
| `/admin/films/addnew` | Add film |
| `/admin/films/edit/:idFilm` | Edit film |
| `/admin/films/showtime/:idFilm` | **Create showtime** for a film (theater chain → cluster, date/time/price, day schedule sidebar) |
| `/admin/users` | User list (search + pagination) |
| `/admin/users/add` | Add user |
| `/admin/users/edit/:taiKhoan` | Edit user |
| `/admin/profile` | Admin profile |

### Other

| Path | Page |
|------|------|
| `*` | Page not found |

Guards: `ProtectedRoute`, `RequireAdmin`. Roles: **customer** and **admin** only.

---

## Repository layout

```text
src/
  App.jsx                 — providers, layout shell
  main.jsx
  index.css               — Tailwind + Flowbite sources
  routes/index.jsx        — route table, lazy(), renderRoutes()
  constants/index.js      — env + app constants
  services/api.js         — Axios instance + interceptors
  store/index.js          — configureStore, reducers
  utils/                  — storage, dates, theme, navigation, …
  components/             — shared (ProtectedRoute, RequireAdmin, …)
  shared/                 — shared UI/lib (e.g. toast helpers)
  pages/
    Auth/                 — Login, Register
    HomeTemplate/         — Home, Detail, TicketRoom, Profile, News, …
    AdminTemplate/
      Dashboard/
      Films/              — list, add, edit, slice, _components/
      Users/              — list, add, edit, slice, _components/
      ShowTime/           — create showtime page
        index.jsx         — film + schedule fetch, day filter for sidebar
        slice.js          — adminShowtime (movie, systems, clusters, create, schedule)
        utils.js          — schedule flatten / match by day
        _components/      — CreateShowtimeForm, DayScheduleList, SelectedMovieCard, …
      _components/        — Sidebar, TopBar, ErrorBox, …
    PageNotFound/
public/
```
---

## Course / roadmap snapshot

| ID | Scope (high level) |
|----|---------------------|
| T00–T05 | Setup, listing, detail, ticket room, auth |
| T06 | Route guards, session handling |
| T07 | Admin films (CRUD-style list / add / edit) |
| T08 | Admin showtimes — **create flow** for a selected film |
| T09 | Admin users — list, search, pagination, add, edit |
| T10–T12 | Hardening, profile polish, deploy (as planned by course) |

Adjust IDs to match your own syllabus if they differ.

---

## Troubleshooting

- **401 / session expired:** API interceptor clears stored user and redirects toward login with return URL; see `api.js`.
- **Blank API responses:** Confirm `VITE_API_BASE_URL`, `VITE_TOKEN_CYBERSOFT`, and `VITE_MA_NHOM` in `.env` (no trailing mistakes, correct group code).
- **Build:** Ensure all env vars used in code exist at build time if you reference them without fallbacks.

---

## License

Private / coursework — use according to your school or team policy. Third-party libraries follow their respective licenses.