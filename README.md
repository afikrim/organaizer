# OrganAIzer

Mobile-first AI space organization assistant.

## Documentation

- [Browser-use Visual QA Plan](docs/testing/browser-use-visual-qa-plan.md)
- [Browser-use Visual QA Report Template](docs/testing/browser-use-report-template.md)

## API contract

The full OpenAPI 3.1.0 specification lives at [`apps/api/openapi.yaml`](apps/api/openapi.yaml).
It documents every endpoint under `/v1`, the bearer session auth scheme, all request/response
schemas, and expected error codes.

Shared Zod schemas and inferred TypeScript types are the source of truth in
[`packages/schema`](packages/schema/src/index.ts) (`@organaizer/schema`).
[`packages/types`](packages/types/src/index.ts) (`@organaizer/types`) re-exports those types
as a thin compatibility layer — no definitions are duplicated.

## Development

The monorepo foundation is scaffolded. The NestJS API (milestone 4) is implemented with mock vision provider and in-memory storage. App/package scripts for Astro landing and Vite web app are placeholders.

```bash
# Install dependencies (requires pnpm 11+)
pnpm install

# Run all packages in dev mode
pnpm dev

# Type-check all packages
pnpm typecheck

# Build all packages
pnpm build

# Run all tests
pnpm test

# Lint all packages
pnpm lint

# Clean all build artifacts
pnpm clean
```

**Port conventions:** landing `4321` · web `5173` · API `3000` (base path `/v1`)

Copy `.env.example` to `.env` and fill in values before running.

The API defaults to in-memory persistence. Prisma/Postgres schema validation is available with:

```bash
pnpm --filter @organaizer/api prisma:validate
pnpm --filter @organaizer/api prisma:generate
```

### Opt-in Prisma persistence driver (milestone 6c)

Set `PERSISTENCE_DRIVER=prisma` (and `DATABASE_URL`) to switch sessions, analyses, and follow-up turns to Postgres-backed Prisma repositories. Image bytes remain in-process for this milestone; a future milestone will move them to blob storage (e.g. Supabase Storage).

```bash
# .env (copy from .env.example)
DATABASE_URL=postgresql://organaizer:organaizer@localhost:54322/organaizer?schema=public
PERSISTENCE_DRIVER=prisma

# Apply migrations, then start
pnpm --filter @organaizer/api prisma:migrate:dev
pnpm --filter @organaizer/api dev
```

The default (no `PERSISTENCE_DRIVER` set, or `PERSISTENCE_DRIVER=memory`) requires no database. All existing tests run in memory mode and pass without a DB.

### API quick-start

```bash
# Start the API in dev mode (hot-reload)
pnpm --filter @organaizer/api dev

# Or start the built output
pnpm --filter @organaizer/api build
pnpm --filter @organaizer/api start
```

Example usage:

```bash
# Health check
curl http://localhost:3000/v1/health

# Create a session
TOKEN=$(curl -s -X POST http://localhost:3000/v1/sessions | jq -r '.token')

# Submit an image for analysis
curl -s -X POST http://localhost:3000/v1/analyses \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@/path/to/room.jpg" \
  -F "goal=cleaner"
```

## Testing approach

Browser-use is used for visual QA only: matching the implemented UI against the prototype and design system in `design/`.

Functional behavior such as uploads, API calls, AI responses, persistence, and rate limiting will be tested manually.
