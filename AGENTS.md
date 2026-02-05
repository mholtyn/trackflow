# Agent Guide

## Purpose
Agents act as senior full-stack collaborators. Keep responses concise,
clarify uncertainty before coding, and align suggestions with the rules linked below.

## Rule Index
- @ai-rules/rule-loading.md — always load this file to understand which other files you need to load

## Repository Overview
- **Backend**: FastAPI app in `app/`
  - Routers under `app/routers/` (users, tracks, workspaces, submissions)
  - Services under `app/services/` handle business logic
  - Schemas under `app/schemas/` define Pydantic models
  - Database / ORM setup in `app/database.py` and `app/models/`

- **Frontend**: React + TypeScript Vite app in `frontend/`
  - Routing under `frontend/src/app/router.tsx`
  - Pages under `frontend/src/pages/**`
  - Reusable components under `frontend/src/components/**`
  - Data fetching with `@tanstack/react-query` and generated API client under `frontend/src/client/**`

## Code Style
- **Python (backend)**
  - Follow modern Python best practices and idiomatic style (PEP 8 / Ruff defaults).
  - Use type hints consistently for public functions, service interfaces, and schemas.
  - Prefer explicit, descriptive naming over abbreviations.
  - Keep functions small and focused; avoid deeply nested control flow.
  - Let `ruff` be the source of truth for formatting and linting decisions.

- **TypeScript / React (frontend)**
  - Use modern TypeScript with strict typing; avoid `any` unless absolutely necessary and then document why.
  - Prefer React functional components with hooks; no class components.
  - Use clear, descriptive prop and state names; prefer discriminated unions for complex state where helpful.
  - Keep components presentational where possible and move reusable logic into custom hooks.
  - Follow the existing ESLint/TypeScript configuration in the repo as the source of truth for style.

## Architecture & Patterns
- **Backend (FastAPI)**
  - **Layered architecture**:
    - Routers in `app/routers/` are thin: parameter parsing, auth/permission checks, and delegating to services.
    - Business logic lives in `app/services/`; avoid putting domain rules directly in routers or models.
    - Persistence concerns live in `app/models/` and database utilities in `app/database.py`.
    - Input/output contracts are defined with Pydantic schemas in `app/schemas/`.
  - **Separation of concerns**:
    - Keep HTTP concerns (status codes, headers) at the router layer.
    - Keep data access and transactions in services or dedicated repository helpers, not sprinkled across the app.
  - **Extensibility**:
    - When adding new features, follow the existing pattern: **model/schema → service → router**.

- **Frontend (React + TypeScript)**
  - **Structure**:
    - High-level routing in `frontend/src/app/router.tsx`.
    - Pages under `frontend/src/pages/**` orchestrate data fetching and screen-level layout.
    - Reusable UI components under `frontend/src/components/**` (including layouts and design system components).
    - API access and client code under `frontend/src/client/**` and domain-specific hooks under `frontend/src/hooks/**`.
  - **Data flow**:
    - Use React Query for server state and React component state for local UI state.
    - Prefer custom hooks for data fetching and business logic, keeping components mostly declarative and UI-focused.
  - **Consistency**:
    - When implementing new screens, mirror the existing patterns for similar pages (e.g., submissions, tracks, workspaces).

## Workflow
- Ask for clarification when requirements are ambiguous; surface 2–3 options when trade-offs matter
- Update documentation and related rules when introducing new patterns or services
- **Backend changes (new endpoints, new routes, new service methods, schema/DB changes):** Before making ANY such changes, ask the user if you may proceed and briefly explain why the change is needed. Do not implement backend changes until the user approves.

## Testing
[future feature, not implemented yet]

## Special Notes
- Do not mutate files outside the workspace root without explicit approval
- Avoid destructive git operations unless the user requests them directly
- When unsure or need to make a significant decision ASK the user for guidance