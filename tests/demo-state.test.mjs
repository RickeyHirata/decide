import test from 'node:test';
import assert from 'node:assert/strict';
import { canAccessOwnerRecord, canConfirmVoteChange, decisionFixtures, demoNowForDecision, demoReducer, historyFixtures, initialDemoState, projectDecision } from '../apps/mobile/src/demo-state.ts';

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
  assert.equal(projectDecision(decisionFixtures['demo-coat-closed-unvoted'], initialDemoState).result, null);
});

test('per-decision demo clock advances rendering projection without affecting another decision', () => {
  const voted = demoReducer(initialDemoState, { type: 'cast-vote', decisionId: 'demo-coat', choice: 'A', now: demoNowForDecision(initialDemoState, 'demo-coat') });
  const advanced = demoReducer(voted, { type: 'advance-clock', decisionId: 'demo-coat', milliseconds: 5 * 60 * 1000 });
  assert.equal(demoNowForDecision(advanced, 'demo-coat'), '2026-10-01T09:05:00.000Z');
  assert.equal(demoNowForDecision(advanced, 'demo-coat-mutable'), '2026-10-01T09:00:00.000Z');
  assert.equal(projectDecision(decisionFixtures['demo-coat'], advanced, demoNowForDecision(advanced, 'demo-coat')).canChange, false);
  assert.ok(projectDecision(decisionFixtures['demo-coat'], advanced, demoNowForDecision(advanced, 'demo-coat')).result);
});

test('poll deadline locks an existing ballot and does not reveal to an unvoted voter', () => {
  const voted = demoReducer(initialDemoState, { type: 'cast-vote', decisionId: 'demo-coat', choice: 'B', now: '2026-10-01T09:00:00.000Z' });
  const afterDeadline = projectDecision(decisionFixtures['demo-coat'], voted, '2026-10-01T12:00:00.000Z');
  assert.equal(afterDeadline.canChange, false);
  assert.ok(afterDeadline.result);
  assert.equal(projectDecision(decisionFixtures['demo-coat-closed-unvoted'], initialDemoState, '2026-10-01T12:00:00.000Z').result, null);
});

test('O07 guard rejects direct, owner, expired, and same-choice requests', () => {
  assert.equal(canConfirmVoteChange(undefined, initialDemoState, '2026-10-01T09:00:00.000Z', 'B'), false);
  assert.equal(canConfirmVoteChange(decisionFixtures['demo-owner-open'], initialDemoState, '2026-10-01T09:00:00.000Z', 'B'), false);
  assert.equal(canConfirmVoteChange(decisionFixtures['demo-coat-mutable'], initialDemoState, '2026-10-01T09:03:00.000Z', 'B'), false);
  assert.equal(canConfirmVoteChange(decisionFixtures['demo-coat-mutable'], initialDemoState, '2026-10-01T09:00:00.000Z', 'A'), false);
  assert.equal(canConfirmVoteChange(decisionFixtures['demo-coat-mutable'], initialDemoState, '2026-10-01T09:00:00.000Z', 'B'), true);
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

test('history share scope is stored per id and survives screen remount state reads', () => {
  const desk = demoReducer(initialDemoState, { type: 'set-share', decisionId: 'demo-desk', scope: 'friends' });
  const trip = demoReducer(desk, { type: 'set-share', decisionId: 'demo-trip', scope: 'public' });
  assert.equal(trip.decisions['demo-desk'].shareScope, 'friends');
  assert.equal(trip.decisions['demo-trip'].shareScope, 'public');
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

test('remaining sheet actions commit only their scoped local records', () => {
  const photo = demoReducer(initialDemoState, { type: 'set-photo-draft', option: 'A', selected: true, cropX: 0.25, cropY: 0.25 });
  const note = demoReducer(photo, { type: 'save-note', decisionId: 'demo-coat-locked', text: 'Bがよさそう' });
  const addendum = demoReducer(note, { type: 'append-addendum', decisionId: 'demo-owner-open', text: '雨の場合も考えたい' });
  const category = demoReducer(addendum, { type: 'set-category', decisionId: 'demo-owner-open', category: '旅行' });
  const closed = demoReducer(category, { type: 'set-post-state', decisionId: 'demo-owner-open', state: 'closed' });
  assert.deepEqual(closed.photoDrafts.A, { selected: true, cropX: 0.25, cropY: 0.25 });
  assert.equal(closed.notes['demo-coat-locked'], 'Bがよさそう');
  assert.deepEqual(closed.addenda['demo-owner-open'], ['雨の場合も考えたい']);
  assert.equal(closed.categories['demo-owner-open'], '旅行');
  assert.equal(closed.postStates['demo-owner-open'], 'closed');
  assert.equal(initialDemoState.notes['demo-coat-locked'], undefined);
});

test('staff fixture decisions update known cases and reject unknown cases', () => {
  const decided = demoReducer(initialDemoState, { type: 'moderate-case', caseId: 'demo-held', status: 'allowed', note: 'fixture確認済み' });
  assert.deepEqual(decided.moderationCases['demo-held'], { status: 'allowed', note: 'fixture確認済み' });
  const unknown = demoReducer(decided, { type: 'moderate-case', caseId: 'missing', status: 'removed', note: 'no' });
  assert.equal(unknown, decided);
});
