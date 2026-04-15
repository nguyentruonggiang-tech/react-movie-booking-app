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
| Notifications | `react-toastify` (`ToastContainer` in `App.jsx`; used after successful sign-in) |
| Lint | ESLint (flat config) |

## User-facing routes (English paths)

Defined in `src/routes/index.jsx` (code-split with `lazy()`).

| Path | Page |
|------|------|
| `/`, `/home` | Home (`HomeTemplate` layout: Header / Outlet / Footer) |
| `/login`, `/register` | Sign in / Sign up — **full-page** routes, **not** wrapped by `HomeTemplate` (see [Authentication (login)](#authentication-login)) |
| `/detail/:maPhim`, `/ticketroom/:maLichChieu`, `/profile` | Detail, ticket room, profile |
| `/news` | News |
| `/about-us`, `/privacy-policy`, `/terms-of-service`, `/contact` | Static shells (`AboutUs`, `PrivacyPolicy`, `TermsOfService`, `Contact`) |
| Admin | `/admin`, `/admin/films`, … (see routes file) |
| `*` | Page not found |

## Authentication (login)

Sign-in is wired to the Cybersoft Movie API (`QuanLyNguoiDung/DangNhap`) and Redux.

| Piece | Role |
|-------|------|
| `src/pages/Auth/slice.js` | `actLogin` (async thunk): POST `{ taiKhoan, matKhau }`, persists API `content` under `localStorage` key `USER_INFO` (`STORAGE_KEY_USER` from `@constants`), `authReducer` state `{ data, loading, error }`. `initialState.data` is hydrated from `localStorage` on app load. |
| `src/store/index.js` | Registers `authReducer` in the store. |
| `src/pages/Auth/Login/index.jsx` | Sign-in form: client validation (username ≥ 4 chars, password ≥ 6), `LoadingOverlay` while `loading`, API errors on the page; after a successful submit: “Signed in successfully” toast (~3s) then `navigate` (or immediate redirect if the user already had a session from storage). |
| `src/utils/authRedirect.js` | `getPathAfterLogin(maLoaiNguoiDung)`: role `QuanTri` → `/admin/dashboard`; `KhachHang` (and default) → `/home`. |
| `src/services/api.js` | Request interceptor: `TokenCybersoft` header plus `Authorization: Bearer <accessToken>` when a token is read via `getAccessTokenFromLocalStorage()` in `src/utils/storage.js` (JSON parse of `USER_INFO`). |
| `src/pages/HomeTemplate/_components/Header/index.jsx` | If `authReducer.data` has `accessToken` or `taiKhoan`, shows the account menu (avatar, `/profile` link); otherwise shows Sign in / Sign up linking to `/login` and `/register`. |

**Note:** `/login` and `/register` render **outside** the `HomeTemplate` shell (unlike nested pages such as Home or Detail).

**Current limitation:** The Header “Sign out” control only closes the dropdown; it does not clear `USER_INFO` or reset `authReducer` yet (planned under **T06** — route guards and hardened auth).

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

- **T03** (3/3 steps): Detail UI + API
  - [x] **Step 1:** Movie detail — `fetchMovieDetail` in `Detail/MovieDetail/slice.js` (`QuanLyPhim/LayThongTinPhim`), `movieDetailReducer` in `store`; `/detail/:maPhim` + `useParams`, cleanup on leave; loading skeleton, error + retry, not-found; `Backdrop` + `MovieInfo` (breadcrumb, poster, title, rating, status badges, synopsis, release date, trailer link when available).
  - [x] **Step 2:** Showtimes — `fetchMovieShowtimes` in `Detail/ShowtimeSection/slice.js` (`QuanLyRap/LayThongTinLichChieuPhim`), `movieShowtimesReducer` in `store`; `Detail/ShowtimeSection/` (theater systems, date tabs, clusters, session chips); loading / error + retry / empty; `NavLink` to `/ticketroom/:maLichChieu`; wired from `Detail/index.jsx` below `MovieDetail`.
  - [x] **Step 3:** Detail polish + structure (follow-up commits for steps 1–2; changelog-style notes kept here)
    - **Shared `HomeTemplate/_components`:** `ErrorBox.jsx` and `NotFound.jsx` for Detail (`MovieDetail`, `ShowtimeSection`) and Home (`BannerCarousel`, `MovieList`, `Theater`). **`HomeTemplate/constants/index.js`:** shell layout tokens (`HOME_HEADER_BAR_CLASS`, `HOME_MAIN_PADDING_TOP_CLASS`) and banner hero `BTN_PRIMARY` / `BTN_SECONDARY`. Neither `ErrorBox` nor `NotFound` accepts `className` — parent wraps layout; `z-index` on wrappers when needed vs. backdrop.
    - **Movie detail (step 1 follow-ups):** slice `data` nullable (`null` when idle/loading/error); thunk returns safe payload (`?? null`); skeleton at `MovieDetail/_components/MovieDetailSkeleton.jsx`.
    - **Showtimes (step 2 follow-ups):** thunk `data?.content ?? null`; `clearMovieShowtimes` on unmount; UI split into `ShowtimeSection/_components/` (`TheaterSystemRail`, `ShowingDateStrip`, `TheaterClusterSessions`, `ShowtimeVerifiedImg`, `ShowtimeSectionSkeleton`); section + grid layout stays in `ShowtimeSection/index.jsx`; `useMemo` / `useCallback` for derived lists and retry; `React.memo` on presenter blocks; `constants.js` + `utils.js` (days/sessions, Maps URL, image probe); `SHOWTIME_NO_IMAGE_URL` from `src/assets/noimage.svg`.

- **T04** (next): Booking UI + API (`TicketRoom`, …).
- **T05** (in progress — login slice): full-page `Auth/Login` UI, `actLogin` thunk, `USER_INFO` session persistence, role-based redirect, Header driven by `authReducer`; route guards and logout clearing storage are expected in **T06** (see roadmap). Details: [Authentication (login)](#authentication-login).

**Next:** T04 — Booking UI + API (`TicketRoom`, …). Basic sign-in (T05) is documented above and in [Authentication (login)](#authentication-login).

## Repository structure (snapshot)

```text
react-movie-booking-app/
  src/
    App.jsx
    main.jsx
    index.css
    assets/
      noimage.svg        # ShowtimeSection: fallback when theater/cluster image URL fails
    constants/
    routes/
      index.jsx
    pages/
      HomeTemplate/
        index.jsx        # layout shell (Header / Outlet / Footer)
        constants/
          index.js       # header/main spacing + banner BTN_* classes
        _components/     # Header/, Footer/, icons.jsx; ErrorBox, NotFound
        Home/
          BannerCarousel/  # T02: slice.js, index.jsx, constants, _components/
          MovieList/       # T02: slice.js, index.jsx, _components/ (MovieCard)
          Theater/         # T02: slice.js, index.jsx, _components/
        AboutUs/
        PrivacyPolicy/
        TermsOfService/
        Contact/
        News/
        Detail/            # T03
          index.jsx        # MovieDetail + ShowtimeSection
          MovieDetail/
            slice.js
            index.jsx
            _components/   # Backdrop, MovieInfo, MovieDetailSkeleton
          ShowtimeSection/
            slice.js
            index.jsx
            constants.js
            utils.js
            _components/   # ShowtimeSectionSkeleton, TheaterSystemRail, ShowingDateStrip,
                           # TheaterClusterSessions, ShowtimeVerifiedImg
        TicketRoom/
        Profile/
      Auth/                # T05: login/register (routes top-level /login, /register)
        slice.js           # actLogin + authReducer
        Login/
        Register/
      AdminTemplate/
      PageNotFound/
    components/
      LoadingOverlay/      # used on the Login page while the API request is in flight
    store/
      index.js             # authReducer, movieDetailReducer, movieShowtimesReducer, …
    services/
      api.js
    utils/
      storage.js           # localStorage + getAccessTokenFromLocalStorage
      authRedirect.js      # getPathAfterLogin(role)
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
