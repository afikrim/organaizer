# organAIzer

**Live:** [organaizer-eight.vercel.app](https://organaizer-eight.vercel.app) (landing) → [organaizer-app-psi.vercel.app](https://organaizer-app-psi.vercel.app) (app)
**Repo:** [github.com/afikrim/organaizer](https://github.com/afikrim/organaizer)

---

## What it is

A mobile-first web app that analyzes a photo of your space and tells you what to fix. Pick a goal (cleaner, safer, storage, work, aesthetics), upload a photo, and Gemini returns labeled zones with issues, suggestions, and an action checklist. You can ask follow-up questions about the result.

## How to run it

```bash
pnpm install
cp .env.example .env   # fill in GEMINI_API_KEY, DATABASE_URL, Supabase keys

# Run everything (landing :4321, web :5173, API :3000)
pnpm dev

# Or run individually
pnpm --filter @organaizer/api dev          # API (defaults to in-memory + mock vision)
pnpm --filter @organaizer/web dev           # SPA
pnpm --filter @organaizer/landing dev       # Landing page
```

Defaults work with zero config (in-memory storage, mock vision). For real analysis, set `VISION_DRIVER=gemini` + `GEMINI_API_KEY`. For persistence, set `PERSISTENCE_DRIVER=prisma` + `DATABASE_URL`. For image storage, set `STORAGE_DRIVER=supabase` + Supabase keys. Full deploy runbook: [`docs/deploy/vercel-supabase-runbook.md`](docs/deploy/vercel-supabase-runbook.md).

## Who it's for

People who look at a messy room and don't know where to start. The one job it has to do well: take a photo, give you specific, actionable steps, not generic advice.

## Why this problem

Everyone has a space they avoid dealing with. Existing tools are either to-do lists (you still have to figure out what to do) or interior design apps (they design, they don't organize). There's nothing that looks at your actual space and says "cables under the desk are a trip hazard, route them along the wall." That gap is worth solving because the friction is in the diagnosis, not the execution.

## What's already out there

Pinterest/Instagram for inspiration. Notion/Todoist for checklists. AI chatbots for generic advice. None of them look at your photo and give you zone-by-zone, site-specific guidance. organAIzer does.

## Scope

**In:** photo upload, goal selection, Gemini vision analysis with bounding-box zones, action checklist, follow-up Q&A, session auth, Postgres persistence, Supabase image storage, landing page, mobile-first SPA.

**Out:** user accounts (sessions are anonymous, token-based), saving/sharing analyses, multi-room support, before/after tracking, payment. These are post-MVP; the core loop works without them.

## Assumptions

- Users are on mobile (phone camera is the primary input).
- Gemini Flash is fast and cheap enough for a demo (it is, ~10s per analysis).
- Users don't need to save results across sessions for the MVP.
- 8MB image limit is enough (client-side downscaling handles phone photos).

## Three questions for a real user

1. After getting the analysis, do you actually act on it, or do you just look at it once and close it?
2. Would you want to take a "before" photo and come back later with an "after" photo?
3. Is one room at a time enough, or do you need to organize a whole apartment?

## How I'd know it's working

- Upload-to-result completes in under 15 seconds.
- Users click on zones and read the suggestions (not just scroll past).
- Follow-up questions are asked (indicates engagement with the result).
- Return rate: do they analyze a second room?

## What I'd do next

- User accounts + saved analyses (the biggest missing piece for retention).
- Before/after photo comparison.
- Product links in suggestions (e.g. "route cables with this cable manager").
- Multi-goal analysis (optimize for both safety and storage at once).

---

## How I used AI

**Where it helped:**
- Scaffolding the monorepo, NestJS API structure, and Prisma schema from a spec.
- Debugging a production 500: AI added debug logging across the analysis pipeline, which surfaced a foreign key constraint violation (`analyses_image_key_fkey`) caused by `SupabaseImageStorage` not writing the `image_objects` metadata row to Postgres. The fix was a one-liner upsert, but finding it would have taken hours without the logging.
- Generating the Astro landing page and React SPA UI from a design system spec.

**Where it got wrong:**
- The AI suggested `gemini-3.5-flash` as the model name in `.env`. That model doesn't exist. The correct name is `gemini-2.5-flash`. It was a confident hallucination that only surfaced when the API started returning model-not-found errors.