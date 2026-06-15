# SprintPulse — Jira-Style Sprint Operations Platform

A full-stack sprint operations platform — Jira-style sprint, ticket, and incident tracking for engineering teams — built as an Nx monorepo with a React/MUI frontend, Express/Prisma backend, and centralized reference-data configuration.

[![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-green.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-purple.svg)](https://www.prisma.io/)
[![MUI](https://img.shields.io/badge/MUI-7.3-blue.svg)](https://mui.com/)
[![NX](https://img.shields.io/badge/NX-22.4-143055.svg)](https://nx.dev/)
[![Supabase](https://img.shields.io/badge/DB-Supabase%20Postgres-3FCF8E.svg)](https://supabase.com/)

---

## Table of Contents

- [Overview](#overview)
- [Platform Features](#platform-features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Authentication & Security](#authentication--security)
- [Role-Based Access Control](#role-based-access-control)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database](#database)
- [Reference Data (Configurations)](#reference-data-configurations)
- [Feature Flags](#feature-flags)
- [AI Chat](#ai-chat)
- [Development Commands](#development-commands)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)

---

## Overview

SprintPulse is a Jira-style operations platform for engineering teams. It tracks sprints, tickets, and incidents across squads and teams — with a drag-and-drop Sprint Status Matrix, KPI dashboards, team analytics, an incentive report, an AI assistant, and centralized reference-data configuration for status, priority, fix version, and more.

The frontend is a React/MUI SPA styled with `tss-react` and animated for an at-a-glance "AMFAM Matrix" feel. The backend is an Express REST API on Prisma, backed by Supabase Postgres in production.

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Sprint-first data model** | Tickets and incidents roll up into sprints, squads, and teams |
| **Centralized reference data** | Squads, Teams, Issue Types, Statuses, Priorities, Fix Versions, and Sprint Numbers live in dedicated config tables |
| **Configuration-driven UX** | Feature flags gate navigation and per-role capability; reference data drives chip colors and pickers app-wide |
| **Separation of concerns** | UI renders, backend handles logic, services translate between them |
| **Shared types** | One TypeScript surface for frontend and backend |
| **External styles** | All component styles live in co-located `styles/` folders using `tss-react` |
| **Testability** | In-memory gateways enable fast, DB-free unit tests |

---

## Platform Features

### Dashboard
- Live-updating "AMFAM Matrix" hero with a real-time clock and timezone indicator
- KPI cards: team members, sprint count, total tickets, total incidents, in-progress, in-review, in-test, done
- Three views, switched from a single toolbar:
  - **Ticket Overview** — searchable, paginated table of all tickets
  - **Team Analytics** — bar/line chart of story points per team across a date range, with team multi-select and aggregate-by (daily / weekly / monthly)
  - **Incentive Report** — Actual vs Forecast MWh, |Δ|, FER %, and incentive value with date-range filtering
- Quick-launch button to the **Sprint Status Matrix**

### Sprint Status Matrix (`/app/admin/sprint-status-matrix`)
A Jira-style kanban board with five columns — **To Do / In Progress / In Review / In Test / Done** — populated from ticket data.
- Custom HTML5 drag-and-drop (no `@dnd-kit` dependency) with in-memory state and a custom drag image
- Category-colored cards (Story, Task, Bug, Epic, Spike, Billing, Accounts, Forms, Feedback)
- Search, filter, and a per-card overflow menu (Insights, Promote, Group)
- Sticky avatars and a per-column card count

### Sprint Detail
Drill-down view of a single sprint with planned points, completed points, velocity, and the tickets it contains.

### Ticket Detail
Full ticket view with status, assignee, issue type, fix version, time-logging ID, story points, and work dates.

### Operations Management
Centralized operations workspace for cross-sprint operations work.

### Status Reports
Tabular status reporting across teams and time windows.

### Technical Documents
Document management UI for team-level technical knowledge.

### Configurations
Admin-only reference-data management for the seven core entities:
- **Squad** — agile squad (color, icon key, sort order)
- **Team** — engineering team
- **Issue Type** — Story / Task / Bug / Epic / Spike, etc.
- **Status** — workflow statuses
- **Fix Version** — release tagging
- **Sprint Number** — sprint catalog
- **Priority** — P0 / P1 / P2 / P3, etc.

Each entity supports create / read / update / soft-toggle (active) / delete via a single generic controller at `GET/POST/PUT/PATCH/DELETE /api/admin/configurations/:entity[/:id]`.

### Feature Flags
Per-feature toggle system. Reserved flag keys (e.g. `nav_people_management`, `nav_analytics`, `nav_feature_flags`, `nav_reports`, `nav_technical_documents`) gate consultant-side nav items. The server auto-seeds these on startup; the client polls every 5 seconds.

### AI Chat (`POST /api/admin/chat`)
Backend-issued chat endpoint backed by `@google/genai`.

### People Management
User lifecycle and access requests: pending → active → inactive / deactivated, inline role-request approval from the notifications panel, and admin-side password reset.

### Authentication
JWT-based sign-in / sign-up, OTP forgot-password flow (Nodemailer), 5-failed-attempt account lockout (30-minute cooldown), and bcrypt password hashing.

### Multi-Tenant Build
- `web/apps` — main administration build (`/app/admin/*`)
- `web/tenants/sprintpulse` — separate Vite build output for the SprintPulse tenant

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)               │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │  UI Pages    │   │  Redux Store │   │   Hooks    │  │
│  │  (MUI/tss)  │──▶│  (RTK Query) │──▶│ useAuth…  │  │
│  │  • Dashboard │   │              │   │ useLive   │  │
│  │  • Matrix    │   │  polling /   │   │ DateTime  │  │
│  │  • Configs   │   │  caching     │   │           │  │
│  │  • Flags     │   │              │   │           │  │
│  └──────────────┘   └──────────────┘   └────────────┘  │
└────────────────────────────┬───────────────────────────┘
                             │ HTTP / REST
                             ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                     │
│  ┌────────────┐   ┌────────────┐   ┌────────────────┐  │
│  │Controllers │──▶│ Use Cases  │──▶│   Gateways     │  │
│  │ (HTTP/DTO) │   │ (Logic)    │   │ Prisma/InMemory│  │
│  │            │   │            │   │                │  │
│  │ • Auth     │   │            │   │ • User         │  │
│  │ • Configs  │   │            │   │ • FeatureFlag  │  │
│  │ • Flags    │   │            │   │ • Squad/Team/  │  │
│  │ • ChatAI   │   │            │   │   IssueType/   │  │
│  │            │   │            │   │   Status/...   │  │
│  └────────────┘   └────────────┘   └───────┬────────┘  │
└──────────────────────────────────────────────┼──────────┘
                                               ▼
                              Supabase Postgres (Prisma)
```

---

## Project Structure

```
SprintPulse/
│
├── gateways/                              # Backend (Express API)
│   ├── api/
│   │   ├── auth/                          # Auth — single POST /api/auth endpoint
│   │   └── admin/
│   │       ├── Configurations/            # /api/admin/configurations/:entity
│   │       ├── FeatureFlags/              # /api/admin/feature-flags
│   │       ├── ChatAI/                    # /api/admin/chat
│   │       └── routes.ts
│   ├── prisma/
│   │   ├── schema.prisma                  # User, UserPreference, UserChangeLog, LoginLog,
│   │   │                                  # FeatureFlag, Squad, Team, IssueType, Status,
│   │   │                                  # FixVersion, SprintNumber, Priority
│   │   ├── seed.ts
│   │   └── migrations/                    # incl. configurations + iconkey
│   └── src/
│       ├── server.ts                      # Bootstrap — env load, DB check, seed nav flags
│       ├── app.ts                         # Express app
│       ├── index.ts                       # Entry point
│       └── generated/prisma/              # Prisma client output
│
├── env/
│   └── src/
│       └── env.gateway.json               # Default backend env values
│
├── libs/                                  # Shared libraries
│   ├── core/                              # Backend core
│   │   ├── database/                      # Prisma client
│   │   ├── middleware/                    # Auth, error, logging
│   │   ├── repository/                    # Data access
│   │   ├── service/                       # Business services
│   │   └── validation/                    # Yup schemas (server-side)
│   │
│   ├── entities/                          # Shared TypeScript types & Yup schemas
│   │
│   ├── ui/                                # Frontend
│   │   ├── components/                    # Reusable MUI components
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard/             # Main dashboard + Sprint Status Matrix
│   │   │   │   │   ├── components/        #   SprintDetailPage, TicketDetailPage
│   │   │   │   │   ├── pages/             #   SprintStatusMatrixPage
│   │   │   │   │   ├── types/             #   sprintData.types.ts (Ticket, StatusConfig)
│   │   │   │   │   └── utils/             #   dashboard.utils, effortCalculations
│   │   │   │   ├── People/                # People management
│   │   │   │   ├── Configurations/        # Reference data CRUD UI
│   │   │   │   ├── FeatureFlags/          # Feature flag UI
│   │   │   │   ├── Operations/            # Operations management
│   │   │   │   ├── Reports/               # Status reports
│   │   │   │   ├── TechnicalDocuments/    # Doc management
│   │   │   │   ├── Tickets/components/    # CreateTicket
│   │   │   │   └── Incidents/components/  # CreateIncident
│   │   │   └── shared/                    # Header, SideNav, SignIn, SignUp, ForgotPassword,
│   │   │                                   # Profile, Settings, HelpSupport, PageShell
│   │   ├── hooks/                         # useAuth, useLoader, useNotification,
│   │   │                                  # useLiveDateTime, useAdminKeyframes
│   │   ├── slices/                        # Redux slices
│   │   └── store/                         # Redux store
│   │
│   ├── services/                          # RTK Query service definitions
│   │   └── service/                       # authServices, configurationsService,
│   │                                      # featureFlagsService, baseServices
│   │
│   ├── theme/                             # MUI theme, palette, tenant overrides
│   ├── shared/constants/                  # admin.constants, role/path constants
│   └── utils/                             # Constants, path helpers, formatters
│
├── web/
│   ├── apps/                              # Main admin React app (Vite)
│   │   └── src/app/
│   │       ├── App.tsx                    # Routes & AppRoleContext provider
│   │       └── routes.ts                  # Lazy-loaded page imports
│   └── tenants/
│       └── sprintpulse/                   # SprintPulse tenant build
│
├── render.yaml                            # Render deployment (backend)
├── vercel.json                            # Vercel deployment (frontend)
├── docker-compose.yml
├── Dockerfile
├── nx.json
├── tsconfig.base.json
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or Docker / Supabase)
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd SprintPulse

# Install all dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Apply database schema
npm run prisma:migrate

# Seed with test data
npm run prisma:seed
```

### Running Locally

```bash
# Terminal 1 — Backend API (http://localhost:3600)
npm run dev:backend

# Terminal 2 — Frontend admin app (http://localhost:1600)
npm run serve:administration
```

> The backend listens on port `3600` by default (overridable via `PORT`).

### Default Test Credentials (after seeding)

| Email | Password | Role |
|-------|----------|------|
| `admin@sprintpulse.tech` | `admin123` | Admin |
| `consultant@sprintpulse.tech` | `consultant123` | Consultant |
| `user@sprintpulse.tech` | `user123` | User |

---

## Environment Variables

Backend defaults are loaded from `env/src/env.gateway.json` first, then any `.env` file in the project root takes precedence. Supabase is the default database target in dev.

```env
# Server
NODE_ENV=development
PORT=3600
HOST=0.0.0.0

# Database (Supabase Postgres)
DATABASE_URL=postgresql://postgres.<project>:<password>@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=1d

# Throttling
THROTTLE_TTL=60
THROTTLE_LIMIT=10

# Email / SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=SprintPulse <noreply@sprintpulse.tech>

# CORS
CORS_ORIGIN=http://localhost:1600

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
ENABLE_CONSOLE_LOGS=true
```

> **Note:** In development, OTPs are also printed to the console if SMTP is not configured.

### Database Connectivity

The server forces DNS resolution order to `verbatim` (Supabase publishes only an AAAA record for the current project). This is set in `gateways/src/server.ts` and must run before any network connection.

---

## Docker Setup

```bash
# Start PostgreSQL container
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

| Service | Port | Description |
|---------|------|-------------|
| PostgreSQL | 5432 | Primary database |

---

## Authentication & Security

- **JWT tokens** — 1-day expiry (configurable via `JWT_EXPIRES_IN`)
- **bcryptjs** — password hashing with 10 salt rounds
- **Account lockout** — 5 failed attempts triggers a 30-minute lock
- **OTP reset** — 6-digit OTP delivered by email
- **Admin password reset** — Admins can reset another user's password from the user detail dialog
- **Throttling** — global throttle (`THROTTLE_TTL=60s`, `THROTTLE_LIMIT=10` reqs)

All auth operations go through a single `POST /api/auth` endpoint with an `action` discriminator.

---

## Role-Based Access Control

| Role | Access |
|------|--------|
| **Admin** | Full system access — Dashboard, People, Operations, Reports, Technical Documents, Feature Flags, Configurations |
| **Consultant** | Limited partner access. Nav items are gated by feature flags (see below) |
| **User** | Basic dashboard access at `/app/user/dashboard` |

### Sign-Up & Role Request Flow

1. User registers at `/signup` and optionally requests a role (Consultant / Admin)
2. Account is created with the base `user` role and `pending_approval` status
3. Role request appears in the admin's **Notifications** panel
4. Admin approves or rejects — user is notified by email

---

## Backend Architecture

### Gateway Pattern

Every data operation has two gateway implementations sharing the same interface — Prisma for production, InMemory for tests:

```typescript
// Production
export class PrismaUserGateway implements IUserGateway {
  constructor(private readonly prisma: PrismaClient) {}
  async findById(id: number): Promise<IAuthUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
}

// Tests (no DB required)
export class InMemoryUserGateway implements IUserGateway {
  private users: IAuthUser[] = [];
  async findById(id: number): Promise<IAuthUser | null> {
    return this.users.find((u) => u.id === id) ?? null;
  }
}
```

### Use-Case Pattern

One class per business operation, injected with a gateway:

```typescript
export class ApproveRoleRequestUseCase {
  constructor(private readonly gateway: IUserGateway) {}
  async execute(userId: number): Promise<void> {
    await this.gateway.approveRoleRequest(userId);
  }
}
```

### Configurations — Generic Controller

The Configurations controller handles all seven reference-data entities through a single endpoint pattern:

```typescript
// All entities share this route shape
router.get(   '/:entity',          controller.getAll);
router.post(  '/:entity',          controller.create);
router.put(   '/:entity/:id',      controller.update);
router.patch( '/:entity/:id/toggle', controller.toggle);  // flips isActive
router.delete('/:entity/:id',      controller.remove);
```

Entities: `squads`, `teams`, `issue-types`, `statuses`, `fix-versions`, `sprint-numbers`, `priorities`.

### Auth Actions

All auth operations go through a single `POST /api/auth` endpoint with an `action` discriminator — no separate routes per operation.

---

## Frontend Architecture

### Pages → Hooks → Services

- **Pages** render pure UI and delegate all logic to custom hooks
- **Hooks** call RTK Query mutations/queries and manage local state
- **Services** (`@sprintpulse/services`) define RTK Query endpoints
- **Role context** — `AppRoleContext` (`admin` | `consultant` | `user`) is set from `useAuth()` and threads through the component tree

### Drag-and-Drop (Sprint Status Matrix)

Custom HTML5 DnD — no `@dnd-kit` dependency. State is held in component memory; a custom drag image is rendered for visual feedback. See `SprintStatusMatrixPage.tsx`.

### Styling

All component styles are in a co-located `styles/` folder using `tss-react`:

```
ComponentName/
├── ComponentName.tsx
├── index.ts
└── styles/
    ├── ComponentName.styles.shared.ts   # Base styles (theme-aware)
    ├── ComponentName.styles.ts          # useStyles hook
    └── index.ts
```

No inline `sx` props for layout — only for one-off theme-token overrides.

---

## Database

### Schema Management

| Command | When to use |
|---------|-------------|
| `prisma:migrate` | Development — push schema changes |
| `prisma:deploy` | Production — apply migration files |
| `prisma:reset` | Drop and recreate the database |
| `prisma:studio` | Open Prisma Studio GUI |
| `prisma:seed` | Populate with test data |
| `prisma:sync` | Sync schema via TS script |
| `prisma:regenerate` | Regenerate a migration file |

### Models

- **User** — full user lifecycle with status (`pending_approval | invited | active | inactive | deactivated | rejected | expired`), source (`signup | admin | ticket | ad`), and per-user preferences
- **UserChangeLog** — auditable change history (field updates, role changes, approvals, password resets)
- **LoginLog** — login/logout with IP, device, user agent
- **UserPreference** — per-user UI preferences (theme, dark mode, compact view, auto-save)
- **FeatureFlag** — name, key, environment, status, roles (JSON string)
- **Reference data** — `Squad`, `Team`, `IssueType`, `Status`, `FixVersion`, `SprintNumber`, `Priority` — all share the same shape: `id`, `name`, `key` (unique), `description`, `color`, `iconKey?` (Squad/Team only), `sortOrder`, `isActive`, `createdBy`, `updatedBy`, timestamps

### Development Workflow

```bash
# 1. Edit gateways/prisma/schema.prisma
# 2. Sync to your dev database
npm run prisma:migrate
# 3. Regenerate the Prisma client
npm run prisma:generate
```

---

## Reference Data (Configurations)

The Configurations feature manages seven reference-data entities that drive the rest of the app — chip colors, dropdown options, icon keys, sort order, and active flags.

| Entity | Key field | Color default | Notes |
|--------|-----------|---------------|-------|
| Squad | `key` | `#6366f1` | Has `iconKey` |
| Team | `key` | `#06b6d4` | Has `iconKey` |
| Issue Type | `key` | `#6366f1` | |
| Status | `key` | `#6366f1` | |
| Fix Version | `key` | `#10b981` | |
| Sprint Number | `key` | `#0ea5e9` | |
| Priority | `key` | `#f59e0b` | |

All entities support `isActive` toggling for soft-disable without losing history.

---

## Feature Flags

`FeatureFlag` is a first-class model with `name`, `key` (unique), `description`, `environment`, `status` (`Enabled` / `Disabled`), and `roles` (JSON string of role names).

The server auto-seeds reserved nav-gating flags on startup:

- `nav_people_management`
- `nav_analytics`
- `nav_feature_flags`
- `nav_reports`
- `nav_technical_documents`

The client polls `/api/admin/feature-flags` every 5 seconds (`pollingInterval: 5000`) and uses the result to conditionally show consultant-side nav items.

---

## AI Chat

`POST /api/admin/chat` — backend integration with `@google/genai`. The frontend uses it via RTK Query through the `@sprintpulse/services` layer.

---

## Development Commands

### Backend

```bash
npm run dev:backend          # Express server with hot reload (nodemon)
npm run start:backend        # Production start
npm run build:backend        # Compile TypeScript
npm run build:backend:clean  # Wipe dist/ and compile
```

### Frontend

```bash
npm run serve:administration  # Admin app — http://localhost:1600
npm run serve:sprintpulse     # SprintPulse tenant app
npm run build:administration  # Production build (admin)
npm run build:sprintpulse     # Production build (SprintPulse tenant)
npm run build:shared          # Build shared libraries
```

### Database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:reset
npm run prisma:studio
npm run prisma:seed
npm run prisma:sync
npm run prisma:regenerate
```

### Quality

```bash
npm run lint                 # ESLint
npm run lint:fix             # Auto-fix
npm run format               # Prettier
npm run format:check
npm run type-check           # tsc --noEmit
npm test                     # Jest
npm run test:coverage        # With coverage report
npm run test:shared          # Shared libs only
npm run test:administration  # Admin app only
npm run validate             # format:check + lint + type-check
npm run build                # Full Nx build (all projects)
```

---

## API Reference

### Base URL

```
http://localhost:3600
```

All protected routes require:

```
Authorization: Bearer <jwt-token>
```

### Auth — `POST /api/auth`

| Action | Payload |
|--------|---------|
| `signin` | `{ email, password }` |
| `signup` | `{ firstName, lastName, email, password, confirmPassword, phone, department, workLocation, role? }` |
| `forgot-password` | `{ email }` |
| `verify-otp` | `{ email, otp }` |
| `reset-password` | `{ email, resetToken, newPassword, confirmPassword }` |
| `get-pending-role-requests` | _(no body, admin only)_ |
| `approve-role-request` | `{ userId }` |
| `reject-role-request` | `{ userId }` |
| `reset-user-password` | `{ userId, newPassword }` _(admin only)_ |
| `get-user` | `{ userId }` |
| `update-user` | `{ userId, ...fields }` |

### Configurations — `/api/admin/configurations/:entity[/:id]`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/:entity` | List all (active-only by default) |
| POST | `/:entity` | Create |
| PUT | `/:entity/:id` | Update |
| PATCH | `/:entity/:id/toggle` | Flip `isActive` |
| DELETE | `/:entity/:id` | Remove |

`entity` ∈ `squads | teams | issue-types | statuses | fix-versions | sprint-numbers | priorities`.

### Feature Flags — `/api/admin/feature-flags`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | List all flags |
| POST | `/` | Create |
| PUT | `/:id` | Update |
| PATCH | `/:id/toggle` | Flip status |
| DELETE | `/:id` | Remove |

### AI Chat — `POST /api/admin/chat`

Backend-issued chat request; the body shape is defined by the AI service binding.

---

## Deployment

### Backend → Render

Configured via `render.yaml`:

- **Service:** `SprintPulse-api`
- **Build:** `npm run prisma:generate && npm run build:backend`
- **Start:** `npx tsx gateways/src/index.ts`
- **Port:** 3600
- **Health check:** `GET /health`

### Frontend → Vercel

Configured via `vercel.json`:

- **Build:** `npm run prisma:generate && npm run build:administration`
- **Output:** `dist/web/apps`

### Docker

```bash
docker build -t SprintPulse .
docker run -p 3600:3600 --env-file .env SprintPulse
```

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Language** | TypeScript | 5.9 |
| **Monorepo** | Nx | 22.4 |
| **Frontend** | React | 19.2 |
| **UI Library** | MUI (Material UI) | 7.3 |
| **Date Picker** | MUI X Date Pickers | 8.27 |
| **Styling** | Emotion + tss-react | — |
| **State** | Redux Toolkit + RTK Query | 2.x |
| **Forms** | Formik + Yup | — |
| **Charts** | ApexCharts | 5.x |
| **Date** | dayjs | — |
| **Router** | React Router DOM | 6.29 |
| **Backend** | Express.js | 4.18 |
| **ORM** | Prisma | 7.x |
| **Database** | Supabase Postgres | 15 |
| **Auth** | JWT + bcryptjs | 9.0 / 3.0 |
| **Email** | Nodemailer | 7.0 |
| **File Upload** | Multer | 2.1 |
| **AI** | @google/genai | 2.2 |
| **PDF** | pdfmake | 0.3 |
| **Spreadsheet** | xlsx | 0.18 |
| **Logging** | Winston | 3.19 |
| **Testing** | Jest + ts-jest | 30 |
| **Build** | Vite | 6.x |
| **Lint** | ESLint 9 + Prettier | — |
| **Git Hooks** | Husky | 9 |

---

## Troubleshooting

### Prisma client out of date

```bash
npm run prisma:generate
```

### Database connection refused

```bash
docker-compose up -d        # Start PostgreSQL
npm run prisma:migrate      # Apply schema
```

> For Supabase targets, verify `DATABASE_URL` is set and DNS resolution reaches the pooler host.

### Full clean rebuild

```bash
rm -rf node_modules .nx dist
npm install
npm run prisma:generate
npx nx reset
npm run build
```

### Email / OTP not arriving

Check that `SMTP_*` variables are set in `.env`. In development the OTP is also logged to the console.

### AI chat endpoint fails

Confirm `GEMINI_API_KEY` (or whatever env var the `@google/genai` binding reads) is configured in the backend environment.

---

## License

MIT

---

**Last updated:** June 2026
