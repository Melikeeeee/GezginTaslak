# Gezgin (Gezgin Monorepo)

Travel discovery and itinerary planning application for Web (Next.js) and Mobile (Expo React Native), backed by Supabase.

## Architecture

- `apps/web`: Next.js App Router web application
- `apps/mobile`: Expo React Native mobile application with Expo Router
- `packages/types`: Shared domain and database TypeScript interfaces
- `packages/validation`: Shared Zod validation schemas
- `packages/supabase-queries`: Client-agnostic Supabase query layer
- `packages/supabase-web`: Web-specific Supabase SSR and browser clients
- `packages/supabase-mobile`: Mobile-specific Supabase client with persistent storage
- `packages/config`: Shared ESLint and TypeScript configurations
- `supabase`: PostgreSQL migrations and seed data

## Prerequisites

- Node.js (v20+ recommended)
- `pnpm` (v9+)
- Supabase account & project

## Getting Started

1. Copy environment variables:
   ```bash
   cp .env.example .env
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run checks:
   ```bash
   pnpm typecheck
   pnpm lint
   pnpm build
   ```
4. Start dev servers:
   - Web: `pnpm --filter @gezgin/web dev`
   - Mobile: `pnpm --filter @gezgin/mobile start`
