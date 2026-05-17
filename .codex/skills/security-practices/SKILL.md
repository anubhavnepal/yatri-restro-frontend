---
name: security-practices
description: Review frontend decisions for safe environment handling, form behavior, data exposure, and dependency hygiene on the restaurant platform.
---

# Security Practices

## When to use this skill

- When handling environment variables, forms, user data, API integration, rendered content, or package decisions.
- When reviewing whether a frontend change could expose sensitive information or weaken backend authority.
- When planning any feature that touches customer data or external integrations.

## Project-specific rules

- No exposed secrets.
- Never hardcode API keys.
- Only safe public variables may use `NEXT_PUBLIC_`.
- Validate all forms on frontend but never trust frontend validation as final authority.
- Avoid unsafe HTML rendering.
- Avoid storing sensitive customer data unnecessarily.
- Avoid logging personal customer data.
- Keep dependency usage minimal.
- Prefer official packages and actively maintained libraries.
- The frontend is public and customer-facing, so assume anything shipped to the browser is visible.
- Use the backend as the final authority for reservation conflicts, order validation, and protected business rules.
- Treat CMS-managed rich content cautiously and do not render raw HTML without a clear sanitization strategy.

## Expected output quality

- Lowers risk without overcomplicating the frontend.
- Keeps sensitive data handling disciplined and intentional.
- Preserves trust between the public frontend and backend authority.
- Produces security guidance that is practical for daily implementation work.

## Things to avoid

- Shipping secrets or private tokens to the client.
- Trusting hidden fields, disabled controls, or client checks as protection.
- Logging customer names, emails, phone numbers, or addresses unnecessarily.
- Rendering unsanitized HTML from CMS or user input.
- Adding dependencies casually when built-in or maintained options would suffice.

## Checklist before completing work

- Confirm no secret or sensitive value is exposed to the client.
- Confirm form validation is user-friendly but not treated as final authority.
- Confirm no unsafe HTML rendering path has been introduced.
- Confirm sensitive customer data is minimized and not logged casually.
- Confirm dependency choices remain minimal and reputable.
