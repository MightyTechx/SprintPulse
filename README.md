# SprintPulse — Admin & ITSM Portal

A full-stack IT Service Management platform for energy companies, built as a Nx monorepo with a React/MUI frontend, Express/Prisma backend, and multi-tenant support.

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://reactjs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-green.svg)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-purple.svg)](https://www.prisma.io/)
[![MUI](https://img.shields.io/badge/MUI-7.3-blue.svg)](https://mui.com/)
[![NX](https://img.shields.io/badge/NX-22.4-143055.svg)](https://nx.dev/)

---

## Table of Contents

- [Overview](#overview)
- [Platform Features](#platform-features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Docker Setup](#docker-setup)
- [Role-Based Access Control](#role-based-access-control)
- [Authentication & Security](#authentication--security)
- [Backend Architecture](#backend-architecture)
- [Frontend Architecture](#frontend-architecture)
- [Database](#database)
- [Development Commands](#development-commands)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)
- [Troubleshooting](#troubleshooting)

---

## Overview

SprintPulse is an enterprise admin and IT service management portal built for energy-sector organisations. It provides user lifecycle management, role-based access control, consultant onboarding workflows, and an analytics dashboard — all in a responsive React interface backed by a Node/Express REST API.

### Key Principles

| Principle | Description |
|-----------|-------------|
| **Separation of Concerns** | UI renders, backend handles logic |
| **Shared Types** | Same TypeScript interfaces for frontend and backend |
| **External Styles** | All styles live in `/styles` folders using tss-react |
| **Testability** | InMemory gateways enable fast, DB-free unit tests |
| **Single Responsibility** | One use-case class = one business operation |

---

## Platform Features

### User & Access Management
- Full user lifecycle: pending → active → inactive / deactivated
- Role request workflow: users request Admin or Consultant access; admins approve or reject
- Inline approve / reject from the Notifications panel (no page navigation required)
- User detail dialog: view, edit, and admin-side password reset

### Notifications
- Bell-icon dialog in the header shows all pending access requests in real time
- Approve or reject requests directly from the notification panel
- Badge count updates after each action

### Admin Dashboard
- Metrics and KPI cards with ApexCharts visualisations
- Quick-access to People Management and Settings

### Authentication
- JWT-based sign-in / sign-up
- OTP-based forgot-password flow (email delivery via Nodemailer)
- Account lockout after 5 failed attempts (30-minute cooldown)
- Bcrypt password hashing (10 salt rounds)

### Consultant Mode
- Admins can switch into a Consultant view with a single click
- Separate navigation, colour scheme, and route set for consultant context

### Multi-Tenant Support
- Tenant-aware theme and build pipeline
- **Wind-Tree** tenant ships as a separate Vite build output

---

## Architecture

```
┌────────────────────────────────────────────────────────┐
│                   FRONTEND (React + Vite)               │
│  ┌──────────────┐   ┌──────────────┐   ┌────────────┐  │
│  │  UI Pages    │   │  Redux Store │   │   Hooks    │  │
│  │  (MUI/tss)  │──▶│  (RTK Query) │──▶│ useAuth…  │  │
│  └──────────────┘   └──────────────┘   └────────────┘  │
└────────────────────────────┬───────────────────────────┘
                             │ HTTP / REST
                             ▼
┌────────────────────────────────────────────────────────┐
│                   BACKEND (Express)                     │
│  ┌────────────┐   ┌────────────┐   ┌────────────────┐  │
│  │Controllers │──▶│ Use Cases  │──▶│   Gateways     │  │
│  │ (HTTP/DTO) │   │ (Logic)    │   │ Prisma/InMemory│  │
│  └────────────┘   └────────────┘   └───────┬────────┘  │
└──────────────────────────────────────────────┼──────────┘
                                               ▼
                                     PostgreSQL (Prisma)
```

---

## Project Structure

```
SprintPulse/
│
├── gateways/                        # Backend (Express API)
│   ├── api/
│   │   ├── auth/                    # Auth routes & controller
│   │   ├── admin/                   # Admin API routes
│   │   ├── user/                    # User API routes
│   │   └── consultant/              # Consultant API routes
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema
│   │   ├── seed.ts                  # Seed data
│   │   └── migrations/
│   └── src/
│       ├── app.ts                   # Express app setup
│       ├── server.ts                # Server initialisation
│       └── index.ts                 # Entry point
│
├── libs/                            # Shared libraries
│   ├── core/                        # Backend core
│   │   ├── database/                # Prisma client
│   │   ├── middleware/              # Auth, error, logging
│   │   ├── repository/              # Data access abstractions
│   │   ├── service/                 # Business services
│   │   └── validation/              # Yup schemas (server-side)
│   │
│   ├── entities/                    # Shared TypeScript types
│   │   ├── interfaces/              # IAuthUser, IAdmin, etc.
│   │   └── validations/             # Yup schemas (shared)
│   │
│   ├── ui/                          # Frontend
│   │   ├── components/              # Reusable MUI components
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── Dashboard/
│   │   │   │   └── People/
│   │   │   │       ├── PeopleManagement/
│   │   │   │       ├── PeopleRequests/
│   │   │   │       └── UserDetail/
│   │   │   └── shared/
│   │   │       ├── Header/          # App bar + notifications + user menu
│   │   │       ├── SideNav/         # Role-aware sidebar
│   │   │       ├── SignIn/
│   │   │       ├── SignUp/
│   │   │       ├── ForgotPassword/
│   │   │       ├── Profile/
│   │   │       └── Settings/
│   │   ├── hooks/                   # useAuth, useLoader, useNotification…
│   │   ├── slices/                  # Redux slices
│   │   └── store/                   # Redux store
│   │
│   ├── services/                    # RTK Query service definitions
│   ├── theme/                       # MUI theme, palette, tenant overrides
│   └── utils/                       # Constants, path helpers, formatters
│
├── web/
│   └── apps/                        # Main React app (Vite)
│
├── render.yaml                      # Render deployment (backend)
├── vercel.json                      # Vercel deployment (frontend)
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
- PostgreSQL 15+ (or Docker)
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

# Seed with test accounts
npm run prisma:seed
```

### Running Locally

```bash
# Terminal 1 — Backend API (http://localhost:3001)
npm run dev:backend

# Terminal 2 — Frontend admin app (http://localhost:1600)
npm run serve:administration
```

### Default Test Credentials (after seeding)

| Email | Password | Role |
|-------|----------|------|
| `admin@infygen.tech` | `admin123` | Admin |
| `consultant@infygen.tech` | `consultant123` | Consultant |
| `user@infygen.tech` | `user123` | User |

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Server
NODE_ENV=development
PORT=3001
HOST=localhost

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/infyenergy_db?schema=public

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d

# Email / SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=SprintPulse <noreply@infygen.tech>

# CORS
CORS_ORIGIN=http://localhost:1600

# Logging
LOG_LEVEL=debug
LOG_FILE_PATH=./logs
ENABLE_CONSOLE_LOGS=true
```

> **Note:** In development, OTPs are also printed to the console if SMTP is not configured.

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

## Role-Based Access Control

| Role | Access |
|------|--------|
| **Admin** | Full system access — user management, approvals, settings |
| **Consultant** | Partner/onboarding access, limited management |
| **User** | Basic platform access |

### Sign-Up & Role Request Flow

1. User registers at `/signup` and optionally requests a role (Consultant / Admin)
2. Account is created with the base **User** role
3. Role request appears in the admin's **Notifications** panel
4. Admin approves or rejects — user is notified by email

---

## Authentication & Security

- **JWT tokens** — 7-day expiry (configurable)
- **bcryptjs** — password hashing with 10 salt rounds
- **Account lockout** — 5 failed attempts triggers a 30-minute lock
- **OTP reset** — 6-digit OTP valid for 10 minutes, delivered by email
- **Admin password reset** — Admins can generate and assign a new password directly from the User Detail dialog

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

### Auth Actions

All auth operations go through a single `POST /api/auth` endpoint with an `action` discriminator — no separate routes per operation.

---

## Frontend Architecture

### Pages → Hooks → Services

- **Pages** render pure UI and delegate all logic to custom hooks
- **Hooks** call RTK Query mutations/queries and manage local state
- **Services** (`@infygen/services`) define RTK Query endpoints

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

### Development Workflow

```bash
# 1. Edit gateways/prisma/schema.prisma
# 2. Sync to your dev database
npm run prisma:migrate
# 3. Regenerate the Prisma client
npm run prisma:generate
```

---

## Development Commands

### Backend

```bash
npm run dev:backend          # Express server with hot reload
npm run start:backend        # Production start
```

### Frontend

```bash
npm run serve:administration  # Admin app — http://localhost:1600
npm run build:administration  # Production build
npm run build:wind-tree       # Wind-Tree tenant build
```

### Database

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:deploy
npm run prisma:reset
npm run prisma:studio
npm run prisma:seed
```

### Quality

```bash
npm run lint                 # ESLint
npm run lint:fix             # Auto-fix
npm run format               # Prettier
npm run type-check           # tsc --noEmit
npm test                     # Jest
npm run test:coverage        # With coverage report
npm run build                # Full Nx build (all projects)
```

---

## API Reference

### Base URL

```
http://localhost:3001
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

---

## Deployment

### Backend → Render

Configured via `render.yaml`:

- **Service:** `SprintPulse-api`
- **Region:** Oregon
- **Build:** `npm run prisma:generate && npm run build:backend`
- **Start:** `npx tsx gateways/src/index.ts`
- **Port:** 3001
- **Health check:** `GET /health`

### Frontend → Vercel

Configured via `vercel.json`:

- **Build:** `npm run prisma:generate && npm run build:administration`
- **Output:** `dist/web/apps`

### Docker

```bash
docker build -t SprintPulse .
docker run -p 3001:3001 --env-file .env SprintPulse
```

---

## Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Language** | TypeScript | 5.9 |
| **Monorepo** | Nx | 22.4 |
| **Frontend** | React | 19.0 |
| **UI Library** | MUI (Material UI) | 7.3 |
| **Styling** | Emotion + tss-react | — |
| **State** | Redux Toolkit + RTK Query | 2.x |
| **Forms** | Formik + Yup | — |
| **Charts** | ApexCharts | — |
| **Date** | dayjs | — |
| **Router** | React Router DOM | 6.29 |
| **Backend** | Express.js | 4.18 |
| **ORM** | Prisma | 7.x |
| **Database** | PostgreSQL | 15 |
| **Auth** | JWT + bcryptjs | 9.0 / 3.0 |
| **Email** | Nodemailer | 7.0 |
| **File Upload** | Multer | 2.1 |
| **Logging** | Winston | 3.19 |
| **Testing** | Jest + ts-jest | 30 |
| **Build** | Vite | — |
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

---

## License

MIT

---

**Last updated:** May 2026
