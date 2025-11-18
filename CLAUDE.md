# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Instant Infra is a React + TypeScript web application for tracking cloud infrastructure deployment challenges. Users can spin a wheel to randomly select cloud providers (AWS, GCP, Azure, Oracle) and deployment types (VMs, Kubernetes clusters, storage buckets, etc.), creating challenges they need to complete.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build with Vite
- `npm run build:dev` - Development build
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

Development server runs on `http://localhost:8080` (not the default Vite port 5173).

## Architecture & Key Concepts

### Data Storage Architecture

This application uses a **local JSON database** instead of traditional backend services. The data flow is:

1. **Source of Truth**: `src/data/localData.json` - Contains all challenges, providers, and deployments
2. **Database Layer**: `src/lib/localDatabase.ts` - Provides async-like CRUD operations
3. **Service Layer**: `src/services/*.Service.ts` - Business logic wrappers around database operations
4. **Components**: Use React Query to fetch and cache data from services

**Important**: When challenges are created or updated, data is saved to `localStorage` (key: `instantInfraData`), but the JSON file itself is modified in memory. The JSON file serves as the initial state when localStorage is empty.

### State Management Pattern

- **React Query** (`@tanstack/react-query`) for server state and caching
- **Context API** (`AuthContext`) for mock authentication state
- **Local state** (useState) for UI-specific state like modal visibility

All data fetching goes through React Query with query keys like:
- `["challenges"]` - List of deployment challenges
- `["cloudProviders"]` - Cloud provider definitions
- `["deployments"]` - Available deployment types

Use `queryClient.invalidateQueries()` to refresh data after mutations.

### Component Organization

- `src/components/` - Feature components (Login, SpinWheel, ProjectTracker, etc.)
- `src/components/ui/` - Reusable Radix UI + Tailwind components (shadcn/ui pattern)
- `src/pages/` - Route-level components (Game, About, NotFound)
- `src/contexts/` - React Context providers
- `src/types/` - TypeScript interfaces

### Routing Structure

The app uses React Router with these routes:
- `/` - Public project tracker (read-only view)
- `/game` - Interactive game with spin wheel and challenge creation
- `/about` - About page
- Authentication routes are commented out but the AuthContext infrastructure exists

### UI Component Pattern

This project uses **shadcn/ui** pattern with Radix UI primitives styled with Tailwind CSS. Components in `src/components/ui/` follow this pattern:
- Radix UI for accessibility and behavior
- Tailwind + CVA (class-variance-authority) for styling
- Path alias `@/` maps to `src/`

### Data Relationships

The database has three entities with the following relationships:

```
CloudProvider (id, name, color)
    ↓ (1:N)
Deployment (id, name, provider_id)
    ↓ (1:N)
Challenge (id, provider_id, deployment_id, is_done, created_at)
```

When displaying challenges, the app joins provider and deployment data to show friendly names instead of IDs. See `localDatabase.fetchChallenges()` for the join logic.

## TypeScript Configuration

- Path alias: `@/` → `src/`
- Strict mode enabled
- Target: ES2020
- Module: ESNext

## Styling Approach

- **Tailwind CSS** for utility-first styling
- **Framer Motion** for animations (see Game.tsx for variants patterns)
- **Custom CSS** in App.css and index.css for global styles and animations
- Color scheme uses CSS variables defined in index.css with theme support

## Authentication Note

The current AuthContext provides a **mock authentication system**. It accepts any email/password combination and creates a fake user session. This is intentional for the current deployment but could be replaced with real auth (Supabase, Auth0, etc.) by updating `src/contexts/AuthContext.tsx`.

## Build Configuration

- **Vite** with SWC for fast React refresh
- **lovable-tagger** plugin enabled in development mode only
- GitHub Actions workflow deploys to GitHub Pages on main branch pushes
- Production builds go to `dist/` directory

## Testing the Game Flow

To test the full game interaction:
1. Navigate to `/game`
2. Go to "Cloud Provider" tab → Spin the wheel
3. After provider selection, auto-switches to "Project" tab
4. Select a deployment type
5. Auto-switches to "Tracker" tab showing the new challenge
6. Check that the challenge appears in localStorage and the tracker UI

## Common Patterns

### Creating a New Challenge Service Method

Services should follow this pattern (see `challengesService.ts`):
```typescript
export async function myMethod(): Promise<ReturnType> {
  try {
    return await localDatabase.myMethod();
  } catch (error) {
    console.error("Error description:", error);
    return fallbackValue;
  }
}
```

### Using React Query for Data Fetching

```typescript
const { data, isLoading, error } = useQuery({
  queryKey: ["myData"],
  queryFn: myServiceFunction,
});
```

After mutations, invalidate queries:
```typescript
const queryClient = useQueryClient();
queryClient.invalidateQueries({ queryKey: ["myData"] });
```
