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
- **T02** (5/5 done): Home UI + API
  - [x] **Step 1:** `HomeTemplate` — header/footer, mobile nav, static routes (`AboutUs`, `News`, …).
  - [x] **Step 2:** `Home/BannerCarousel/` — `fetchBannerList` in `slice.js`; loading / error / empty; links to `/detail/:maPhim`.
  - [x] **Step 3:** `Home/MovieList/` — `fetchMovieList` in `slice.js`; tabs + grid; `/detail/:maPhim`.
  - [x] **Step 4:** `Home/Theater/` — `Theater/slice.js` in `store`; clusters + showtimes; `/detail/:maPhim`, `/ticketroom/:maLichChieu`.
  - [x] **Step 5:** `Home/index.jsx` layout spacing + section padding polish.

- **T03** (3/3 done): Detail UI + API
  - [x] **Step 1:** `Detail/MovieDetail/` — `fetchMovieDetail` (`QuanLyPhim/LayThongTinPhim`), `/detail/:maPhim`, skeleton + error + not-found.
  - [x] **Step 2:** `Detail/ShowtimeSection/` — `fetchMovieShowtimes` (`QuanLyRap/LayThongTinLichChieuPhim`); dates / clusters / chips → `/ticketroom/:maLichChieu`.
  - [x] **Step 3:** Shared `ErrorBox` / `NotFound`; `ShowtimeSection/_components/` split + `constants.js` / `utils.js` polish.

- **T04** (in progress): Booking — scope & steps: [`docs/T04_IMPLEMENTATION_GUIDE.md`](docs/T04_IMPLEMENTATION_GUIDE.md).
  - [x] **Step 1:** `/ticketroom/:maLichChieu` — `TicketRoom/slice.js` (`fetchTicketRoom`, `QuanLyDatVe/LayDanhSachPhongVe`), `ticketRoomReducer` in `store/index.js`, `TicketRoom/index.jsx` + `SeatMap` / `seatStyles.js` / `seatDisplay.js`: load film + seat rows from API (`content.danhSachGhe`, map `giaVe` → `gia` per seat), loading / error / not-found.
  - [x] **Step 2:** Seat selection + pricing — `toggleSeat` / `removeSeat`, `selectedSeats` persisted (`STORAGE_KEY_SELECTED_SEATS`), merge selection into rows for `dangChon`; `TicketRoomSummary` (per-seat `gia`, total, selected table); booked / held / VIP vs standard styling + legend (`SEAT_LEGEND_ITEMS`); Book CTA disabled until seats chosen (submit = Step 3).
  - [ ] **Step 3:** Booking submit + feedback UI
  - [ ] **Step 4:** QA + lint polish

**Next:** T04 Step 3: booking submit API + confirm / success / error UI.

## Repository structure (snapshot)

```text
react-movie-booking-app/
  src/
    App.jsx
    main.jsx
    index.css
    assets/
      noimage.svg
    constants/
    routes/
      index.jsx
    pages/
      HomeTemplate/
        index.jsx
        constants/
          index.js
        _components/
        Home/
          BannerCarousel/
          MovieList/
          Theater/
        AboutUs/
        PrivacyPolicy/
        TermsOfService/
        Contact/
        News/
        Login/
        Register/
        Detail/ 
          index.jsx
          MovieDetail/
            slice.js
            index.jsx
            _components/
          ShowtimeSection/
            slice.js
            index.jsx
            constants.js
            utils.js
            _components/
        TicketRoom/
          index.jsx
          slice.js
          seatStyles.js
          seatDisplay.js
          mockSelectedSeats.js
          _components/
            SeatMap.jsx
            Seat.jsx
            TicketRoomSummary.jsx
        Profile/
      AdminTemplate/
      PageNotFound/
    store/
      index.js 
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
