<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes. APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Instructions

Read `blueprint.md` before making major decisions. Treat it as the source of truth when any implementation detail, scope boundary, or architectural choice is unclear.

## Project Context

- This project is a premium customer-facing restaurant platform for a Nepali cuisine restaurant operating in Japan.
- The public frontend is built with Next.js, TypeScript, and Tailwind CSS.
- The backend is Django REST Framework with Django Admin as the CMS and internal management interface.
- The frontend consumes CMS-managed content through REST APIs and must remain decoupled from backend implementation details.

## Global Rules

- Do not build a custom admin dashboard.
- Do not modify app routes, install packages, or implement pages unless the task explicitly asks for that work.
- Do not create fake backend behavior or frontend-only business rules that belong to the backend.
- Keep changes focused, reversible, and aligned with the blueprint.
- Prefer existing framework capabilities over new abstractions.

## Frontend Architecture Rules

- Use `NEXT_PUBLIC_API_URL` as the only frontend API base URL source.
- Route backend business communication through typed service files.
- Do not let components call `fetch` or Axios directly for backend business APIs.
- Keep backend response handling aligned with `{ success, message, data }`.
- Prefer Server Components by default and use Client Components only when interactivity requires them.
- Keep route structure clean and App Router friendly.

## Product Rules

- Support English and Japanese.
- Use Zustand for shared client state such as cart and order-related flows.
- Treat reservation conflict logic and final validation as backend responsibilities.
- Use mock data only as a temporary bridge and keep it isolated so it can be replaced through the service layer.
- Build with mobile-first, accessibility, SEO, performance, and security expectations from the start.

## Design Direction

- The visual direction is premium Japanese luxury dining.
- Aim for calm, elegant, cinematic presentation rather than generic restaurant UI.
- Keep animations subtle and performant.
- Maintain strong readability, clear calls to action, and accessible focus states.

## Working Style

- Use the relevant project skill before major planning, architecture, UI, integration, security, performance, or review work.
- Keep service contracts typed, stores focused, and component responsibilities narrow.
- Avoid unnecessary packages and abstractions.
- Summarize what changed, what did not change, and the next recommended prompt after each documentation-heavy task.
