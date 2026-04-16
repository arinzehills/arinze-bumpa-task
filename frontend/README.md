# Frontend - Bumpa Loyalty Rewards System

React 19 + TypeScript customer dashboard and admin panel for loyalty program. Features real-time points tracking, achievement unlocking, and badge progression.

## Quick Setup

```bash
npm install
npm run dev              # Runs on localhost:5173
npm run build           # Production build
npm test -- --watchAll=false  # Run tests
```

## Project Structure

```
src/
├── app/
│   ├── api/            # Axios config, type definitions
│   ├── stores/         # Zustand stores (auth, mode, redirect)
│   ├── hooks/          # useGet, usePost, useRefreshUserInfo
│   └── routing/        # ProtectedRoute, AdminProtectedRoute
├── components/         # Reusable UI components
│   ├── Button.tsx
│   ├── AuthButtons.tsx
│   └── Loader.tsx
├── modules/            # Feature modules
│   ├── landing/        # Home page with NavBar
│   ├── auth/           # Login, Register pages
│   ├── user-dashboard/ # Main dashboard
│   ├── ecommerce/      # Product listing & purchase
│   ├── admin/          # Admin panel
│   └── ...
└── main.tsx
```

## State Management (Zustand Stores)

 

**Design Pattern:**
- `useAppModeStore` uses sessionStorage to survive page refresh
- Routes set mode in useEffect when component mounts
- Axios interceptor auto-selects token based on current mode
- Separate auth stores prevent mode confusion

## Key Features

**User Authentication:**
- Login/Register pages with JWT token storage
- Post-login redirect: saves URL before login, returns after auth
- Automatic token selection in Axios based on app mode

**Dashboard:**
- Welcome section with total points
- Badge tier progression visualization
- Recent activity feed (purchases + achievements)
- Automatic data refresh via `useRefreshUserInfo()` hook

**E-Commerce Integration:**
- Product listing with purchase flow
- Redirect unauthenticated users to login (with return URL)
- Celebration modal on achievement/badge unlock
- Confetti animation for milestones

**Admin Panel:**
- User list with pagination
- Achievement tracking per user
- Separate admin authentication

 
 
## Architecture & Design Decisions

### 1. Zustand for State Management (vs Redux or Context API)
**Why:** Minimal boilerplate with simple API (no actions/reducers). Built-in persistence middleware for localStorage/sessionStorage. Good DevTools support. Ideal for moderate complexity without Redux overhead.

**Trade-off:** Less suitable for massive apps; Context API adds unnecessary complexity for feature stores.

### 2. Custom Hooks Pattern (vs Class Components or HOCs)
**Why:** React Hooks enable cleaner composition. Custom hooks (`useGet`, `usePost`, `useRefreshUserInfo`) encapsulate reusable behavior (API calls, caching, auth) without prop drilling or component nesting.

**Trade-off:** Requires understanding hook rules (dependency arrays, execution order).

### 3. Axios for HTTP (vs Native Fetch API or other libraries)
**Why:** Interceptors enable automatic token injection based on app mode. Built-in request/response transformation, timeout support, better error handling. Eliminates manual header/error wrapping logic.

**Alternative:** Fetch API would require custom interceptor middleware; other libraries add unnecessary weight.

### 4. Feature-Driven Module Structure (vs Layer-Based Separation)
**Why:** `src/modules/{feature}/` groups related components, hooks, types, data together. Clearer feature boundaries, easier to understand scope, move features independently.

**Trade-off:** Requires discipline to prevent circular dependencies between modules.

### 5. Separate Auth Stores for User/Admin (vs Single Store with Role Field)
**Why:** Prevents accidental token mixing between modes. Each store manages independent state. Dynamic token selection via `useAppModeStore.mode` in Axios interceptor.

**Trade-off:** More stores to manage; single role-based store would be simpler for basic use cases.

## Running Tests

```bash
npm test -- --watchAll=false   # CI mode (run once)
npm test                        # Watch mode (re-run on changes)
npm run lint                    # ESLint check
```

**Test Setup:**
- Jest configuration in `jest.config.js`
- Mocks in `src/setupTests.ts` for `window.matchMedia`, `localStorage`, `sessionStorage`
- Test files in `src/**/__tests__/` directory

 

## Styling

**Framework:** Tailwind CSS (utility-first)

**Theme:** Custom colors (text-primary, bg-primary, brand-primary, etc.)

**Icons:** Iconify React for icons throughout UI

 

## Environment Variables

```
VITE_API_URL=http://localhost:8000/api
VITE_ENV=development
```

## Docker

```bash
docker-compose up --build
# Frontend runs on localhost:5173
```

## Recent Updates

- Added `useRefreshUserInfo()` for fresh data on dashboard load
- Implemented post-login redirect via `useRedirectStore`
- Created `AuthButtons` component for DRY auth UI
- Updated authentication to use separate user/admin stores
- Mode tracking via sessionStorage (survives refresh)