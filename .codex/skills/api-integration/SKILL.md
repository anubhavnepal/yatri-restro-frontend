---
name: api-integration
description: Define or review how the Next.js frontend should communicate with the Django REST backend through typed, replaceable service layers.
---

# API Integration

## When to use this skill

- When planning service files, API clients, endpoint contracts, or response typing.
- When reviewing whether frontend code respects the backend integration boundary.
- When preparing mock-backed frontend flows to transition cleanly to real APIs later.

## Project-specific rules

- The backend is Django REST Framework and the frontend consumes CMS-managed content through REST APIs.
- The API base URL must come from `NEXT_PUBLIC_API_URL`.
- API communication must go through typed service files.
- Components must not directly call Axios or `fetch` for backend business APIs.
- Backend API response shape should follow `{ success, message, data }`.
- Shared response typing should reflect `ApiResponse<T>`.
- Keep service ownership split by domain such as menu, reservation, order, gallery, contact, and newsletter.
- Reserve backend authority for reservation conflicts, business validation, and final state decisions.
- If mock data is used, service signatures should remain compatible with later real API replacement.

## Expected output quality

- Produces a clean service layer that components can trust.
- Keeps transport concerns, typing, and backend contracts centralized.
- Makes switching from mock data to live APIs low risk.
- Clarifies ownership between UI, service logic, and backend authority.

## Things to avoid

- Hardcoding backend URLs in components.
- Returning loosely typed `any` shapes from services.
- Letting components know about transport details they should not own.
- Embedding frontend-only assumptions about backend validation.
- Mixing mock and real API logic in a way that is hard to remove later.

## Checklist before completing work

- Confirm `NEXT_PUBLIC_API_URL` is the only API base source.
- Confirm service functions are typed and domain-specific.
- Confirm response handling follows `{ success, message, data }`.
- Confirm components stay free of direct backend business API calls.
- Confirm backend authority is preserved for validation and conflicts.
