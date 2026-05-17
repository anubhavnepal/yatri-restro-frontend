---
name: forms-validation
description: Design or review customer-facing forms so validation improves UX without pretending the frontend is the final authority.
---

# Forms Validation

## When to use this skill

- When planning or reviewing reservation, contact, newsletter, or checkout forms.
- When deciding validation rules, error messaging, and submit-state behavior.
- When checking whether forms preserve input and handle success or failure clearly.

## Project-specific rules

- Validate all forms on the frontend to improve UX, but never treat frontend validation as final authority.
- Reservation conflict logic belongs to the backend, not frontend-only logic.
- Validate required fields, email format, phone number format, guest count limits, date and time selection, and delivery address requirements where applicable.
- Show loading, success, and error states clearly.
- Preserve user input when validation fails.
- Use friendly, accessible error messaging rather than silent failures or cryptic responses.
- Keep validation logic consistent with typed form data and service-layer contracts.

## Expected output quality

- Produces forms that feel trustworthy and easy to complete.
- Prevents avoidable mistakes without blocking legitimate user input.
- Keeps validation logic clear, typed, and maintainable.
- Supports accessible, mobile-friendly interactions.

## Things to avoid

- Treating client validation as a replacement for backend validation.
- Deleting user input after a failed submit.
- Hiding submission errors or leaving the user uncertain about state.
- Overvalidating fields in a way that hurts usability.
- Embedding backend business rules directly in presentational components.

## Checklist before completing work

- Confirm required validation rules are covered for the form type.
- Confirm backend authority remains explicit.
- Confirm loading, success, and error states are defined.
- Confirm user input is preserved on validation failure.
- Confirm messages are accessible and understandable.
