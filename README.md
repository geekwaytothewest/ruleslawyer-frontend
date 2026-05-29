# ruleslawyer-frontend

The web frontend for the **Geekway to the West Library Management System** — a library management and Play and Win event tool built for and by [Geekway to the West](https://geekway.com). It provides a dashboard for managing organizations, conventions, collections, games, copies, and users, backed by the [ruleslawyer-backend](https://github.com/geekwaytothewest/ruleslawyer-backend) API.

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router, standalone output) with React 19
- [HeroUI](https://www.heroui.com/) component library
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Auth0](https://auth0.com/) (`@auth0/nextjs-auth0`) for authentication
- [SWR](https://swr.vercel.app/) for client-side data fetching

The app is mounted under the `/ruleslawyer` base path (see `next.config.mjs`).

## Getting started

Install dependencies and copy the environment template:

```bash
npm install
cp env.template .env
```

Fill in the required values in `.env` (see below), then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000/ruleslawyer](http://localhost:3000/ruleslawyer) to view the app.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — run ESLint

## Environment variables

For local development, copy `env.template` to `.env` and fill in the values. In production these are set on the ECS task definition (`.aws/taskdefinition-{env}.json`) — non-secret values inline, with `AUTH0_SECRET` and `AUTH0_CLIENT_SECRET` pulled from AWS Secrets Manager.

Auth0 (`@auth0/nextjs-auth0`) — the SDK reads these from the environment automatically, except `AUTH0_AUDIENCE`, which `lib/auth0.ts` passes explicitly:

- `AUTH0_DOMAIN` — Auth0 tenant domain (e.g. `geekway.auth0.com`)
- `AUTH0_CLIENT_ID` — Auth0 application client ID
- `AUTH0_CLIENT_SECRET` — Auth0 application client secret (secret)
- `AUTH0_SECRET` — session cookie encryption key (secret)
- `AUTH0_AUDIENCE` — API audience requested for access tokens
- `APP_BASE_URL` — public base URL of the app (e.g. `https://library.geekway.com/ruleslawyer`)

Backend API:

- `API_URL` — server-side base URL of the ruleslawyer-backend API
- `NEXT_PUBLIC_API_URL` — client-side base URL of the API (e.g. `http://localhost:8080/api`)
- `NEXT_PUBLIC_BASE_PATH` — app base path (`/ruleslawyer`)

`NEXT_PUBLIC_*` variables are inlined into the client bundle **at build time**, so the deploy workflow passes the per-environment value in as a Docker build arg. The remaining variables are read at runtime from the task definition.

## Project structure

- `app/` — App Router routes; `app/dashboard/` holds the authenticated management UI (organizations, conventions, collections, games)
- `components/` — feature components grouped by domain (`game/`, `user/`, `collection/`, `convention/`, `copy/`, `auth/`, `boardgamegeek/`)
- `lib/auth0.ts` — Auth0 client setup
- `proxy.ts` / `middleware.ts` — Auth0 middleware over `/auth/*` routes
- `utilities/` — backend/frontend fetch helpers, SWR hooks, and constants

## Deployment

Deployed to AWS ECS via the **Build and Deploy** GitHub Action (manual `workflow_dispatch`; choose `nonprod` or `prod`). It builds the Docker image (baking in `NEXT_PUBLIC_API_URL` as a build arg), pushes it to the `ruleslawyer-frontend` ECR repo, and updates the `ruleslawyer-frontend` ECS service on the `geekway-{env}` cluster using `.aws/taskdefinition-{env}.json`.

See the full guide: [ruleslawyer-backend/DEPLOYMENT.md](https://github.com/geekwaytothewest/ruleslawyer-backend/blob/main/DEPLOYMENT.md).
