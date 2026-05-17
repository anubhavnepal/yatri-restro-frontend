---
name: code-review
description: Review proposed frontend changes for architecture, UX, accessibility, integration, security, and maintainability before they become expensive to unwind.
---

# Code Review

## When to use this skill

- When reviewing pull requests, patches, implementation proposals, or generated code.
- When checking whether a change still matches the blueprint and project rules.
- When looking for risks before feature work continues.

## Project-specific rules

- Review against `frontend/blueprint.md` first.
- Findings should prioritize real bugs, regressions, contract mismatches, scope creep, and maintainability risks.
- Check that components do not directly call backend business APIs.
- Check that typed services, i18n, accessibility, mobile-first behavior, and SEO concerns are not skipped.
- Check that Zustand is used only where shared client state is actually needed.
- Check that mock data remains isolated and temporary.
- Check that no admin dashboard, fake backend authority, or unnecessary abstraction slipped in.
- Check that security expectations around secrets, user data, and HTML rendering are respected.

## Expected output quality

- Surfaces the most important issues first with clear reasoning.
- Ties findings back to project rules instead of generic opinions.
- Distinguishes between must-fix risks and lighter cleanup suggestions.
- Helps the next implementation step become safer and clearer.

## Things to avoid

- Focusing mostly on formatting while missing architecture or security problems.
- Approving code that bypasses service-layer or backend-authority rules.
- Letting scope creep pass without calling it out.
- Giving vague feedback without concrete reasoning.
- Treating blueprint conflicts as minor style choices.

## Checklist before completing work

- Confirm the review checked blueprint alignment first.
- Confirm major risks are ordered ahead of minor polish notes.
- Confirm API, state, i18n, accessibility, security, and performance concerns were considered.
- Confirm scope restrictions were enforced.
- Confirm feedback is specific enough to act on.
