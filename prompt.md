# Gezgin Product Specification

## Vision

Gezgin is a mobile and web travel discovery and trip planning application that helps first-time visitors discover places in a city and organize them into realistic day-trip or multi-day travel plans.

## MVP Features

1. User registration
2. User login
3. User logout
4. Persistent authentication session
5. User profile
6. Destination discovery
7. Place discovery
8. Place detail page
9. Day-trip creation
10. Multi-day trip creation
11. Adding places to a trip
12. Removing places from a trip
13. Reordering trip stops
14. Assigning places to different trip days
15. Saving trips securely
16. Istanbul seed data
17. Loading states
18. Empty states
19. Error states
20. Basic form validation

## Out of Scope for MVP

- Social feed, posts, likes, followers
- Booking flights/hotels/trains
- Payments and reservations
- AI itinerary generation or chatbots
- External map or place APIs (Google, Mapbox, Foursquare, OpenTripMap)
- Live location tracking

## Stack

- TypeScript (Strict)
- Expo React Native (Expo Router)
- Next.js App Router
- Supabase (Auth, PostgreSQL, Migrations, RLS)
- Zod
- pnpm + Turborepo
