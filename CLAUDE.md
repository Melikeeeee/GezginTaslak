# CLAUDE.md

This file provides guidance for AI assistants and developers working on the **Gezgin** monorepo.

## Project Overview

Gezgin is a mobile and web travel discovery and trip planning application focused on helping users discover places in a city (starting with Istanbul) and organize them into realistic day-trip or multi-day travel itineraries.

## Architecture

- **Modular Monorepo**: Managed with `pnpm` workspaces and `Turborepo`.
- **Web**: Next.js App Router (`apps/web`).
- **Mobile**: Expo React Native with Expo Router (`apps/mobile`).
- **Shared Packages**:
  - `@gezgin/types`: Database & domain TypeScript interfaces.
  - `@gezgin/validation`: Zod schemas for runtime validation.
  - `@gezgin/supabase-queries`: Pure, client-agnostic database query functions.
  - `@gezgin/supabase-web`: Next.js browser and SSR Supabase clients.
  - `@gezgin/supabase-mobile`: Expo React Native Supabase client with AsyncStorage.
  - `@gezgin/config-typescript`: Shared TS configs.
  - `@gezgin/config-eslint`: Shared ESLint configs.

## Development Workflow

- Install dependencies: `pnpm install`
- Type checking: `pnpm typecheck`
- Linting: `pnpm lint`
- Build all: `pnpm build`
- Run web dev server: `pnpm --filter @gezgin/web dev`
- Run mobile app: `pnpm --filter @gezgin/mobile start`

## Strict Guidelines

1. **No External APIs in MVP**: Do not call Google Places, Foursquare, Mapbox, or external map APIs. All discovery data comes from local Supabase seed data.
2. **No Maps in MVP**: Strictly list and card interfaces. Latitude and longitude are stored for future map integration.
3. **Platform Separation**: Never import Next.js server-only code into the mobile application.
4. **Security**: Never expose Supabase service-role keys. Row Level Security (RLS) is strictly enforced on all tables.
