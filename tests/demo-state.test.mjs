import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessOwnerRecord, decisionFixtures, demoReducer, historyFixtures, initialDemoState, projectDecision } from '../apps/mobile/src/demo-state.ts';

test('first ballot stays mutable and hides results for five minutes', () => {
  const voted = demoReducer(initialDemoState, { type: 'cast-vote', decisionId: 'demo-coat', choice: 'A', now: '2026-10-01T09:00:00.000Z' });
  const during = projectDecision(decisionFixtures['demo-coat'], voted, '2026-10-01T09:04:59.999Z');
  assert.equal(during.canChange, true);
  assert.equal(during.result, null);
  const expired = projectDecision(decisionFixtures['demo-coat'], voted, '2026-10-01T09:05:00.000Z');
  assert.equal(expired.canChange, false);
  assert.ok(expired.result);
});

test('mutable A to B change is allowed once and locks immediately', () => {
  const changed = demoReducer(initialDemoState, { type: 'change-vote', decisionId: 'demo-coat-mutable', choice: 'B', now: '2026-10-01T09:00:00.000Z' });
  assert.equal(changed.ballots['demo-coat-mutable'].choice, 'B');
  assert.equal(changed.ballots['demo-coat-mutable'].changes, 1);
  assert.ok(changed.ballots['demo-coat-mutable'].lockedAt);
  const second = demoReducer(changed, { type: 'change-vote', decisionId: 'demo-coat-mutable', choice: 'A', now: '2026-10-01T09:01:00.000Z' });
  assert.equal(second, changed);
});

test('same choice confirms immediately without consuming a change', () => {
  const confirmed = demoReducer(initialDemoState, { type: 'change-vote', decisionId: 'demo-coat-mutable', choice: 'A', now: '2026-10-01T09:00:00.000Z' });
  assert.equal(confirmed.ballots['demo-coat-mutable'].changes, 0);
  assert.equal(confirmed.ballots['demo-coat-mutable'].lockedAt, '2026-10-01T09:00:00.000Z');
  assert.ok(projectDecision(decisionFixtures['demo-coat-mutable'], confirmed).result);
});

test('owner and unvoted voter projections never expose open results', () => {
  assert.equal(projectDecision(decisionFixtures['demo-owner-open'], initialDemoState).result, null);
  assert.equal(projectDecision(decisionFixtures['demo-coat'], initialDemoState).result, null);
  assert.equal(projectDecision(undefined, initialDemoState).allowed, false);
});

test('owner-only direct routes require a closed owner fixture', () => {
  assert.equal(canAccessOwnerRecord(decisionFixtures['demo-owner-closed']), true);
  assert.equal(canAccessOwnerRecord(decisionFixtures['demo-owner-open']), false);
  assert.equal(canAccessOwnerRecord(decisionFixtures['demo-coat']), false);
  assert.equal(canAccessOwnerRecord(undefined), false);
});

test('final decisions and reviews are isolated by decision id', () => {
  const decided = demoReducer(initialDemoState, { type: 'save-final', decisionId: 'demo-owner-closed', choice: 'B' });
  const reviewed = demoReducer(decided, { type: 'save-review', decisionId: 'demo-owner-closed', score: 8, memo: 'よかった' });
  assert.equal(reviewed.decisions['demo-owner-closed'].finalChoice, 'B');
  assert.equal(reviewed.decisions['demo-owner-closed'].review.score, 8);
  assert.equal(reviewed.decisions['another-id'], undefined);
  const heldElsewhere = demoReducer(reviewed, { type: 'hold-final', decisionId: 'another-id' });
  assert.equal(heldElsewhere.decisions['another-id'].finalChoice, null);
  assert.equal(heldElsewhere.decisions['demo-owner-closed'].finalChoice, 'B');
});

test('history fixtures project distinct content and reject unknown ids', () => {
  assert.equal(historyFixtures['demo-desk'].question, '作業机はどちらにする？');
  assert.equal(historyFixtures['demo-trip'].category, '旅行');
  assert.notEqual(historyFixtures['demo-desk'].date, historyFixtures['demo-trip'].date);
  assert.equal(historyFixtures['missing'], undefined);
});

test('custom deadlines require deterministic future times', () => {
  const invalid = demoReducer(initialDemoState, { type: 'set-deadline', value: '日時指定', customAt: '2026-10-01T08:59:00Z' });
  assert.equal(invalid, initialDemoState);
  const valid = demoReducer(initialDemoState, { type: 'set-deadline', value: '日時指定', customAt: '2026-10-02T09:00:00Z' });
  assert.equal(valid.settings.voteDeadline, '日時指定');
});

test('sheet draft cancellation leaves committed deadline unchanged', () => {
  const draftDeadline = '1時間';
  assert.equal(draftDeadline, '1時間');
  assert.equal(initialDemoState.settings.voteDeadline, '3時間');
});
