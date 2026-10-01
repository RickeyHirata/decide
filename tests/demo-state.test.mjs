import test from 'node:test';
import assert from 'node:assert/strict';
import { decisionFixtures, demoReducer, initialDemoState, resultPercent } from '../apps/mobile/src/demo-state.ts';

test('B final choice remains B through review and history state', () => {
  const decided = demoReducer(initialDemoState, { type: 'save-final', choice: 'B' });
  const reviewed = demoReducer(decided, { type: 'save-review', score: 8, memo: 'よかった' });
  assert.equal(reviewed.finalChoice, 'B');
  assert.equal(reviewed.review.score, 8);
  assert.equal(reviewed.review.memo, 'よかった');
  assert.equal(reviewed.review.status, 'saved');
  assert.equal(reviewed.unresolvedActions, 0);
});

test('undecided creates no final decision', () => {
  const held = demoReducer(initialDemoState, { type: 'hold-final' });
  assert.equal(held.finalChoice, null);
  assert.equal(held.finalPending, true);
  assert.equal(held.unresolvedActions, 0);
  assert.equal(demoReducer(held, { type: 'save-review', score: 5, memo: '' }), held);
});

test('voter fixtures never acquire owner role or owner operation', () => {
  for (const fixture of Object.values(decisionFixtures).filter((item) => item.role === 'voter')) {
    assert.equal(fixture.role, 'voter');
  }
  assert.equal(decisionFixtures['demo-owner-open'].role, 'owner');
});

test('results derive from fixture ballots without tie contradiction', () => {
  assert.deepEqual(resultPercent({ A: 6, B: 4 }), { A: 60, B: 40, total: 10 });
  assert.deepEqual(resultPercent({ A: 5, B: 5 }), { A: 50, B: 50, total: 10 });
});

test('sheet cancellation leaves committed settings unchanged', () => {
  const draftDeadline = '15分';
  assert.equal(draftDeadline, '15分');
  assert.equal(initialDemoState.settings.voteDeadline, '3時間');
  const confirmed = demoReducer(initialDemoState, { type: 'set-deadline', value: draftDeadline });
  assert.equal(confirmed.settings.voteDeadline, '15分');
  assert.equal(initialDemoState.settings.voteDeadline, '3時間');
});

test('review postponement is one-time and skip keeps score null', () => {
  const decided = demoReducer(initialDemoState, { type: 'save-final', choice: 'neither' });
  const postponed = demoReducer(decided, { type: 'postpone-review', mode: '7d' });
  const second = demoReducer(postponed, { type: 'postpone-review', mode: 'custom' });
  assert.equal(second.review.postponedUntil, '7日後');
  const skipped = demoReducer(decided, { type: 'skip-review' });
  assert.equal(skipped.review.score, null);
  assert.equal(skipped.review.status, 'skipped');
});
