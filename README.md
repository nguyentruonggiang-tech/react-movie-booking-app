# React Movie Booking App

Movie ticket booking frontend: public site and admin, built with React and a REST API.

**Purpose:** This repository is a **learning / coursework** project (training exercise). It is **not** intended as a production-ready product; focus is on practicing React, routing, state, and API integration step by step.

## Run locally

**Requirements:** Node.js 18+ (LTS recommended)

```bash
npm install
cp .env.example .env
npm run dev
```

Configure `.env` using `.env.example` as a template. Open the URL shown in the terminal (usually `http://localhost:5173`).

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
| `/` | Home |
| `/login`, `/register` | Sign in / Sign up |
| `/detail/:maPhim` | Movie detail |
| `/ticketroom/:maLichChieu` | Ticket room |
| `/profile` | Profile |
| `/news`, `/about-us`, … | Static / content pages |
| `/admin`, `/admin/...` | Admin area |
| `/admin/users` | Admin user list (search + pagination) |
| `/admin/users/add` | Add user (`Users/add.jsx`, same pattern as `Films/add.jsx`) |
| `/admin/users/edit/:taiKhoan` | Edit user (`Users/edit.jsx`) |
| `/admin/films/showtime/:idFilm` | Create showtime for a film (`ShowTime/index.jsx`) |
| `*` | Not found |

## Roadmap (T00–T12)

| ID | Scope |
|----|--------|
| T00–T05 | Setup through booking and auth |
| T06 | Route guards and auth hardening |
| T07 | Admin: films (list, add, edit, delete) — **complete** |
| T08–T09 | Admin: showtimes, users |
| T10 | Review and refactor |
| T11 | Profile screen |
| T12 | Deploy |

**Completed (T09 partial):** Admin users — list/search with pagination (`Users/index.jsx` + `users` Redux slice), **Add user** (`Users/add.jsx`), **Edit user** (`Users/edit.jsx`, load user then save), shared `UserForm` (add/edit), lazy routes, sidebar **Users** submenu, table + CTA, loading/error/empty states.

**Current focus:** T08 admin showtimes — create flow (`/admin/films/showtime/:idFilm`); verify API + booking (T04); T09 polish as needed.

## Repository layout

```text
src/
  App.jsx, main.jsx
  routes/index.jsx          — route table + lazy imports
  pages/
    HomeTemplate/ …
    AdminTemplate/
      Films/                — index.jsx (list), add.jsx, edit.jsx, slice.js, _components/
      Users/                — index.jsx (list), add.jsx, edit.jsx, slice.js, _components/ (UserForm, …)
      ShowTime/, Dashboard/, _components/ (Sidebar, …)
  components/, store/, services/, shared/, utils/
public/
```
