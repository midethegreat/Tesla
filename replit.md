# Tesla Investment Frontend

## Overview
This is a React + TypeScript + Vite frontend application for a Tesla Investment platform. It provides a professional-looking investment platform interface with user authentication, dashboard, KYC verification, and admin panel features.

## Tech Stack
- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS 4
- **Routing:** React Router DOM 7
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Project Structure
```
src/
├── components/
│   ├── admin/        # Admin dashboard components
│   ├── Auth/         # Authentication (Login, Register, Reset)
│   ├── Dashboard/    # User dashboard components
│   ├── Navigation/   # Header, Footer, Layout
│   └── ...           # Landing page components
├── hooks/            # Custom React hooks
├── services/         # API service modules
├── types/            # TypeScript type definitions
├── const/            # Constants
├── Pages/            # Page components
├── App.tsx           # Main app with routing
└── main.tsx          # Entry point
```

## Development
- **Dev Server:** `npm run dev` (runs on port 5000)
- **Build:** `npm run build`
- **Lint:** `npm run lint`

## Configuration
- Vite is configured to run on `0.0.0.0:5000` with `allowedHosts: true` for Replit compatibility
- Path alias `@` maps to `./src`

## Deployment
- Static deployment configured
- Build output: `dist/`
- Build command: `npm run build`

## Recent Changes
- January 2026: Initial import to Replit, configured for Replit environment
