# OrganAIzer

Mobile-first AI space organization assistant.

## Documentation

- [Browser-use Visual QA Plan](docs/testing/browser-use-visual-qa-plan.md)
- [Browser-use Visual QA Report Template](docs/testing/browser-use-report-template.md)

## Development

The monorepo foundation is scaffolded. App/package scripts are placeholders until the Astro landing, Vite web app, and NestJS API are implemented in later milestones.

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

## Testing approach

Browser-use is used for visual QA only: matching the implemented UI against the prototype and design system in `design/`.

Functional behavior such as uploads, API calls, AI responses, persistence, and rate limiting will be tested manually.
