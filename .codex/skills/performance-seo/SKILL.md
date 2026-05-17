---
name: performance-seo
description: Guide public-facing pages toward strong loading behavior, search visibility, and media efficiency without sacrificing the premium experience.
---

# Performance and SEO

## When to use this skill

- When planning or reviewing page structure, metadata, images, loading strategy, or client bundle impact.
- When deciding whether a UI enhancement is worth its runtime cost.
- When validating that public-facing routes are ready for search and social sharing.

## Project-specific rules

- Implementation must be mobile-first, accessible, SEO-aware, performant, and secure.
- Prefer Server Components where possible and keep Client Components intentional.
- Use metadata APIs for page titles, descriptions, and Open Graph support.
- Use optimized images and lazy-load non-critical media.
- Keep client-side JavaScript minimal.
- Use semantic HTML to support SEO and accessibility together.
- Support multilingual SEO readiness for English and Japanese public pages.
- Prioritize important user-facing routes such as home, menu, reservation, gallery, and contact.
- Avoid performance-heavy visuals that undermine mobile experience.

## Expected output quality

- Leads to fast-feeling pages with clear crawlable structure.
- Supports discoverability, sharing, and local restaurant trust signals.
- Keeps premium visuals within realistic performance budgets.
- Encourages good loading, empty, and error states across content-driven views.

## Things to avoid

- Inflating the client bundle with avoidable libraries or client rendering.
- Shipping unoptimized media by default.
- Ignoring metadata on core public routes.
- Treating SEO and performance as separate concerns.
- Letting decorative effects hurt mobile responsiveness.

## Checklist before completing work

- Confirm server-first rendering was considered.
- Confirm metadata and semantic structure are addressed.
- Confirm images and media follow optimized loading patterns.
- Confirm client-side JavaScript remains justified and limited.
- Confirm mobile performance stays a priority.
