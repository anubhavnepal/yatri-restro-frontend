# Security Audit Notes

- `npm audit` currently reports `3 moderate` vulnerabilities related to PostCSS.
- This is a transitive dependency issue pulled through Next.js rather than a directly selected package in this project.
- No `npm audit fix` or `npm audit fix --force` action was applied.
- We will update Next.js and its PostCSS dependency chain when an official safe patch is available.
- Until then, the app must not accept user-submitted CSS or render unsafe raw CMS HTML.
