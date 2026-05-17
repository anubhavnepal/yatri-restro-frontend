---
name: i18n
description: Plan or review multilingual support for English and Japanese across static UI text, CMS data, and user flows.
---

# Internationalization

## When to use this skill

- When setting up or reviewing translations, locale routing, or localized content rendering.
- When designing components that must handle English and Japanese gracefully.
- When deciding whether text belongs in translation files or backend-managed multilingual fields.

## Project-specific rules

- Frontend should support English and Japanese.
- Use `next-intl` as the i18n strategy described in the blueprint.
- Supported locales are `en` and `ja`.
- Static UI copy belongs in translation files such as `messages/en.json` and `messages/ja.json`.
- CMS-managed multilingual content should render from backend fields such as `title_en`, `title_ja`, `description_en`, and `description_ja` based on the active locale.
- Avoid hardcoding public-facing text in components.
- Keep language switching simple and user-friendly.
- Design layouts to accommodate differences in text length and line breaks between English and Japanese.

## Expected output quality

- Makes localization feel built-in rather than retrofitted.
- Keeps static and CMS-managed text responsibilities clear.
- Avoids layout breakage across both supported languages.
- Produces a predictable developer workflow for adding or updating copy.

## Things to avoid

- Hardcoding strings in UI components.
- Mixing translation responsibilities between static files and CMS fields without clear rules.
- Designing only for English spacing and line lengths.
- Adding locale complexity beyond what the current product needs.
- Ignoring metadata and CTA copy localization needs.

## Checklist before completing work

- Confirm both English and Japanese are accounted for.
- Confirm static text and CMS text responsibilities are clear.
- Confirm layouts can tolerate multilingual text length differences.
- Confirm public-facing strings are not hardcoded.
- Confirm the language-switching experience stays simple.
