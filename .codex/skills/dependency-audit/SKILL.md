---
name: dependency-audit
description: Evaluate proposed frontend dependencies for necessity, overlap, maintenance quality, and alignment with the project’s minimal-stack philosophy.
---

# Dependency Audit

## When to use this skill

- When considering any new npm package.
- When reviewing whether an existing dependency is still justified.
- When deciding between a framework-native solution and a third-party library.

## Project-specific rules

- Check `package.json` before adding packages.
- Avoid duplicate packages solving the same problem.
- Prefer built-in Next.js and React features where possible.
- Run `npm audit` after installing dependencies.
- Review package popularity, maintenance, and necessity before adding dependencies.
- Do not install packages without explaining why they are needed.
- Keep the frontend dependency footprint lean because performance, maintainability, and security matter.
- Match package choices to the current blueprint and do not add packages for features outside approved scope.
- Prefer official packages and actively maintained libraries when third-party code is actually necessary.

## Expected output quality

- Produces clear reasoning for each dependency decision.
- Avoids package sprawl and overlapping tools.
- Keeps the project easier to secure, upgrade, and understand.
- Favors durable choices over convenience-driven additions.

## Things to avoid

- Installing a package before checking whether the stack already covers the need.
- Adding multiple libraries for one narrow problem.
- Choosing stale or obscure packages without strong justification.
- Growing dependencies for speculative future features.
- Treating `npm audit` as optional after install work.

## Checklist before completing work

- Confirm `package.json` was reviewed first.
- Confirm built-in framework features were considered.
- Confirm there is no duplicate or overlapping package.
- Confirm necessity, maintenance, and popularity were evaluated.
- Confirm the reason for any package addition is explicit and `npm audit` is planned after install work.
