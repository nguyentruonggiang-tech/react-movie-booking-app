# React Movie Booking App

Frontend training project for a movie ticket booking system (user-facing site + admin).

The main goal is to grow the app step by step from a lean React setup, then wire real APIs and role-based flows.

## Project scope

- Course assignment (not a production release).
- Team-style workflow: small commits, feature branches, PR review.
- Readable structure for grading and portfolio use.

## Tech stack

| Area | Choice |
|------|--------|
| UI | React 19, JSX (`.jsx`) |
| Build | Vite 8, `@vitejs/plugin-react` |
| Routing | React Router DOM 7 (`BrowserRouter`, lazy-loaded routes) |
| State | Redux Toolkit + React Redux |
| HTTP | Axios (`src/services/api.js`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`), Flowbite theme/plugin via the `flowbite` package (no `flowbite-react`; markup uses HTML + utility classes) |
| Lint | ESLint (flat config) |

## User-facing routes (English paths)

Defined in `src/routes/index.jsx` (code-split with `lazy()`).

| Path | Page |
|------|------|
| `/` | Home |
| `/login`, `/register` | Login, Register |
| `/detail/:maPhim`, `/ticketroom/:maLichChieu`, `/profile` | Detail, ticket room, profile |
| `/news` | News |
| `/about-us`, `/privacy-policy`, `/terms-of-service`, `/contact` | Static shells (`AboutUs`, `PrivacyPolicy`, `TermsOfService`, `Contact`) |
| Admin | `/admin`, `/admin/films`, … (see routes file) |
| `*` | Page not found |

## Roadmap

Planned milestones **T00–T11**. Route skeleton and layout templates belong to **T00** (not a separate milestone).

**Overall tasks**

1. T00 — Project setup (route skeleton + `HomeTemplate` / `AdminTemplate`)
2. T01 — App core (API client, env, storage helpers)
3. T02 — Home UI + API
4. T03 — Detail UI + API
5. T04 — Booking UI + API
6. T05 — Auth / profile UI + API
7. T06 — Route guards and hardened auth
8. T07 — Admin films UI + API
9. T08 — Admin showtime UI + API
10. T09 — Admin users UI + API
11. T10 — Review and refactor
12. T11 — Deploy and release

**Current focus**

- **T00** (2/2 done): base setup; base folders + route skeleton
- **T01** (1/1 done): API client + constants + `localStorage` helpers
- **T02** (5/5 done)
  - [x] **Step 1:** `HomeTemplate` — Header / Footer (English copy), mobile nav, Sign in / Sign up; fixed footer; static pages wired: `AboutUs`, `PrivacyPolicy`, `TermsOfService`, `Contact`, `News`
  - [x] **Step 2:** Banner — `fetchBannerList` in `Home/BannerCarousel/slice.js`, `Home/BannerCarousel/` (loading / error / empty, autoplay, link to `/detail/:maPhim` when available)
  - [x] **Step 3:** Movie list — `fetchMovieList` in `Home/MovieList/slice.js`, `Home/MovieList/` (tabs Now showing / Coming soon, grid + `MovieCard`, loading / error / empty, links to `/detail/:maPhim`)
  - [x] **Step 4:** Theater systems — `Theater/slice.js` + reducers in `store`, `Home/Theater/` (logos, clusters, showtimes by cluster; loading / error / empty; links `/detail/:maPhim`, `/ticketroom/:maLichChieu`)
  - [x] **Step 5:** Home polish — vertical spacing on `Home/index.jsx` (`flex` + `gap-3`); `MovieList` section padding tightened; `Theater` keeps original `pb-24` section (stable grid vs. `feat(t02): home theather system` commit `d4c05ff`).

- **T03** (in progress): Detail UI + API
  - [x] **Step 1:** Movie detail — `fetchMovieDetail` in `Detail/MovieDetail/slice.js` (`QuanLyPhim/LayThongTinPhim`), `movieDetailReducer` in `store`; `/detail/:maPhim` + `useParams`, cleanup on leave; loading skeleton, error + retry, not-found; `Backdrop` + `MovieInfo` (breadcrumb, poster, title, rating, status badges, synopsis, release date, trailer link when available).
  - [ ] **Step 2:** Showtimes on the detail page + booking links (`/ticketroom/:maLichChieu`).

**Next:** T03 — Step 2.

## Repository structure (snapshot)

```text
react-movie-booking-app/
  src/
    App.jsx
    main.jsx
    index.css
    constants/
    routes/
      index.jsx
    pages/
      HomeTemplate/
        _components/     # Header, Footer, icons.jsx (shared SVGs: Home + Detail)
        Home/
          BannerCarousel/  # T02: slice.js, index.jsx, constants, _components/
          MovieList/       # T02: slice.js, index.jsx, _components/ (MovieCard)
          Theater/         # T02: slice.js, index.jsx, _components/
        AboutUs/
        PrivacyPolicy/
        TermsOfService/
        Contact/
        News/
        Login/
        Register/
        Detail/            # T03: slice.js, index.jsx, _components/ (Backdrop, MovieInfo, Loading, ErrorBox, NotFound)
        TicketRoom/
        Profile/
      AdminTemplate/
      PageNotFound/
    store/
    services/
      api.js
    utils/
      storage.js
  public/
  package.json
  vite.config.js
```

## Run locally

**Requirements:** Node.js 18+ (LTS recommended)

```bash
npm install
cp .env.example .env
npm run dev
```

**Environment variables** (from `.env.example`):

```bash
VITE_API_BASE_URL=https://movienew.cybersoft.edu.vn/api/
VITE_TOKEN_CYBERSOFT=YOUR_TOKEN_CYBERSOFT_HERE
VITE_MA_NHOM=YOUR_MA_NHOM_HERE
```

Open the URL printed in the terminal (usually `http://localhost:5173`).

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
