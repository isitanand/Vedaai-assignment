# VedaAI — AI Question-Paper Generator

A full-stack web app where a teacher specifies an assignment (subject, topic,
question-type mix, marks, difficulty split, due date) and an LLM asynchronously
generates a complete, structured question paper **with answer keys** — while the
teacher watches real-time progress.

> Built on the provided `turbo` + `pnpm` monorepo and the `@vedaai/shared`
> contract package. See [PLAN.md](PLAN.md) for the full architecture and design
> rationale.

## Stack

| Layer | Tech |
|---|---|
| Web | Next.js 14 (App Router), TypeScript, Tailwind, TanStack Query, socket.io-client |
| API | Express, TypeScript, Mongoose, BullMQ, Socket.io, Zod |
| Generation | Google **Gemini** (structured JSON output) + deterministic mock fallback |
| Data | MongoDB (persistence), Redis (BullMQ queue) |
| Shared | `@vedaai/shared` — types + Zod validators used by both ends |

## Architecture in one line

`POST /assignments` → save spec → **enqueue job** → worker calls Gemini →
validate output (Zod) → persist paper → **emit Socket.io progress** → UI updates
live and redirects to the paper.

---

## Quick start

```bash
pnpm install
pnpm --filter @vedaai/shared build      # build the shared contract first
```

Then pick **one** of the two run modes:

### Option A — full infra (Docker; the graded setup)

```bash
pnpm infra:up                            # MongoDB + Redis via docker-compose
cp apps/api/.env.example apps/api/.env   # set INFRA_MODE=docker (default)
cp apps/web/.env.local.example apps/web/.env.local
pnpm dev                                 # web :3000, api :4000, BullMQ worker
```

### Option B — zero external services (no Docker)

In-memory MongoDB + an inline queue. Nothing else to install.

```bash
# apps/api/.env
INFRA_MODE=memory
```

```bash
pnpm dev
```

> First run in memory mode downloads a one-time MongoDB binary (~600MB) via
> `mongodb-memory-server`.

### Gemini key (optional)

Set `GEMINI_API_KEY` in `apps/api/.env` to use real generation. **Leave it
empty** and the API uses a deterministic mock generator that returns a fully
schema-valid paper — so the entire flow is demoable with zero keys or cost.

Get a key: https://aistudio.google.com/apikey

---

## Environment variables

**`apps/api/.env`**
| Var | Default | Notes |
|---|---|---|
| `PORT` | `4000` | |
| `CORS_ORIGIN` | `http://localhost:3000` | web origin |
| `INFRA_MODE` | `docker` | `docker` or `memory` |
| `MONGODB_URI` | `mongodb://localhost:27017/vedaai` | docker mode |
| `REDIS_URL` | `redis://localhost:6379` | docker mode |
| `GEMINI_API_KEY` | _(empty)_ | empty → mock generator |
| `GEMINI_MODEL` | `gemini-2.0-flash` | |

**`apps/web/.env.local`**
| Var | Default |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000` |
| `NEXT_PUBLIC_SOCKET_URL` | `http://localhost:4000` |

---

## API reference

| Method | Path | Purpose |
|---|---|---|
| `GET` | `/api/health` | `{ ok, mongo, redis }` |
| `POST` | `/api/assignments` | create + enqueue generation |
| `GET` | `/api/assignments` | list (`?status&page&limit`) |
| `GET` | `/api/assignments/:id` | fetch one |
| `POST` | `/api/assignments/:id/retry` | re-run a failed generation |
| `GET` | `/api/papers/:id` | fetch a generated paper |
| `GET` | `/api/papers/by-assignment/:assignmentId` | paper for an assignment |

**Real-time (Socket.io):** client emits `join { assignmentId }`; server emits
`job:update` with `JobUpdatePayload { jobId, status, progress, message }`.

---

## Project layout

```
apps/
  api/   Express + BullMQ + Socket.io + Gemini  (see src/)
  web/   Next.js App Router UI                  (see src/)
packages/
  shared/  types + Zod validators (the contract)
```

## Scripts

| Command | What |
|---|---|
| `pnpm dev` | run web + api (turbo) |
| `pnpm build` | build all packages |
| `pnpm type-check` | type-check all packages |
| `pnpm infra:up` / `infra:down` | Docker Mongo + Redis |

## Notes & next steps

- The visual theme is a placeholder design system in `apps/web/src/styles/globals.css`
  (single-block CSS tokens) — built to be re-skinned to the Figma screenshots in one place.
- Stretch ideas tracked in [PLAN.md](PLAN.md): PDF export polish, regeneration
  with tweaks, auth, dark mode.
