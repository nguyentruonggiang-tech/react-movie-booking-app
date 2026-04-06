# React Movie Booking App

Frontend training project for a movie ticket booking system (user side + admin side).

The main goal is simple: build the app step by step from a clean React foundation, then integrate real APIs and role-based flows.

## Project Scope

- Course assignment project (not a production release).
- Built with a real team workflow: small commits, task branches, PR review.
- Written to be readable and maintainable for both grading and portfolio review.

## Tech Stack (current)

- React
- Vite
- React Router DOM
- Redux Toolkit + React Redux
- Axios
- Tailwind CSS
- Flowbite + Flowbite React
- ESLint

## Roadmap

Planned milestones (T00–T11). Routing and layout templates are part of **T00** (not a separate task).

- **Overall Tasks**
  1. T00 — project setup (includes route skeleton + `HomeTemplate` / `AdminTemplate`)
  2. T01 — app-core-setup
  3. T02 — home UI + API
  4. T03 — detail UI + API
  5. T04 — booking UI + API
  6. T05 — auth/profile UI + API
  7. T06 — route guards and auth flow hardening
  8. T07 — admin films UI + API
  9. T08 — admin showtime UI + API
  10. T09 — admin users UI + API
  11. T10 — review and refactor
  12. T11 — deploy and release
- **Current Focus**
  - T00 (2/2 done)
    - [x] Step 1: Base setup
    - [x] Step 2: Create base folder structure + route skeleton
  - T01 — app-core-setup (1/1 done)
    - [x] Step 1: API client + constants + localStorage helpers

## Repository Structure (at this milestone)

```text
react-movie-booking-app/
  src/
    App.jsx
    main.jsx
    index.css
    constants/
    routes/
    pages/
    store/
    services/
      api.js
    utils/
      storage.js
  public/
  package.json
```

## Run locally

Requirements:

- Node.js 18+ (LTS recommended)

Commands:

```bash
npm install
cp .env.example .env
npm run dev
```

Environment variables (copy from `.env.example` and fill values):

```bash
VITE_API_BASE_URL=https://movienew.cybersoft.edu.vn/api/
VITE_TOKEN_CYBERSOFT=YOUR_TOKEN_CYBERSOFT_HERE
VITE_MA_NHOM=YOUR_MA_NHOM_HERE
```

Then open the URL shown in terminal (usually `http://localhost:5173`).

## NPM Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
