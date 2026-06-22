# organAIzer — Vercel + Supabase Deploy Runbook

> Target: a stable live demo. Three Vercel projects (API, web app, landing) plus a
> Supabase project (Postgres + Storage). Everything is opt-in via env vars; the
> defaults remain memory/mock for local dev.

This runbook is the source of truth for taking the MVP live. Some steps need your
account credentials / CLI auth, so you run them (use `! <command>` in the Claude
Code prompt to run inline). Where a step is likely to need one round of live
iteration, it is flagged with **⚠ verify on first deploy**.

---

## 0. Architecture

| Piece            | Host                         | Notes |
|------------------|------------------------------|-------|
| Landing (Astro)  | Vercel project, root `apps/landing` | Static. CTA points at the web app. |
| Web app (Vite)   | Vercel project, root `apps/web`     | Static SPA. Calls the API. |
| API (NestJS)     | Vercel project, root `apps/api`     | Single Fluid-compute Function (zero-config NestJS). |
| Postgres         | Supabase                     | Sessions + analyses (`PERSISTENCE_DRIVER=prisma`). |
| Image storage    | Supabase Storage             | Private bucket + signed URLs (`STORAGE_DRIVER=supabase`). |
| Vision           | Google Gemini                | `VISION_DRIVER=gemini`. |

Why this shape: Vercel Functions are **stateless**, so the in-memory session/
analysis/image drivers cannot back a deployment — persistence must be Postgres and
image bytes must live in Supabase Storage. The SPA loads images directly from
Supabase signed URLs, so the API never streams image bytes in production.

---

## 1. Prerequisites

- Vercel CLI **≥ 48.4.0** (`vc --version`) — required for zero-config NestJS.
- A Supabase project (free tier is fine).
- A Google Gemini API key.
- `pnpm` (repo uses pnpm workspaces + Turborepo).

---

## 2. Supabase setup

### 2.1 Get credentials
From the Supabase dashboard → Project Settings:
- **Project URL** → `SUPABASE_URL` (e.g. `https://abcd.supabase.co`)
- **service_role key** (API settings) → `SUPABASE_SERVICE_ROLE_KEY` (server-only secret)
- **anon key** → only needed if the frontend ever talks to Supabase directly (it
  does not in this MVP).

### 2.2 Database connection strings (IMPORTANT for serverless)
Serverless functions open many short-lived connections, so use the **pooled**
connection at runtime and the **direct** connection only for migrations:

- **Runtime `DATABASE_URL`** → the Supabase *Connection Pooler* string (port `6543`),
  with pooling params appended:
  `postgresql://...:6543/postgres?pgbouncer=true&connection_limit=1`
- **Migration URL** → the *direct* connection string (port `5432`).

### 2.3 Run migrations (one-time, and on schema changes)
Run from your machine against the **direct** (5432) connection:

```bash
DATABASE_URL="<direct 5432 connection string>" \
  pnpm --filter @organaizer/api exec prisma migrate deploy --schema prisma/schema.prisma
```

`prisma migrate deploy` applies the committed migrations in
`apps/api/prisma/migrations/` without prompting. (The Prisma datasource reads
`env("DATABASE_URL")`; overriding it inline keeps runtime pooling separate from
migrations.)

### 2.4 Create the Storage bucket
Create a **private** bucket named `analyses` (matches `SUPABASE_STORAGE_BUCKET`):

```bash
# Dashboard → Storage → New bucket → name "analyses", Public = OFF
```

The API uses the service-role key + signed URLs, so the bucket stays private; no
public-read RLS policy is required. Image paths are `${sessionId}/${analysisId}`.

---

## 3. API project (`apps/api`)

Create a Vercel project, **Root Directory = `apps/api`**, framework auto-detected
as **Nest.js**. `apps/api/vercel.json` already sets the install/build commands
(builds the `@organaizer/schema` workspace dep, runs `prisma generate`, then
builds the API) and a 60s function `maxDuration`.

> ⚠ verify on first deploy (highest-risk step): with a custom `buildCommand`,
> confirm Vercel still wraps `src/main.ts` as the Function (it should, via NestJS
> detection). If the build runs but no Function/routes are created, set the
> Framework Preset to "Nest.js" explicitly, or remove `buildCommand` and instead
> move `prisma generate` + schema build into a root `vercel-build` step.

> ⚠ Prisma query engine (most common silent runtime 500): the schema sets
> `binaryTargets = ["native", "rhel-openssl-3.0.x"]` so the Linux query engine
> binary is generated. After the first deploy, hit `/v1/sessions` (which writes to
> Postgres) — if it 500s with "@prisma/client did not initialize" / a missing
> `libquery_engine-*.node`, the engine wasn't bundled into the Function. Fix by
> ensuring `prisma generate` ran in the build (it does, via `buildCommand`) and,
> if still missing, add a `functions` `includeFiles` glob for
> `node_modules/.prisma/client/*.node` or set a custom generator `output` inside
> the app so the engine is traced.

> ⚠ Lockfile: the build uses `pnpm install --frozen-lockfile`, which fails hard if
> `pnpm-lock.yaml` is stale vs the manifests. Commit a current lockfile before
> deploying.

### 3.1 Environment variables (Production + Preview)

| Var | Value |
|-----|-------|
| `API_BASE_PATH` | `/v1` |
| `PERSISTENCE_DRIVER` | `prisma` |
| `STORAGE_DRIVER` | `supabase` |
| `VISION_DRIVER` | `gemini` |
| `DATABASE_URL` | Supabase **pooled** (6543) string with `?pgbouncer=true&connection_limit=1` |
| `GEMINI_API_KEY` | your key |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `SUPABASE_URL` | from 2.1 |
| `SUPABASE_SERVICE_ROLE_KEY` | from 2.1 (secret) |
| `SUPABASE_STORAGE_BUCKET` | `analyses` |
| `SUPABASE_SIGNED_URL_TTL` | `86400` |
| `CORS_ORIGINS` | comma-separated web + landing prod URLs (set after step 4/5) |

Notes:
- Do **not** set `PORT` — Vercel injects it; `main.ts` now binds to `PORT` and
  falls back to `API_PORT` locally.
- `API_PORT` is unnecessary on Vercel.

### 3.2 Deploy
```bash
cd apps/api && vc deploy --prod   # or connect the Git repo for auto-deploys
```
Record the resulting API origin, e.g. `https://organaizer-api.vercel.app`. The API
base URL is that origin + `/v1`.

---

## 4. Web app project (`apps/web`)

Vercel project, **Root Directory = `apps/web`**, framework **Vite**.
`apps/web/vercel.json` builds via Turbo (so `@organaizer/schema`/`types` build first).

Env (build-time, Vite inlines `VITE_*`):

| Var | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://<api-origin>/v1` (from step 3.2) |

Deploy, then record the web origin, e.g. `https://organaizer.vercel.app`.

---

## 5. Landing project (`apps/landing`)

Vercel project, **Root Directory = `apps/landing`**, framework **Astro**.

Env (build-time):

| Var | Value |
|-----|-------|
| `APP_URL` | the web app origin from step 4 (CTA target) |

Deploy, then record the landing origin.

---

## 6. Wire CORS and redeploy the API

Set the API project's `CORS_ORIGINS` to the web + landing origins:

```
CORS_ORIGINS=https://organaizer.vercel.app,https://organaizer-landing.vercel.app
```

Redeploy the API so the new env takes effect. (CORS is read at boot in `main.ts`.)

---

## 7. Verify the live deployment

```bash
API=https://<api-origin>/v1
curl -fsS $API/health           # {"status":"ok","uptime":...}
curl -fsS $API/metrics          # counters (all zero on a cold start)

# Full flow:
TOKEN=$(curl -fsS -X POST $API/sessions | jq -r .token)
curl -fsS -H "Authorization: Bearer $TOKEN" \
  -F goal=cleaner -F image=@apps/web/src/assets/hero.png $API/analyses | jq '.id, (.zones|length), .imageUrl'
# imageUrl should be a Supabase signed URL; open it to confirm the image loads.
curl -fsS $API/metrics          # analysis.successTotal / vision.requestsTotal incremented
```

Then exercise the web app on a phone: landing → CTA → upload a photo → goal →
result → follow-up. Confirm large photos upload (client downscale keeps them
< 4MB) and images render from Supabase.

---

## 8. Known caveats

- **4.5MB request-body limit** on Vercel Functions — handled by client-side
  downscaling (`apps/web/src/lib/image.ts`). HEIC that the browser can't decode
  is uploaded as-is and may be rejected by the API's 8MB / type check.
- **Cold starts**: first request after idle pays NestJS bootstrap. Fluid compute
  mitigates but does not eliminate this.
- **Connection pooling**: always use the pooled (6543) URL at runtime; the direct
  (5432) URL is only for migrations. Skipping the pooler will exhaust Postgres
  connections under serverless concurrency. PgBouncer transaction mode disables
  prepared statements (`pgbouncer=true` handles this for Prisma) and breaks
  interactive `$transaction` — the current repositories use plain CRUD, so this
  is not a concern unless you add interactive transactions later.
- **Signed URL TTL** defaults to 24h; `getUrl` re-mints on every read, so reloads
  always work, but a result page left open past the TTL won't lazy-reload images.
- **Metrics reset** on every cold start (in-memory). Fine for the demo; wire an
  external metrics sink later if needed.
- **Gemini latency**: `maxDuration` is 60s and the SPA client timeout is 45s; keep
  them consistent if you change either.

---

## 9. Deploy order summary

1. Supabase: credentials, pooled+direct URLs, `prisma migrate deploy`, create
   `analyses` bucket.
2. Deploy **API** (records origin).
3. Set web `VITE_API_BASE_URL` → deploy **web** (records origin).
4. Set landing `APP_URL` → deploy **landing** (records origin).
5. Set API `CORS_ORIGINS` to web + landing origins → redeploy **API**.
6. Verify (section 7).
