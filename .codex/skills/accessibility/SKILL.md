---
name: accessibility
description: Keep the restaurant frontend usable for keyboard, screen reader, and low-vision users while preserving the premium visual direction.
---

# Accessibility

## When to use this skill

- When reviewing UI structure, forms, navigation, media, or interactive components.
- When checking whether premium styling still supports inclusive usability.
- When planning menus, drawers, dialogs, reservations, and CTA-heavy flows.

## Project-specific rules

- Use semantic HTML wherever possible.
- Ensure keyboard-accessible navigation, buttons, forms, dialogs, and drawers.
- Provide proper labels, instructions, and error relationships for form fields.
- Maintain sufficient color contrast even within the premium dark luxury aesthetic.
- Preserve visible focus states.
- Use descriptive alt text for meaningful images and avoid decorative noise.
- Ensure English and Japanese experiences remain understandable with assistive technologies.
- Do not let animation, overlays, or custom styling block accessibility fundamentals.

## Expected output quality

- Produces interfaces that are inclusive by default rather than patched later.
- Keeps premium presentation compatible with strong usability.
- Supports screen reader, keyboard, and touch users well.
- Reduces accessibility regressions during future iteration.

## Things to avoid

- Using non-semantic wrappers where a native element fits.
- Removing focus indicators for aesthetic reasons.
- Relying only on color to communicate state.
- Creating inaccessible custom controls without keyboard support.
- Treating accessibility as a final polish step only.

## Checklist before completing work

- Confirm semantic structure is appropriate.
- Confirm keyboard and focus behavior is accounted for.
- Confirm contrast and readability remain strong.
- Confirm forms have proper labels and error communication.
- Confirm meaningful media has useful alt text or is correctly decorative.
