---
name: frontend-architecture
description: Define or review the frontend structure, boundaries, and implementation patterns for the restaurant platform before feature work begins.
---

# Frontend Architecture

## When to use this skill

- When planning frontend structure before building features.
- When deciding where components, services, stores, hooks, types, and utilities should live.
- When reviewing whether a proposed change respects the decoupled Next.js and Django REST architecture.

## Project-specific rules

- Treat `frontend/blueprint.md` as the primary architecture brief.
- The frontend is public and customer-facing only.
- Do not design or propose a custom admin dashboard.
- Keep the app aligned with Next.js App Router and TypeScript-first patterns.
- Keep backend communication behind typed service files and shared API utilities.
- Components must consume typed data from services, stores, or props rather than calling backend business APIs directly.
- Preserve the folder boundaries described in the blueprint for `app`, `components`, `services`, `store`, `hooks`, `lib`, `types`, and `messages`.
- Plan for English and Japanese support from the start.
- Keep mock data isolated so replacing it later only touches the service layer, API client, or environment configuration.

## Expected output quality

- Produces a clear, implementation-ready structure rather than vague architecture notes.
- Makes data flow, ownership, and replacement paths obvious.
- Reduces future rewrites by keeping service, state, and UI boundaries clean.
- Leaves the codebase easier to scale for menu, reservation, gallery, contact, and order flows.

## Things to avoid

- Mixing API logic into presentational components.
- Inventing architecture that conflicts with the blueprint.
- Adding abstractions before a real repeated need exists.
- Designing for internal admin workflows on the frontend.
- Locking components to mock-only data shapes.

## Checklist before completing work

- Confirm the proposal matches `frontend/blueprint.md`.
- Confirm service, component, store, and type boundaries are explicit.
- Confirm API access goes through typed services only.
- Confirm the structure supports i18n, accessibility, and mobile-first UI.
- Confirm the plan does not introduce unnecessary abstractions.
