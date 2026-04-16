# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bumpa Loyalty Rewards System** - A complete e-commerce loyalty program with backend (Laravel modular monolith) and frontend (React/TypeScript) that handles user purchases, point accumulation, badge unlocking, and achievement tracking.

- **Backend**: Laravel 10 (Modular Monolith pattern)
- **Frontend**: React 19 + TypeScript + Zustand
- **Database**: MySQL 8.0
- **Cache**: Redis
- **Message Queue**: RabbitMQ
- **Deployment**: Docker Compose

## Quick Start

### Docker Setup (Recommended)
```bash
docker-compose up --build
```
Services will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **phpMyAdmin**: http://localhost:8080
- **RabbitMQ Management**: http://localhost:15672

### Manual Setup

**Backend:**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Architecture

### Backend: Modular Monolith Pattern

The backend is organized into **business domain modules** (not layers):

```
app/Modules/
├── UserService/                    # User management & authentication
│   ├── Models/User.php
│   ├── Repositories/UserRepository.php
│   ├── Services/UserService.php
│   └── Http/Controllers/AuthController.php
├── PaymentService/                 # Payment processing & cashback
│   ├── Models/Payment.php
│   ├── Services/PaymentService.php
│   ├── Repositories/PaymentRepository.php
│   └── Http/Controllers/PaymentController.php
├── LoyaltyService/                 # Achievements & badges (core feature)
│   ├── Models/Achievement.php, Badge.php, UserAchievement.php
│   ├── Services/AchievementService.php, BadgeService.php
│   ├── Repositories/AchievementRepository.php, BadgeRepository.php
│   ├── Events/PurchaseCompleted.php
│   ├── Listeners/AwardAchievementsOnPurchase.php
│   └── Http/Controllers/LoyaltyController.php
└── ECommerceProductService/        # Product catalog
    ├── Models/Product.php
    ├── Repositories/ProductRepository.php
    └── Http/Controllers/ProductController.php
```

**Key Pattern: BaseRepository**
- Located at `app/Repositories/BaseRepository.php`
- All repositories extend BaseRepository for consistent CRUD operations
- Provides methods: `find()`, `all()`, `create()`, `update()`, `delete()`
- Use `query()` method to build custom queries

### Frontend: React with Zustand Stores

**Authentication (Dual-Store Pattern):**
- `useAuthStore`: Regular user authentication (persisted to localStorage via Zustand)
- `useAdminAuthStore`: Admin-only authentication (separate from user)
- `useAppModeStore`: Tracks active mode ('user' or 'admin'), uses sessionStorage to survive page refresh

**Protected Routes:**
- `ProtectedRoute`: Guards user dashboard (checks useAuthStore)
- `AdminProtectedRoute`: Guards admin panel (checks useAdminAuthStore, sets mode to 'admin' in useEffect)

**API Pattern:**
- Axios instance at `src/app/api/axiosInstance.ts` auto-selects token based on `useAppModeStore.mode`
- HTTP hooks: `useGet()` (with caching), `usePost()` (with form data support)
- All endpoints return wrapped responses: `{ data: { items: [...], pagination: {...} } }`

**Key Components:**
- `src/modules/user-dashboard/UserDashboard.tsx`: Main user dashboard (WelcomeSection, HowItWorks, WalletSection, BadgesShowcase, RecentActivity)
- `src/modules/ecommerce/`: Product listing and purchase flow (ProductItem, ProductDetail, usePurchase hook)
- `src/modules/admin/`: Admin panel (users list, achievements overview)

## Critical Business Logic

### Payment → Points → Badge Unlock Flow

1. **PaymentService.processPayment()**:
   - Creates payment record
   - Captures badge BEFORE adding points
   - Adds 25 points (dev) or 10% (production)
   - Fires PurchaseCompleted event
   - Returns unlocked_achievements and unlocked_badges

2. **AwardAchievementsOnPurchase Listener**:
   - Checks if achievements are unlocked (purchase criteria)
   - Assigns badges based on new points total
   - Runs on PurchaseCompleted event

3. **BadgeService.checkAndAssignBadge()**:
   - Finds highest badge user qualifies for (by points_threshold)
   - Assigns only if badge changed
   - Returns new badge or null

### Badge Thresholds
- Bronze: 0 points
- Silver: 50 points
- Gold: 150 points
- Platinum: 300 points
- Diamond: 500 points

### Achievement Types
All achievements stored with `criteria` JSON field (array cast):
- `first_purchase`: Unlock on 1st purchase
- `nth_purchase`: Unlock on 2nd, 3rd, 5th, 10th purchase
- `big_spender`: Unlock on high-value purchase (criteria contains threshold)

## Testing

### Backend Tests
```bash
php artisan test                              # Run all tests
php artisan test --filter=AchievementService # Run specific test
php artisan test --filter=LoyaltyTest        # Run feature tests
```

Tests are located at `backend/tests/Modules/` matching module structure.

### Frontend Development
```bash
cd frontend
npm run dev      # Start dev server (HMR enabled)
npm run build    # Build for production
npm run lint     # Run ESLint
```

## Common Development Tasks

### Adding a New API Endpoint

1. **Create Controller method** in `app/Modules/{Service}/Http/Controllers/{Service}Controller.php`
2. **Register route** in `routes/api.php` with appropriate middleware
3. **Use BaseRepository** for database queries (all repositories extend it)
4. **Return response** using `BaseController::successResponse()` or `errorResponse()`

Example:
```php
// In controller
public function getExample()
{
    $data = $this->exampleService->getData();
    return $this->successResponse($data, 'Success message');
}

// In routes/api.php
Route::middleware('auth:api')->prefix('examples')->group(function () {
    Route::get('/', [ExampleController::class, 'getExample']);
});
```

### Adding Frontend Components

Follow this structure:
```
src/modules/{feature}/
├── components/        # Reusable UI components
├── pages/            # Full page components (routed)
├── hooks/            # Feature-specific hooks
├── data/             # Constants, mock data
└── types/            # TypeScript interfaces
```

Use `useGet()` for fetching, `usePost()` for mutations:
```typescript
const { data, isLoading, error } = useGet('/api/endpoint', { autoFetch: true });
const { execute: submit, isLoading } = usePost();
```

### Running Database Migrations

```bash
# Backend container
docker-compose exec backend php artisan migrate:fresh --seed

# Or locally (if not using Docker)
php artisan migrate:fresh --seed
```

Database seeders are at `backend/database/seeders/` and auto-populate test data:
- ProductSeeder: Creates products with pricing
- BadgeSeeder: Creates 5 badges (Bronze-Diamond)
- AchievementSeeder: Creates 6 achievements
- UserSeeder: Creates test users (admin + regular)

## Important Implementation Details

### Badge Assignment Bug (Fixed)
**Issue**: Badges weren't unlocking on purchase
**Cause**: Code fetched "old badge" AFTER adding points, so comparison failed
**Fix**: Capture badge BEFORE `updatePoints()`, then check AFTER

**Location**: `app/Modules/PaymentService/Services/PaymentService.php` lines 60-107

### Achievement Double-Encoding (Fixed)
**Issue**: Achievements weren't comparing correctly in queries
**Cause**: AchievementSeeder used `json_encode()` on array-cast field (double encoding)
**Fix**: Pass arrays directly to array-cast fields; Laravel handles JSON encoding

**Location**: `database/seeders/AchievementSeeder.php`

### Admin Authentication Persistence (Fixed)
**Issue**: Admin dashboard showed "not authorized" after page refresh
**Cause**: `useAppModeStore` used localStorage but stores weren't hydrated before route guards checked auth
**Fix**: Changed `useAppModeStore` to use sessionStorage (survives refresh, synchronous), removed hydration logic
**Pattern**: Matches mockAI-frontend implementation - set mode in ProtectedRoute useEffect

**Location**: `frontend/src/app/stores/useAppModeStore.ts`, `frontend/src/app/routing/`

## Payment Processing Details

**Request**: `POST /api/v1/payments`
```json
{ "product_id": 1 }
```

**Success Response**:
```json
{
  "success": true,
  "payment": { "id": 1, "status": "completed", ... },
  "cashback_points": 25,
  "message": "Payment successful",
  "unlocked_achievements": [{ "name": "...", "description": "..." }],
  "unlocked_badges": [{ "name": "Silver", "description": "..." }]
}
```

- Mocked payment (no real Paystack/Flutterwave)
- Hardcoded 25-point cashback (development) or 10% (production)
- Returns both unlocked achievements AND badges in single response
- Frontend displays celebration modal with confetti on achievement/badge unlock

## API Endpoints Summary

### Auth
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user

### Products
- `GET /products` - List products (paginated)
- `GET /products/{id}` - Get product detail

### Payments
- `POST /payments` - Process payment (protected)
- `GET /payments/history` - User payment history (protected)

### Loyalty
- `GET /achievements` - All achievements
- `GET /badges` - All badges
- `GET /users/{user}/achievements` - User's achievements (protected)

### Admin
- `GET /admin/users` - All users paginated (admin only)
- `GET /admin/users/achievements` - Users with achievements (admin only)

All endpoints follow standard pagination: `?page=1&limit=10`
Response format: `{ data: { items: [...], pagination: { page, limit, total, total_pages } } }`

## Git & Commits

- Branch: `master`
- Commit style: Concise, present tense ("Fix badge assignment", not "Fixed")
- Include module name in commit message when relevant

## Environment Variables

**Backend** (`.env`):
```
APP_ENV=local                    # Use 'local' for 25 fixed points, 'production' for 10%
DB_HOST=mysql
DB_DATABASE=loyalty_db
DB_USERNAME=root
DB_PASSWORD=secret
QUEUE_CONNECTION=rabbitmq        # For event-driven processing
```

**Frontend** (`.env` or `vite.config.ts`):
```
VITE_API_URL=http://localhost:8000/api
```

## Debugging

**Backend**: Check Laravel logs at `backend/storage/logs/laravel.log`
**Frontend**: Open browser DevTools, check Network tab and Console

**Queue Issues**: Check RabbitMQ management UI at http://localhost:15672 (guest/guest)

**Database Issues**: Use phpMyAdmin at http://localhost:8080 to inspect tables and data