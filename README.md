# Bumpa Loyalty Rewards System

A complete e-commerce loyalty program with customer dashboard, admin panel, and achievement/badge tracking system.

**📹 [Product Demo Video](https://www.loom.com/share/f6caf1578f0d49aea11746e67a49ae26)** - Watch the full system in action

## Project Overview

**What it does:**

- Users earn points on purchases (25 fixed in dev, 10% in production)
- Achievements unlock based on purchase criteria (first purchase, nth purchase, spending milestones)
- Badges tier up based on points threshold (Bronze → Silver → Gold → Platinum → Diamond)
- Real-time dashboard shows points, current badge, and activity history
- Admin panel tracks user achievements and loyalty metrics

## Tech Stack

| Layer          | Technology                                                                |
| -------------- | ------------------------------------------------------------------------- |
| **Frontend**   | React 19 + TypeScript, Zustand (state), Axios (HTTP), Tailwind CSS        |
| **Backend**    | Laravel 10 (modular monolith), MySQL 8.0, RabbitMQ (queue), Redis (cache) |
| **Deployment** | Docker Compose                                                            |
| **Auth**       | JWT with separate user/admin tokens                                       |

## Quick Start

**Start everything (one command, but build first):**

```bash
docker-compose up
```

**Docker (with build):**

```bash
docker-compose up --build
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# Admin: http://localhost:8080 (phpMyAdmin)
```

Run migrations:

```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

Seed database only:

```bash
docker-compose exec backend php artisan db:seed
```

Generate Swagger docs:

```bash
docker-compose exec backend php artisan swagger:generate
```

Run tests:

```bash
docker-compose exec backend php artisan test
```

**Manual Setup:**

Backend:

```bash
cd backend
composer install
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Architecture

### Backend: Modular Monolith

Organized by **business domains** (UserService, PaymentService, LoyaltyService, ECommerceProductService) rather than technical layers. Each module is autonomous with clear boundaries.

**Event-Driven Flow:**

```
Payment → PurchaseCompleted Event → Achievement Checks → Badge Assignment
```

**Key Decisions:**

- Modular monolith enables team autonomy without microservices complexity
- Event-driven decouples payment from loyalty logic, allows async processing
- Service Repository pattern standardizes data access across modules
- JWT stateless auth scales horizontally without session storage

### Frontend: Feature-Driven Components

Organized by **features** (landing, auth, dashboard, ecommerce, admin). Each feature groups components, hooks, and types together.

**Key Decisions:**

- Zustand for state (minimal boilerplate vs Redux/Context overhead)
- Custom hooks encapsulate reusable logic (API calls, caching, auth)
- Axios with interceptors for automatic token injection based on user/admin mode
- Feature-driven structure for clearer boundaries and independent feature scaling
- Separate auth stores for user vs admin prevent token mixing

## Project Structure

```
├── backend/
│   ├── app/Modules/          # Business domain modules
│   ├── config/               # Laravel configuration
│   ├── database/migrations   # Schema changes
│   ├── routes/api.php        # API routes
│   ├── tests/                # Test suite
│   └── README.md             # Backend setup & API docs
│
├── frontend/
│   ├── src/
│   │   ├── app/              # Core (api, stores, hooks, routing)
│   │   ├── components/       # Reusable UI components
│   │   ├── modules/          # Feature modules (landing, auth, dashboard, etc.)
│   │   └── main.tsx          # App entry
│   ├── jest.config.js        # Test config
│   └── README.md             # Frontend setup & architecture
│
├── docker-compose.yml        # Services configuration
├── CLAUDE.md                 # Claude Code guidance
└── README.md                 # This file
```

## Key Features

**Payment Processing:**

- **Paystack Integration:** Real payment gateway with two-step flow (initialize → verify)
- Factory pattern allows extensibility to other gateways (Flutterwave, Stripe, etc.)
- Creates payment record, awards points, triggers achievement/badge checks
- Returns unlocked achievements and badges in single response
- Idempotent verification (safe to verify multiple times)

**Achievement System:**

- Unlocks via criteria: first_purchase, purchase_count, total_spent
- Stored as JSON criteria field for flexibility

**Badge System:**

- Point-based tiers (Bronze 0pts → Diamond 500pts)
- Auto-assigned when points threshold reached

**User Dashboard:**

- Real-time points and badge display
- Recent activity feed (purchases + achievements)
- Fresh data synced on mount via custom hook

**Admin Panel:**

- User list with pagination
- Per-user achievement tracking
- Separate admin authentication

## Running Tests

**Backend (25 tests):**

```bash
cd backend
php artisan test
```

**Frontend:**

```bash
cd frontend
npm test -- --watchAll=false
```

## API Documentation

Backend API endpoints documented at:

```
http://localhost:8000/api/documentation
```

Quick reference:

- Auth: `/auth/login`, `/auth/register`, `/auth/me`
- Products: `/products`, `/products/{id}`
- Payments (Paystack):
  - `POST /payments/initialize` - Start payment (redirects to Paystack)
  - `GET /payments/verify?reference={ref}` - Verify payment (webhook from Paystack)
  - `GET /payments/history` - User's payment history
  - `GET /payments/total-spending` - User's total spent
- Loyalty: `/achievements`, `/badges`, `/users/{id}/achievements`
- Admin: `/admin/users`, `/admin/users/achievements`

## Design Philosophy

**Modular Monolith:** Scale development without microservices complexity. Autonomous teams within single codebase.

**Event-Driven:** Decouple concerns. Payment succeeds immediately; achievements/badges process asynchronously.

**Clean Separation:** Backend modules, frontend features, clear API boundaries.

**Type Safety:** TypeScript on frontend, type hints in PHP backend.

**Testability:** Repository pattern, custom hooks, dependency injection enable unit/integration testing.

## Database

Core tables: `users`, `payments`, `products`, `achievements`, `badges`, `user_achievements`

Seeders auto-populate: ProductSeeder, BadgeSeeder, AchievementSeeder, UserSeeder

## Environment Setup

**Backend (.env):**

```
APP_ENV=local                   # 'local' = 25 pts, 'production' = 10%
JWT_SECRET=(set via php artisan jwt:secret)
DB_HOST=mysql
DB_PASSWORD=secret
QUEUE_CONNECTION=rabbitmq

# Payment Gateway (Paystack)
PAYMENT_GATEWAY=paystack
PAYSTACK_SECRET_KEY=sk_test_...  # Get from https://dashboard.paystack.com
```

**Frontend (.env):**

```
VITE_API_URL=http://localhost:8000/api
```

## Running with Docker

**Start all services:**

```bash
docker-compose up --build
```

**After startup (services are auto-running):**

- Frontend automatically starts: http://localhost:5173
- Backend API automatically starts: http://localhost:8000
- Database migrations run automatically on first startup
- Seeders populate test data automatically

**Manual Database Operations:**

Run migrations:

```bash
docker-compose exec backend php artisan migrate:fresh --seed
```

Seed database only:

```bash
docker-compose exec backend php artisan db:seed
```

Generate Swagger docs:

```bash
docker-compose exec backend php artisan swagger:generate
```

Run tests:

```bash
docker-compose exec backend php artisan test
```

**View Logs:**

```bash
docker-compose logs -f backend    # Backend logs
docker-compose logs -f frontend   # Frontend logs
```

## Services After Docker Startup

- **Frontend:** http://localhost:5173 (React dev server with HMR)
- **Backend:** http://localhost:8000 (Laravel API)
- **Database Admin:** http://localhost:8080 (phpMyAdmin - root/secret)
- **Queue Admin:** http://localhost:15672 (RabbitMQ - guest/guest)
- **API Docs:** http://localhost:8000/api/documentation (Swagger)
  ync on dashboard load

## For Reviewers

See individual READMEs:

- **backend/README.md** - Database schema, API endpoints, test setup, design decisions
- **frontend/README.md** - Project structure, state management, hooks pattern, design decisions
- **CLAUDE.md** - Claude Code guidance with implementation details and bug fixes

## Deployment

All services containerized. Production deployment:

```bash
docker-compose -f docker-compose.yml up -d
```

Includes automatic database migrations and seeding on first run.
