# DECIDE implementation rules

This is an implementation handoff, not a deployed app. Read README.md, docs/01-product-contract.md, docs/15-decisions-and-traceability.md and the milestone in docs/13-implementation-plan.md before editing implementation code.

- Preserve the user's repository, credentials and existing unrelated work. If copying this handoff into an existing repository, keep its existing AGENTS.md instructions; do not overwrite them with this file.
- Implement mobile with React Native, Expo and Expo Router; implement the small guest/share Web surface with Next.js. Use TypeScript. Supabase owns Auth, PostgreSQL, Storage and domain transactions. See docs/06-architecture.md.
- v1.5 text/contracts override historical screenshot behavior. Retain the v1.2 white/black, lime/lilac A/B visual language. No unrelated redesign, new navigation tab, ordinary comments, DM, video or payment feature.
- Compose has TWO screens. First vote freezes source content. A confirmed non-author voter may see aggregate results while voting is open. The author cannot. A/B voter identities only follow the role matrix after closing. Never use CSS to hide secret data.
- Treat auth, row visibility, field projection and server time as separate requirements. Never send author_id for anonymous posts, raw ballots, private notes or invite secrets to unauthorized clients, analytics, realtime or OGP.
- All mutations use verified principals, input validation, server-side authorization, idempotency and database transactions. Never trust a client-supplied actor_id. Lock the post before ballot and final-decision transitions.
- Guest is a server-verified anonymous Auth principal, not an arbitrary browser UUID. Registered account and guest merge must not increase valid vote count, reset change limits or reveal an old guest's identity.
- Maintain feature flags on the server. R1 is the initial private beta. R2 public growth and R3 opinion Poll experiments are separate release gates; see docs/01-product-contract.md.
- Use deterministic fixtures only in local/demo/test mode, visibly marked as such. Do not fabricate users, votes, AI approvals, completed tests or remote setup. Missing live AI keeps moderation held; category may fall back to Other.
- Reuse design/tokens.ts and contracts. Keep adapters thin; no full universal UI framework. Do not depend on screenshots as the only behavior specification.
- Test meaningful risks: privacy projections, deadlines, racing votes/edits, guest merge, revocation, revisions and notification cancellation. A passing mock test does not prove production RLS or OAuth.
- Work milestone by milestone, keep IMPLEMENTATION_STATUS.md with commands/results and unresolved external setup. Continue authorized local work. Ask only for an indispensable external value or an irreversible external action at the point it is needed.
- Never deploy, purchase services, send invitations or publish app-store content solely because this handoff exists. No external credentials are embedded in this package.
- Report what changed, the actual checks run, and remaining integration work. Do not describe the complete app as finished after only the visual milestone.
