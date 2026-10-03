# DECIDE implementation status

Updated: 2026-10-01 (UTC)

## Milestones

| Milestone | State | Implemented in this handoff |
|---|---|---|
| M0 Display | In progress | Expo tab shell, friend/discovery feeds, two notification groups, profile/history/category/DNA, decision→outcome→review, two-screen compose, settings/friends/support surfaces, all 10 interactive sheet demos, and W01–W03 guest Web routes. Fixtures are visibly marked as local demo. The remaining screen/state depth and device/a11y checks below prevent calling M0 complete. |
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

## 2026-10-01 M0 interaction pass

### Screen inventory

| IDs | Local demo state | Remaining M0 work |
|---|---|---|
| S01–S02 | Implemented welcome and onboarding input/validation paths. | Real provider handoff is M1; add terms-version fixture variation. |
| S03–S04 | Implemented four-tab shell, friend/discovery switching, decision card, and explicit loading/empty/error demos. | Cursor pagination and long multi-card fixtures remain. |
| S05–S07 | Existing two-screen compose and held/success flow retained. | Photo/crop and the full settings controls need deeper integration; grapheme-aware counters need UI parity with domain validation. |
| S08–S09 | Implemented selection, confirmed projection, result, retained error selection, and supporting actions. | All owner/mutable/locked/closed projections and O07 change flow are not yet exercised from this route. |
| S10–S12 | Implemented decision, optional outcome, and 1–10 review flow with saved/postponed feedback. | Photo outcome, custom review date sheet integration, revision history, and persisted draft restoration remain. |
| S13 | Implemented separate “対応が必要” and “お知らせ” sections with action-count badge semantics. | Read/unread fixtures and cancellation transitions remain. |
| S14–S19 | Implemented own/public profiles, month/category history, detail/share projection, and staged DNA. | Profile theme editor depth and every DNA unlock tier remain. |
| S20–S28 | Implemented friends/requests/QR, profile/notification/privacy/block/account settings, and support forms. | Camera QR, individual block removal, account reauthentication, appeal variants, and complete field validation remain. |
| W01–W03 | W01 retained; implemented continuation and indistinguishable unavailable Web pages. | Browser E2E and guest claim integration are later milestones. |
| A01–A02 | Listed only in the M0 catalog and intentionally excluded from general navigation. | Staff-only interactive fixture surfaces still remain for M0; real MFA/authorization is M4. |
| O01–O10 | O02/O03/O07/O10 have confirm/cancel local-state demos. Other sheets are visibly marked incomplete. | O01/O04/O05/O06/O08/O09 implementation, O02 date validation, O03 search, and further origin-screen integration remain. |

The M0 catalog is a traceability and navigation aid, not evidence that listed-only staff screens or shallow generic controls are complete. M0 remains **in progress**.

### Commands and actual results for this pass

- `git rev-parse HEAD` — passed at start: `40a168fb0b902e88973fbb2626f245bb58c01962`.
- `node --version` — passed at start: `v24.15.0`; no Node 20 switch was needed.
- `npm ci` — passed; 614 packages installed. npm emitted the environment's `http-proxy` deprecation warning and one transitive `uuid` deprecation warning.
- `npm run typecheck` — passed for root, Expo, and Next.js projects.
- `npm run test:unit` — passed: 51/51.
- `npm run build:web` — passed; `/`, `/i/[token]`, `/continue/[flowId]`, and `/unavailable` were built.
- `npm run test:e2e` — passed: 1/1 route/source contract test. This is not a browser interaction test.
- 320/390/414 widths, light/dark mode, 200% text, screen readers, keyboard focus, native device behavior, and browser click-through — **not verified** in this non-interactive pass. Responsive/dark token support was implemented, but that is not a visual-test result.

### Next concrete M0 work

1. Replace generic sheet demos with originating-screen integrations, beginning with compose photo/crop, deadline, and friend selection while preserving drafts.
2. Add explicit fixture projections for every S08/S09 role/state without leaking result fields into author/unvoted DTOs.
3. Build staff-only A01/A02 display fixtures outside general navigation, then automate mobile route interaction and Web guest continuation tests.
4. Run and record real 320/390/414, light/dark, 200% text, VoiceOver/TalkBack, keyboard, and safe-area checks.

## 2026-10-01 PR #4 review corrections

M0 remains **in progress**. This pass corrects core demo semantics rather than expanding the claimed completion boundary.

- The center `＋` is now an action that pushes compose without becoming a selected tab. Notification Badge is derived from shared unresolved local actions rather than a fixed value.
- Decision routes now reject unknown IDs and use explicit owner/voter, open/closed, and unvoted/mutable/locked fixtures. Result percentages are calculated from fixture counts and are projected only to allowed states. Voter and owner actions are separated.
- A provider-scoped in-memory demo state now keeps final choice, optional outcome, Review and relevant settings consistent across detail/history/review routes. Choosing B remains B, `neither` is supported, and `undecided` creates no final. Final save returns to detail; outcome and Review remain optional. This state lasts only until the Expo React tree is reloaded/restarted and is not persisted or synchronized.
- O02/O03/O07/O10 use temporary sheet drafts and update shared state only on confirm; cancel leaves the committed value unchanged. O01/O04/O05/O06/O08/O09 are explicitly labelled incomplete and do not offer fake save controls.
- OAuth, report submission and account deletion are explicitly unavailable rather than fake-success operations. Friend request and support preview behaviors identify their screen-local lifetime and do not claim network effects.
- Mobile primitives now import the canonical design tokens. The demo banner uses the active surface/ink palette in dark mode.

### Regression checks for this correction

- `npm run typecheck` — passed for root, Expo and Next.js.
- `npm run test:unit` — passed: 57/57, including B→Review state consistency, undecided-without-final, voter/owner fixtures, fixture-derived results, sheet cancel semantics, and one-time Review postponement.
- `npm run build:web` — passed for all Web routes.
- `git diff --check` — passed.
- Actual native/browser interaction, 320/390/414 widths, light/dark visual inspection, 200% text, screen reader, keyboard and safe-area behavior remain unverified in this non-interactive environment.

### Remaining M0 work after review correction

1. Complete O01/O04/O05/O06/O08/O09 and add date validation/search depth to O02/O03.
2. Add automated rendered-navigation tests for role/state projections and sheet confirm/cancel behavior; current regression tests cover the pure shared-state transitions.
3. Complete A01/A02 staff-only display fixtures and the remaining per-screen loading/error/unavailable variants.
4. Perform and record the real-device and browser visual/accessibility matrix above.

## 2026-10-01 PR #4 second review corrections

M0 remains **in progress**. No real authentication, ballot, report, persistence, or server clock is represented by these deterministic fixtures.

- Interactive demo ballots now have `firstAt`, `mutableUntil`, change count and lock time. A first vote remains result-hidden for five minutes; one actual change or same-choice immediate confirmation locks it; reaching the deterministic five-minute boundary also projects it as locked.
- `projectDecision` is the shared near-UI projection for role, phase, ballot state, available actions and result visibility. Open owners, unvoted voters and mutable voters receive no result projection.
- O02 now offers only 1 hour / 3 hours / 1 day / 1 week / custom time in this requested demo scope. Custom vote deadlines and O10 custom postponements require a parseable time after deterministic `DEMO_NOW`; cancel still leaves the committed value unchanged.
- History detail uses separate fixtures for desk/trip records, rejects unknown IDs, and stores share scope per history ID in provider memory.
- Final/outcome/Review data is keyed by decision ID. Direct owner subroutes require a closed owner fixture; voter and open-owner IDs are rejected. Final result copy is calculated from the fixture counts, and the unsupported fixed “24 hours” wording was removed from undecided.

### Checks for the second correction

- `npm run typecheck` — passed for root, Expo and Next.js.
- `npm run test:unit` — passed: 60/60. New projection-linked tests cover five-minute hiding/boundary locking, one actual change, same-choice immediate confirmation, owner/unvoted non-disclosure, direct-route authorization, decision-ID isolation, distinct history fixtures, custom deadline validation and cancel semantics.
- `npm run build:web` — passed for all Web routes.
- `git diff --check` — passed.
- Rendered navigation tests and real native/browser inspection remain unavailable in this pass; pure projection tests do not prove Expo rendering, navigation focus, accessibility or production authorization.

### Remaining M0 work

1. Add rendered Expo route tests around projection/action wiring; the on-screen per-decision clock control is implemented but has not been exercised in a native renderer here.
2. Complete the previously listed unfinished sheets and staff fixtures.
3. Run the 320/390/414, light/dark, 200% text, screen-reader, keyboard and safe-area matrix on actual targets.

## 2026-10-02 PR #4 third review corrections

M0 remains **in progress**.

- Each decision now has an independent demo-clock offset. After casting on `/decision/demo-coat`, the visible “この相談のデモ時刻を5分進める” action advances only that decision, recomputes the projection, locks at the exact boundary and reveals fixture-derived results. Deterministic time injection remains available to unit tests.
- Closing is derived from either fixture phase or `endsAt`. A closed unvoted voter still receives no result; a voter with a ballot is locked at the deadline and may receive the result. Open-owner result withholding remains unchanged.
- O07 now validates its `decisionId`, requested choice, role, phase, deadline, mutable window and current choice through the same projection used by the detail screen. Invalid/direct/expired requests show an unavailable explanation and a disabled action instead of a false confirmation.
- O02/O10 custom timestamps remain editable, future-validated, and return through the supplied origin route parameters. Provider state retains confirmed values; cancel retains only the previous committed value.

### Reproducible local interaction checklist (not executed in a native renderer here)

1. Open `/decision/demo-coat`, choose A and submit. Confirm no result is shown and the five-minute explanation/control appears. Tap the clock control; confirm the result appears and the vote controls disappear.
2. Open `/decision/demo-coat-mutable`, choose B, confirm O07, then reopen/direct-link O07. Confirm the second request is unavailable. Direct-link O07 with `demo-owner-open` must also be unavailable.
3. Open `/decision/demo-owner-closed/decide`, choose B, save, then open Review and history. Confirm B is shown in both. Voter/open-owner IDs must be rejected by owner-only routes.
4. Save `friends` on `/history/demo-desk/share`, leave and reopen; confirm the committed value remains `friends` while `/history/demo-trip/share` remains independently `self`.
5. From compose confirmation, choose O02 custom time, enter a future value, confirm, and verify the question/A/B/context and deadline remain on the confirmation screen. A past/invalid timestamp keeps confirm disabled.

### Checks for the third correction

- `npm run typecheck` — passed.
- `npm run test:unit` — passed: 64/64. Added coverage for independent clock advancement, exact rendered-projection transition, deadline locking, closed-unvoted non-disclosure, O07 guards and share-scope remount reads.
- `npm run build:web` — passed.
- `git diff --check` — passed.
- The checklist above is reproducible but was not executed in an Expo native renderer in this environment. Real device/browser sizes, dark/light visual inspection, 200% text, screen readers, keyboard and safe areas remain unverified.

### Remaining M0 work

1. Automate the interaction checklist with a rendered Expo navigation harness.
2. Complete O01/O04/O05/O06/O08/O09 and staff A01/A02 fixtures.
3. Perform and record the device/browser accessibility and responsive matrix.
