---
name: production-planning
description: Break work into realistic, blueprint-aligned implementation steps so the restaurant frontend can ship progressively without architectural drift.
---

# Production Planning

## When to use this skill

- When turning the blueprint into an execution plan.
- When deciding the order of frontend work before implementation begins.
- When reviewing whether a proposed milestone sequence is realistic and low risk.

## Project-specific rules

- Start from `frontend/blueprint.md` and respect its scope restrictions.
- Plan the frontend as a public customer experience only.
- Do not include custom admin dashboard work.
- Keep API integration, mock replacement, i18n, accessibility, SEO, performance, and mobile behavior visible in the plan from the start.
- Prefer thin vertical slices and focused milestones over broad, vague phases.
- Keep plans aligned with the current staged strategy: architecture first, then reusable structure, then customer flows.
- Do not schedule fake backend business logic as a substitute for real backend authority.
- Avoid introducing abstractions or packages before their need is proven.

## Expected output quality

- Produces a sequence the team could actually execute.
- Surfaces dependencies, risks, and replacement points early.
- Keeps the blueprint’s constraints visible during delivery.
- Helps the project move from planning to implementation with minimal rework.

## Things to avoid

- Planning too many features in parallel without clear dependencies.
- Hiding important architectural work under vague labels.
- Treating mock data as a long-term plan.
- Including out-of-scope features like dashboards, Stripe checkout, chat, or analytics extras.
- Turning a simple sequence into heavyweight process overhead.

## Checklist before completing work

- Confirm the plan follows the blueprint and scope restrictions.
- Confirm public customer flows are prioritized logically.
- Confirm service, mock, i18n, and state needs are reflected early enough.
- Confirm backend-owned rules stay with the backend in the plan.
- Confirm the sequence is focused and realistically executable.
