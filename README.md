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

## Current Status

`T00 (2/2)` completed.

- Step 1 completed: base setup (dependencies + Tailwind + Flowbite verified)
- Step 2 completed: base folder structure + route skeleton
- Current UI uses HomeTemplate/AdminTemplate layout placeholders

## Roadmap

- **Overall Tasks**
  1. T00 - project setup
  2. T01 - app core setup
  3. T02 - routing and templates
  4. T03 - home UI + API
  5. T04 - detail UI + API
  6. T05 - booking UI + API
  7. T06 - auth/profile UI + API
  8. T07 - route guards and auth flow hardening
  9. T08 - admin films UI + API
  10. T09 - admin showtime UI + API
  11. T10 - admin users UI + API
  12. T11 - review and refactor
  13. T12 - deploy and release
- **Current Focus**
  - T00 (2/2 done)
    - [x] Step 1: Base setup
    - [x] Step 2: Create base folder structure + route skeleton
  - T01 (next): App core setup

## Repository Structure (at this milestone)

```text
react-movie-booking-app/
  src/
    App.jsx
    main.jsx
    index.css
    routes/
    pages/
    store/
    services/
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

Environment variables (`.env`):

```bash
VITE_API_BASE_URL=https://domain.xyz/api/
VITE_TOKEN_CYBERSOFT=YOUR_TOKEN_CYBERSOFT_HERE
```

Then open the URL shown in terminal (usually `http://localhost:5173`).

## NPM Scripts

- `npm run dev` - start development server
- `npm run build` - build for production
- `npm run preview` - preview production build
- `npm run lint` - run ESLint
