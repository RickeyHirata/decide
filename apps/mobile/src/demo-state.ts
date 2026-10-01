export type FinalChoice = 'A' | 'B' | 'neither';

export type DemoReview = {
  score: number | null;
  memo: string;
  status: 'none' | 'saved' | 'postponed' | 'skipped';
  postponedUntil: string | null;
};

export type DemoState = {
  finalChoice: FinalChoice | null;
  finalPending: boolean;
  outcome: string;
  review: DemoReview;
  unresolvedActions: number;
  voteChoice: 'A' | 'B' | null;
  voteLocked: boolean;
  settings: {
    voteDeadline: string;
    friendIds: string[];
    reviewPostpone: '7d' | 'custom';
  };
};

export type DemoAction =
  | { type: 'save-final'; choice: FinalChoice }
  | { type: 'hold-final' }
  | { type: 'save-outcome'; text: string }
  | { type: 'save-review'; score: number; memo: string }
  | { type: 'postpone-review'; mode: '7d' | 'custom' }
  | { type: 'skip-review' }
  | { type: 'cast-vote'; choice: 'A' | 'B' }
  | { type: 'change-vote'; choice: 'A' | 'B' }
  | { type: 'set-deadline'; value: string }
  | { type: 'set-friends'; ids: string[] };

export const initialDemoState: DemoState = {
  finalChoice: null,
  finalPending: false,
  outcome: '',
  review: { score: null, memo: '', status: 'none', postponedUntil: null },
  unresolvedActions: 1,
  voteChoice: null,
  voteLocked: false,
  settings: {
    voteDeadline: '3時間',
    friendIds: ['mina-demo'],
    reviewPostpone: '7d',
  },
};

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case 'save-final':
      return {
        ...state,
        finalChoice: action.choice,
        finalPending: false,
        review: { score: null, memo: '', status: 'none', postponedUntil: null },
        unresolvedActions: 1,
      };
    case 'hold-final':
      return { ...state, finalChoice: null, finalPending: true, unresolvedActions: 0 };
    case 'save-outcome':
      return { ...state, outcome: action.text };
    case 'save-review':
      if (!state.finalChoice) return state;
      return {
        ...state,
        review: { score: action.score, memo: action.memo, status: 'saved', postponedUntil: null },
        unresolvedActions: Math.max(0, state.unresolvedActions - 1),
      };
    case 'postpone-review':
      if (!state.finalChoice || state.review.status === 'postponed') return state;
      return {
        ...state,
        review: {
          ...state.review,
          status: 'postponed',
          postponedUntil: action.mode === '7d' ? '7日後' : '選択した日時',
        },
        settings: { ...state.settings, reviewPostpone: action.mode },
        unresolvedActions: Math.max(0, state.unresolvedActions - 1),
      };
    case 'skip-review':
      if (!state.finalChoice) return state;
      return {
        ...state,
        review: { ...state.review, status: 'skipped', postponedUntil: null },
        unresolvedActions: Math.max(0, state.unresolvedActions - 1),
      };
    case 'cast-vote':
    case 'change-vote':
      return { ...state, voteChoice: action.choice, voteLocked: true };
    case 'set-deadline':
      return { ...state, settings: { ...state.settings, voteDeadline: action.value } };
    case 'set-friends':
      return action.ids.length
        ? { ...state, settings: { ...state.settings, friendIds: action.ids } }
        : state;
  }
}

export type DecisionFixture = {
  id: string;
  role: 'owner' | 'voter';
  phase: 'open' | 'closed';
  ballot: 'unvoted' | 'mutable' | 'locked' | 'none';
  selectedChoice?: 'A' | 'B';
  votes?: { A: number; B: number };
};

export const decisionFixtures: Record<string, DecisionFixture> = {
  'demo-coat': { id: 'demo-coat', role: 'voter', phase: 'open', ballot: 'unvoted' },
  'demo-coat-mutable': { id: 'demo-coat-mutable', role: 'voter', phase: 'open', ballot: 'mutable', selectedChoice: 'A' },
  'demo-coat-locked': { id: 'demo-coat-locked', role: 'voter', phase: 'open', ballot: 'locked', selectedChoice: 'B', votes: { A: 6, B: 4 } },
  'demo-owner-open': { id: 'demo-owner-open', role: 'owner', phase: 'open', ballot: 'none' },
  'demo-owner-closed': { id: 'demo-owner-closed', role: 'owner', phase: 'closed', ballot: 'none', votes: { A: 5, B: 5 } },
};

export function resultPercent(votes: { A: number; B: number }) {
  const total = votes.A + votes.B;
  if (!total) return null;
  return { A: Math.round((votes.A / total) * 100), B: 100 - Math.round((votes.A / total) * 100), total };
}
