export * from '../../../reference/domain.ts';

export type Capability =
  | 'vote'
  | 'change_ballot'
  | 'lock_ballot'
  | 'view_result'
  | 'close_poll'
  | 'record_final'
  | 'review';

export interface OptionDto { choice: 'A' | 'B'; label: string; imageUrl?: string }
export interface DecisionDto {
  id: string;
  revision: number;
  serverNow: string;
  publication: 'checking' | 'visible' | 'held';
  pollState: 'open' | 'closed';
  author: { kind: 'named'; displayName: string; handle: string } | { kind: 'anonymous'; label: string };
  question: string;
  context?: string;
  options: [OptionDto, OptionDto];
  audienceLabel: string;
  endsAt: string;
  capabilities: Capability[];
  myBallot?: { choice: 'A' | 'B'; state: 'mutable' | 'locked'; mutableUntil: string };
  result?: { phase: 'current' | 'final'; a: number; b: number; total: number };
}
