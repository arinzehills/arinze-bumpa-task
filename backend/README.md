# Backend - Bumpa Loyalty Rewards System

Laravel 10 modular monolith API for e-commerce loyalty program.

## Quick Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan jwt:secret
php artisan migrate:fresh --seed
php artisan serve
```

## Project Structure

```
app/Modules/
├── UserService/                # Auth, registration, user profile
├── PaymentService/             # Payment processing, cashback points
├── LoyaltyService/             # Achievements, badges, progress
└── ECommerceProductService/    # Product catalog
```

Each module contains: Models, Services, Repositories, Controllers, Events, Listeners

## Database Schema

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | User accounts | id, email, name, total_points, current_badge_id |
| `payments` | Purchase history | id, user_id, product_id, amount, status |
| `products` | E-commerce catalog | id, name, price, description |
| `achievements` | Unlock criteria | id, name, criteria (JSON), points |
| `badges` | Tier progression | id, name, points_threshold |
| `user_achievements` | Progress tracking | user_id, achievement_id, unlocked_at |

**Relationships:**
- User → Payments (1:many)
- User → UserAchievements (1:many)
- Achievement → UserAchievements (1:many)

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/auth/login` | POST | - | User login |
| `/auth/register` | POST | - | User registration |
| `/auth/me` | GET | JWT | Current user profile |
| `/products` | GET | - | List products (paginated) |
| `/payments` | POST | JWT | Process payment/purchase |
| `/payments/history` | GET | JWT | User payment history |
| `/achievements` | GET | - | All achievements |
| `/badges` | GET | - | All badges |
| `/users/{id}/achievements` | GET | - | User's unlocked achievements |
| `/admin/users` | GET | Admin | All users (paginated) |
| `/admin/users/achievements` | GET | Admin | Users with achievements |

## API Documentation (Swagger)

Swagger UI available at:
```
http://localhost:8000/api/documentation
```

Update docs after changes:
```bash
php artisan swagger:generate
```

## Running Tests

```bash
php artisan test                              # Run all 25 tests
php artisan test --filter=PaymentTest         # Run specific test class
./vendor/bin/phpunit tests/Modules/PaymentService/Feature/PaymentTest.php  # Single file
```

**Test Requirements:**
- MySQL 8.0 running
- `.env.testing` file configured with database
- JWT_SECRET environment variable set

**Test Organization:** `tests/Modules/` mirrors `app/Modules/` structure

## Design Decisions

### 1. Modular Monolith Architecture
Organized by business domains (UserService, PaymentService, etc.) rather than technical layers. Enables team autonomy within modules while maintaining single codebase.

### 2. Event-Driven Flow
Decouples payment processing from achievement/badge logic via Laravel events. Allows async processing and extensibility without tight coupling.

**Flow:** Payment → PurchaseCompleted Event → Achievement Checks → Badge Assignment

### 3. BaseRepository Pattern
All repositories extend a base class providing consistent CRUD interface. Reduces code duplication and standardizes data access layer.

### 4. Array Cast for JSON Criteria
Achievement criteria stored as JSON using Laravel's `array` cast. Pass arrays directly to create/update; Laravel handles encoding automatically.

### 5. JWT for Stateless Auth
Separate tokens for user vs admin authentication. Sessionless API design scales horizontally without session storage overhead.
 
## Docker

```bash
docker-compose up --build
```

Services:
- Backend: http://localhost:8000
- phpMyAdmin: http://localhost:8080
- RabbitMQ: http://localhost:15672

## Core Features

**Payment Processing:** Creates payment record, awards points (25 fixed in dev or 10% in production), triggers achievement/badge checks

**Achievement System:** Unlocks based on criteria (first_purchase, purchase_count, total_spent)

**Badge System:** Point-based progression (Bronze 0pts → Silver 50pts → Gold 150pts → Platinum 300pts → Diamond 500pts)

**Authentication:** JWT tokens with separate user/admin stores

**Pagination:** All list endpoints support `?page=1&limit=10`