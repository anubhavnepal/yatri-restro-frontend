---
name: nextjs-best-practices
description: Apply modern Next.js App Router guidance to keep the restaurant frontend fast, safe, and easy to maintain.
---

# Next.js Best Practices

## When to use this skill

- When designing or reviewing pages, layouts, route segments, metadata, or rendering strategy.
- When deciding whether code belongs in a Server Component or Client Component.
- When planning how Next.js should handle images, SEO, environment variables, and loading behavior.

## Project-specific rules

- Prefer Server Components by default.
- Use Client Components only when interactivity is required.
- Use App Router conventions.
- Use `next/image` for optimized images.
- Use metadata APIs for SEO.
- Keep route structure clean.
- Keep environment variables safe.
- Avoid unnecessary client-side JavaScript.
- Align route and layout decisions with the premium public restaurant experience, not admin workflows.
- Keep API base configuration behind `NEXT_PUBLIC_API_URL`.
- Do not let route components embed direct backend business API calls when a service file should own them.

## Expected output quality

- Leads to pages that are SEO-aware, performant, and easy to reason about.
- Minimizes hydration cost and keeps client bundles intentional.
- Produces route and layout choices that feel native to App Router rather than legacy pages patterns.
- Keeps future multilingual expansion manageable.

## Things to avoid

- Defaulting to Client Components without a clear interactive need.
- Placing unsafe secrets in public environment variables.
- Bloating pages with avoidable browser-only JavaScript.
- Using raw `img` tags for important CMS-managed media without justification.
- Creating messy route nesting or unclear layout ownership.

## Checklist before completing work

- Confirm Server versus Client boundaries are justified.
- Confirm metadata strategy is considered for user-facing routes.
- Confirm images and media would use optimized Next.js patterns.
- Confirm environment variable usage is safe and minimal.
- Confirm no unnecessary client-side JavaScript has been introduced.
