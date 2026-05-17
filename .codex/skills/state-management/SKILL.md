---
name: state-management
description: Define when and how shared client state should use Zustand while keeping server data and local UI state appropriately scoped.
---

# State Management

## When to use this skill

- When deciding whether data belongs in props, local component state, server rendering, or a shared Zustand store.
- When planning cart, reservation, language, or UI state behavior.
- When reviewing whether a proposed store is too broad or too coupled.

## Project-specific rules

- Cart and order shared client state should use Zustand.
- Keep Zustand focused on shared interactive client state such as cart, reservation flow, language UI state, and drawer or modal state.
- Do not store server data globally unless there is a clear need.
- Use strict TypeScript types for store shape, actions, and derived values.
- Keep stores small, domain-oriented, and easy to test mentally.
- Preserve backend authority for reservation availability and validation rather than caching false certainty in the client.
- Avoid introducing another global state library.

## Expected output quality

- Produces stores with clear ownership and minimal surprise.
- Reduces prop drilling where it matters without turning Zustand into a dumping ground.
- Keeps server-rendered content and client interaction concerns separate.
- Supports cart, reservation, and localization flows cleanly.

## Things to avoid

- Globalizing data that could stay local or server-rendered.
- Creating one oversized store for unrelated concerns.
- Duplicating backend truth in client state.
- Using Zustand for simple one-component UI state without a shared need.
- Leaving store actions weakly typed or ambiguous.

## Checklist before completing work

- Confirm shared state truly needs a store.
- Confirm store responsibilities are narrowly scoped.
- Confirm types are explicit for state and actions.
- Confirm backend-owned truth is not being recreated on the client.
- Confirm no unnecessary state library or abstraction is being introduced.
