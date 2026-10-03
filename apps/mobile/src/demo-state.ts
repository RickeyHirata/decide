export type FinalChoice = 'A' | 'B' | 'neither';
export type BallotChoice = 'A' | 'B';
export type ShareScope = 'self' | 'friends' | 'public';

export const DEMO_NOW = '2026-10-01T09:00:00.000Z';
export const FIVE_MINUTES = 5 * 60 * 1000;

export type DemoReview = {
  score: number | null;
  memo: string;
  status: 'none' | 'saved' | 'postponed' | 'skipped';
  postponedUntil: string | null;
};

export type DecisionRecord = {
  finalChoice: FinalChoice | null;
  finalPending: boolean;
  outcome: string;
  review: DemoReview;
  shareScope: ShareScope;
};

export type DemoBallot = {
  choice: BallotChoice;
  firstAt: string;
  mutableUntil: string;
  changes: number;
  lockedAt: string | null;
};

export type DemoState = {
  decisions: Record<string, DecisionRecord>;
  ballots: Record<string, DemoBallot>;
  clockOffsetsMs: Record<string, number>;
  notes: Record<string, string>;
  addenda: Record<string, string[]>;
  categories: Record<string, string>;
  postStates: Record<string, 'open' | 'closed' | 'deleted'>;
  photoDrafts: Record<'A' | 'B', { selected: boolean; cropX: number; cropY: number }>;
  moderationCases: Record<string, { status: 'held' | 'reported' | 'appealed' | 'allowed' | 'removed'; note: string }>;
  unresolvedActions: number;
  settings: {
    voteDeadline: string;
    customVoteDeadline: string;
    friendIds: string[];
    reviewPostpone: '7d' | 'custom';
    customReviewAt: string;
  };
};

export type DemoAction =
  | { type: 'save-final'; decisionId: string; choice: FinalChoice }
  | { type: 'hold-final'; decisionId: string }
  | { type: 'save-outcome'; decisionId: string; text: string }
  | { type: 'save-review'; decisionId: string; score: number; memo: string }
  | { type: 'postpone-review'; decisionId: string; mode: '7d' | 'custom'; customAt?: string }
  | { type: 'skip-review'; decisionId: string }
  | { type: 'cast-vote'; decisionId: string; choice: BallotChoice; now: string }
  | { type: 'change-vote'; decisionId: string; choice: BallotChoice; now: string }
  | { type: 'lock-vote'; decisionId: string; now: string }
  | { type: 'advance-clock'; decisionId: string; milliseconds: number }
  | { type: 'set-deadline'; value: string; customAt?: string }
  | { type: 'set-friends'; ids: string[] }
  | { type: 'set-share'; decisionId: string; scope: ShareScope }
  | { type: 'save-note'; decisionId: string; text: string }
  | { type: 'append-addendum'; decisionId: string; text: string }
  | { type: 'set-category'; decisionId: string; category: string }
  | { type: 'set-post-state'; decisionId: string; state: 'closed' | 'deleted' }
  | { type: 'set-photo-draft'; option: 'A' | 'B'; selected: boolean; cropX: number; cropY: number }
  | { type: 'moderate-case'; caseId: string; status: 'allowed' | 'held' | 'removed'; note: string };

export const emptyDecisionRecord = (): DecisionRecord => ({
  finalChoice: null,
  finalPending: false,
  outcome: '',
  review: { score: null, memo: '', status: 'none', postponedUntil: null },
  shareScope: 'self',
});

export const initialDemoState: DemoState = {
  decisions: { 'demo-owner-closed': emptyDecisionRecord() },
  ballots: {
    'demo-coat-mutable': { choice: 'A', firstAt: '2026-10-01T08:58:00.000Z', mutableUntil: '2026-10-01T09:03:00.000Z', changes: 0, lockedAt: null },
    'demo-coat-locked': { choice: 'B', firstAt: '2026-10-01T08:50:00.000Z', mutableUntil: '2026-10-01T08:55:00.000Z', changes: 0, lockedAt: '2026-10-01T08:55:00.000Z' },
  },
  clockOffsetsMs: {},
  notes: {},
  addenda: {},
  categories: { 'demo-owner-open': 'ファッション', 'demo-owner-closed': 'ファッション' },
  postStates: {},
  photoDrafts: { A: { selected: false, cropX: 0.5, cropY: 0.5 }, B: { selected: false, cropX: 0.5, cropY: 0.5 } },
  moderationCases: {
    'demo-held': { status: 'held', note: '' },
    'demo-reported': { status: 'reported', note: '' },
    'demo-appealed': { status: 'appealed', note: '' },
  },
  unresolvedActions: 1,
  settings: {
    voteDeadline: '3時間',
    customVoteDeadline: '2026-10-02T09:00',
    friendIds: ['mina-demo'],
    reviewPostpone: '7d',
    customReviewAt: '2026-10-08T09:00',
  },
};

function updateDecision(state: DemoState, decisionId: string, update: (record: DecisionRecord) => DecisionRecord): DemoState {
  const current = state.decisions[decisionId] ?? emptyDecisionRecord();
  return { ...state, decisions: { ...state.decisions, [decisionId]: update(current) } };
}

export function isFutureIso(value: string, now = DEMO_NOW) {
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > Date.parse(now);
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'save-final': {
      const updated = updateDecision(state, action.decisionId, (record) => ({ ...record, finalChoice: action.choice, finalPending: false, review: { score: null, memo: '', status: 'none', postponedUntil: null } }));
      return { ...updated, unresolvedActions: 1 };
    }
    case 'hold-final': {
      const updated = updateDecision(state, action.decisionId, (record) => ({ ...record, finalChoice: null, finalPending: true }));
      return { ...updated, unresolvedActions: 0 };
    }
    case 'save-outcome':
      return updateDecision(state, action.decisionId, (record) => ({ ...record, outcome: action.text }));
    case 'save-review': {
      const current = state.decisions[action.decisionId];
      if (!current?.finalChoice) return state;
      const updated = updateDecision(state, action.decisionId, (record) => ({ ...record, review: { score: action.score, memo: action.memo, status: 'saved', postponedUntil: null } }));
      return { ...updated, unresolvedActions: 0 };
    }
    case 'postpone-review': {
      const current = state.decisions[action.decisionId];
      if (!current?.finalChoice || current.review.status === 'postponed') return state;
      if (action.mode === 'custom' && (!action.customAt || !isFutureIso(action.customAt))) return state;
      const postponedUntil = action.mode === '7d' ? '2026-10-08T09:00:00.000Z' : action.customAt!;
      const updated = updateDecision(state, action.decisionId, (record) => ({ ...record, review: { ...record.review, status: 'postponed', postponedUntil } }));
      return { ...updated, unresolvedActions: 0, settings: { ...updated.settings, reviewPostpone: action.mode, customReviewAt: action.customAt ?? updated.settings.customReviewAt } };
    }
    case 'skip-review': {
      const current = state.decisions[action.decisionId];
      if (!current?.finalChoice) return state;
      const updated = updateDecision(state, action.decisionId, (record) => ({ ...record, review: { ...record.review, status: 'skipped', postponedUntil: null } }));
      return { ...updated, unresolvedActions: 0 };
    }
    case 'cast-vote': {
      if (state.ballots[action.decisionId]) return state;
      const mutableUntil = new Date(Date.parse(action.now) + FIVE_MINUTES).toISOString();
      return { ...state, ballots: { ...state.ballots, [action.decisionId]: { choice: action.choice, firstAt: action.now, mutableUntil, changes: 0, lockedAt: null } } };
    }
    case 'change-vote': {
      const ballot = state.ballots[action.decisionId];
      if (!ballot || ballot.lockedAt || ballot.changes > 0 || Date.parse(action.now) >= Date.parse(ballot.mutableUntil)) return state;
      if (ballot.choice === action.choice) return { ...state, ballots: { ...state.ballots, [action.decisionId]: { ...ballot, lockedAt: action.now } } };
      return { ...state, ballots: { ...state.ballots, [action.decisionId]: { ...ballot, choice: action.choice, changes: 1, lockedAt: action.now } } };
    }
    case 'lock-vote': {
      const ballot = state.ballots[action.decisionId];
      if (!ballot || ballot.lockedAt) return state;
      return { ...state, ballots: { ...state.ballots, [action.decisionId]: { ...ballot, lockedAt: action.now } } };
    }
    case 'advance-clock':
      return { ...state, clockOffsetsMs: { ...state.clockOffsetsMs, [action.decisionId]: (state.clockOffsetsMs[action.decisionId] ?? 0) + Math.max(0, action.milliseconds) } };
    case 'set-deadline':
      if (action.value === '日時指定' && (!action.customAt || !isFutureIso(action.customAt))) return state;
      return { ...state, settings: { ...state.settings, voteDeadline: action.value, customVoteDeadline: action.customAt ?? state.settings.customVoteDeadline } };
    case 'set-friends':
      return action.ids.length ? { ...state, settings: { ...state.settings, friendIds: action.ids } } : state;
    case 'set-share':
      return updateDecision(state, action.decisionId, (record) => ({ ...record, shareScope: action.scope }));
    case 'save-note':
      return action.text.length <= 80 ? { ...state, notes: { ...state.notes, [action.decisionId]: action.text } } : state;
    case 'append-addendum':
      return action.text.trim() && action.text.length <= 300 ? { ...state, addenda: { ...state.addenda, [action.decisionId]: [...(state.addenda[action.decisionId] ?? []), action.text] } } : state;
    case 'set-category':
      return { ...state, categories: { ...state.categories, [action.decisionId]: action.category } };
    case 'set-post-state':
      return { ...state, postStates: { ...state.postStates, [action.decisionId]: action.state } };
    case 'set-photo-draft':
      return { ...state, photoDrafts: { ...state.photoDrafts, [action.option]: { selected: action.selected, cropX: action.cropX, cropY: action.cropY } } };
    case 'moderate-case': {
      const item = state.moderationCases[action.caseId];
      if (!item) return state;
      return { ...state, moderationCases: { ...state.moderationCases, [action.caseId]: { status: action.status, note: action.note } } };
    }
  }
}

export type DecisionFixture = {
  id: string;
  role: 'owner' | 'voter';
  phase: 'open' | 'closed';
  endsAt: string;
  initialBallot?: DemoBallot;
  votes?: { A: number; B: number };
};

const mutableAt = '2026-10-01T08:58:00.000Z';
export const decisionFixtures: Record<string, DecisionFixture> = {
  'demo-coat': { id: 'demo-coat', role: 'voter', phase: 'open', endsAt: '2026-10-01T12:00:00.000Z', votes: { A: 6, B: 4 } },
  'demo-coat-mutable': { id: 'demo-coat-mutable', role: 'voter', phase: 'open', endsAt: '2026-10-01T12:00:00.000Z', initialBallot: { choice: 'A', firstAt: mutableAt, mutableUntil: '2026-10-01T09:03:00.000Z', changes: 0, lockedAt: null }, votes: { A: 6, B: 4 } },
  'demo-coat-locked': { id: 'demo-coat-locked', role: 'voter', phase: 'open', endsAt: '2026-10-01T12:00:00.000Z', initialBallot: { choice: 'B', firstAt: '2026-10-01T08:50:00.000Z', mutableUntil: '2026-10-01T08:55:00.000Z', changes: 0, lockedAt: '2026-10-01T08:55:00.000Z' }, votes: { A: 6, B: 4 } },
  'demo-coat-closed-unvoted': { id: 'demo-coat-closed-unvoted', role: 'voter', phase: 'closed', endsAt: '2026-10-01T08:59:00.000Z', votes: { A: 6, B: 4 } },
  'demo-owner-open': { id: 'demo-owner-open', role: 'owner', phase: 'open', endsAt: '2026-10-01T12:00:00.000Z' },
  'demo-owner-closed': { id: 'demo-owner-closed', role: 'owner', phase: 'closed', endsAt: '2026-10-01T08:59:00.000Z', votes: { A: 5, B: 5 } },
};

export type DecisionProjection = {
  allowed: boolean;
  canVote: boolean;
  canChange: boolean;
  canDecide: boolean;
  ballot: DemoBallot | null;
  result: ReturnType<typeof resultPercent> | null;
};

export function projectDecision(fixture: DecisionFixture | undefined, state: DemoState, now = DEMO_NOW): DecisionProjection {
  if (!fixture) return { allowed: false, canVote: false, canChange: false, canDecide: false, ballot: null, result: null };
  const ballot = state.ballots[fixture.id] ?? fixture.initialBallot ?? null;
  const closed = fixture.phase === 'closed' || Date.parse(now) >= Date.parse(fixture.endsAt);
  const timeLocked = ballot ? Date.parse(now) >= Date.parse(ballot.mutableUntil) : false;
  const locked = Boolean(ballot && (ballot.lockedAt || timeLocked || closed));
  const canVote = fixture.role === 'voter' && !closed && !ballot;
  const canChange = fixture.role === 'voter' && !closed && Boolean(ballot) && !locked && ballot!.changes === 0;
  const canSeeResult = (fixture.role === 'owner' && closed) || (fixture.role === 'voter' && Boolean(ballot) && locked);
  return { allowed: true, canVote, canChange, canDecide: fixture.role === 'owner' && closed, ballot, result: canSeeResult && fixture.votes ? resultPercent(fixture.votes) : null };
}

export function demoNowForDecision(state: DemoState, decisionId: string) {
  return new Date(Date.parse(DEMO_NOW) + (state.clockOffsetsMs[decisionId] ?? 0)).toISOString();
}

export function canConfirmVoteChange(fixture: DecisionFixture | undefined, state: DemoState, now: string, choice: string | undefined) {
  const projection = projectDecision(fixture, state, now);
  return Boolean(choice && (choice === 'A' || choice === 'B') && projection.canChange && projection.ballot && projection.ballot.choice !== choice);
}

export function canAccessOwnerRecord(fixture: DecisionFixture | undefined) {
  return fixture?.role === 'owner' && fixture.phase === 'closed';
}

export type HistoryFixture = { id: string; date: string; category: string; question: string; decision: FinalChoice };
export const historyFixtures: Record<string, HistoryFixture> = {
  'demo-desk': { id: 'demo-desk', date: '2026年9月14日', category: '買い物', question: '作業机はどちらにする？', decision: 'B' },
  'demo-trip': { id: 'demo-trip', date: '2026年8月20日', category: '旅行', question: '休みは海と山どちらへ行く？', decision: 'A' },
};

export function resultPercent(votes: { A: number; B: number }) {
  const total = votes.A + votes.B;
  if (!total) return null;
  const A = Math.round((votes.A / total) * 100);
  return { A, B: 100 - A, total };
}
