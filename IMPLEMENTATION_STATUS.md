# DECIDE implementation status

Updated: 2026-09-30 (UTC)

## Milestones

| Milestone | State | Implemented in this handoff |
|---|---|---|
| M0 Display | In progress | npm monorepo, shared tokens/domain DTO, Expo Router shell, two-screen compose flow, decision demo, and small Next.js guest/unavailable flow. Fixtures are visibly marked as local demo. The full 33-screen/10-sheet interaction matrix and device/a11y checks remain. |
| M1 Auth/authorization | Started | Private-schema contract retained, server flags default off, environment boundary documented. Supabase migrations/RPC/BFF session and real denial tests remain. |
| M2 Consultation/voting | Started | Pure reference policies and unit tests retained; client consumes a projected DTO. Transactional RPC, media, moderation adapter, invite exchange and claim integration remain. |
| M3 Records | Reference only | Pure final/review/history/DNA policies exist; persistence/API/UI integration remains. |
| M4 Operations | Contract only | Schema tables and specification exist; workers, staff UI, delivery recheck and deletion processing remain. |
| M5 R1 integration | Not started | Requires preceding milestones, real local Supabase integration, E2E, load, device and external-provider checks. |

This is an implementation start, not a completed or deployed application.

## Commands and actual results

- `git status --short --branch` — passed before editing; branch `work` was clean.
- `npm view expo version` — failed with registry HTTP 403 in this environment. Versions were therefore pinned from the handoff compatibility table rather than represented as freshly registry-verified.
- `node --experimental-strip-types --test tests/*.test.mjs` — passed: 51/51.
- `npm install --package-lock-only --ignore-scripts` — failed: registry returned HTTP 403; no lockfile could be generated. `--offline` also failed because TypeScript metadata was not cached.
- `npx --no-install tsc -p tsconfig.json` — passed for dependency-free shared domain/config sources. App typechecks remain blocked on dependency installation.
- `npm run test:db` — pending; requires Supabase CLI and a Docker-compatible runtime.
- Mobile device, OAuth, Push, production RLS, staff MFA, backup restore, load and live AI tests — not run.

## External setup waiting

Supabase project values, Apple/Google OAuth values, public web/API domains, Expo/EAS and APNs/FCM configuration, AI moderation provider, and the operational/legal values listed in `docs/14-setup-release.md` are not supplied. Demo mode must be disabled and the server must fail closed before any non-local release.

## 2026-10-01 Setup repair
Dependency resolution, app TypeScript configuration, and Web build repaired; see docs/17-container-diagnosis.md for evidence and remaining Cloud uncertainty. This does not advance functional milestones or claim Cloud container recovery.
