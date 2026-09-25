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
  
# Gezgin - Seyahat ve Rota Planlama Uygulaması 

Gezgin, kullanıcıların interaktif seyahat programları oluşturabilmesi ve harita üzerinde rotalarını takip edebilmesi için tasarlanmış modern bir web/mobil konsept uygulamasıdır. Proje bitince kullanıcıların kendilerine göre rotolar oluşturması, uygulamalar arasında gezinmeden her şeye tek uygulama üzerinden erişmesi, paylaşım yapıp takipleşebilmesi, arkadaşlarının rotalarını kullanıp gezebilmesi planlanmaktadır. Ayrıca seyehatte problem olan ulaşım ve konaklamayı tek uygulamada toparlar. Uygulama henüz bitmemiştir ve yapım aşamasındadır.

Bu proje, yapay zeka destekli geliştirme araçları kullanılarak hızlı prototipleme (MVP) süreçlerinin test edilmesi amacıyla aktif olarak geliştirilmektedir.

# Öne Çıkan Özellikler
İnteraktif Rota Planlama
Harita Entegrasyonu:
Modern Mimari

 Kullanılan Teknolojiler
 Frontend: Flutter, Next.js
Backend & Veritabanı: Supabase
Harita Servisi: Leaflet
Geliştirme Yaklaşımı: AI-Assisted Development (Yapay Zeka Destekli Geliştirme)

 Ekran Görüntüleri
<img width="1575" height="825" alt="image" src="https://github.com/user-attachments/assets/95404265-6e9b-4127-8081-d931c0b8641d" />

<img width="1556" height="816" alt="image" src="https://github.com/user-attachments/assets/8d424930-2889-4819-8efa-ee974d4d661e" />

<img width="1527" height="793" alt="image" src="https://github.com/user-attachments/assets/4f24d1ce-cdd1-4b5c-be4d-c000e0ca40da" />

<img width="1575" height="842" alt="image" src="https://github.com/user-attachments/assets/3be5a9d7-7fa2-4643-97d3-3a06c07e4395" />


---
