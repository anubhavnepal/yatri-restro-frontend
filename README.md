# Yatri Restro Frontend

Customer-facing Next.js frontend for a premium Nepali restaurant experience in Japan.

This app currently runs in mock mode by default while the Django REST backend is still under development. The frontend already includes localized public flows for menu browsing, reservations, gallery, contact/newsletter, cart, and checkout previews, while keeping backend-owned business authority out of the UI layer.

## Project overview

- Audience: public restaurant guests only
- Locales: English and Japanese
- Frontend stack: Next.js App Router, TypeScript, Tailwind CSS v4
- State: Zustand for cart and small shared client state only
- Forms: `react-hook-form` + `zod`
- API layer: typed service modules over Axios
- CMS/admin assumption: Django Admin, not a custom frontend admin dashboard

## Mock mode note

- Mock mode remains the default in [service-runtime.ts](/D:/yatri_restro_new/frontend/lib/service-runtime.ts).
- The UI should continue to work without a live backend.
- Mock data stays isolated under [mock-data](/D:/yatri_restro_new/frontend/lib/mock-data).
- Final pricing, taxes, delivery fees, reservation conflicts, order acceptance, and payment status remain backend-owned concerns.

## Backend contract note

- Draft frontend-needed backend contract: [backend-api-contract.md](/D:/yatri_restro_new/frontend/docs/backend-api-contract.md)
- Current audit note: [security-audit-notes.md](/D:/yatri_restro_new/frontend/docs/security-audit-notes.md)

## Tech stack

- `next` `16.2.6`
- `react` `19`
- `typescript`
- `tailwindcss` `4`
- `next-intl`
- `axios`
- `zustand`
- `react-hook-form`
- `zod`
- `framer-motion`
- `lucide-react`

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file from [.env.example](/D:/yatri_restro_new/frontend/.env.example):

```bash
copy .env.example .env.local
```

3. Set `NEXT_PUBLIC_API_URL` in `.env.local`.

Important:

- Next.js only exposes browser-readable environment variables when they are prefixed with `NEXT_PUBLIC_`.
- Do not place secrets in `NEXT_PUBLIC_*` variables.
- Do not commit `.env.local`.

4. Start the dev server:

```bash
npm run dev
```

5. Open the app:

- [http://localhost:3000](http://localhost:3000)

## Common scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npx tsc --noEmit
```

## Architecture notes

- Public routes live under `app/[locale]/...`
- Locale ownership comes from `next-intl`, not Zustand
- Shared cart state lives in Zustand
- Components must not call backend business APIs directly
- Business API calls must go through typed services in [services](/D:/yatri_restro_new/frontend/services)
- Service runtime switching stays centralized in [service-runtime.ts](/D:/yatri_restro_new/frontend/lib/service-runtime.ts)

## Current public flows

- Home preview
- Menu listing and menu detail
- Reservation preview and request submission
- Gallery preview
- Contact and newsletter submission
- Cart review
- Checkout preview

## Integration guidance

When the backend is ready:

1. Confirm the Django API against [backend-api-contract.md](/D:/yatri_restro_new/frontend/docs/backend-api-contract.md)
2. Keep response normalization in the adapter/service boundary
3. Preserve the current `{ success, message, data }` envelope where possible
4. Switch to live mode only after endpoint URLs, media shape, and validation error shape are confirmed

## Guardrails

- Do not build a custom admin dashboard in this app
- Do not move backend-owned business rules into the frontend
- Do not let components call Axios or `fetch` directly for business APIs
- Do not persist customer personal data in Zustand or local storage
