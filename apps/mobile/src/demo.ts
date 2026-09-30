import type { DecisionDto } from '@decide/domain';

export const demoDecision: DecisionDto = {
  id: 'demo-coat', revision: 3, serverNow: '2026-09-30T09:00:00.000Z', publication: 'visible', pollState: 'open',
  author: { kind: 'named', displayName: 'ミナ', handle: 'mina_demo' },
  question: '週末の旅行には、どちらのコートが合う？', context: '歩く時間が長いので、着やすさも気になっています。',
  options: [{ choice: 'A', label: '明るいショートコート' }, { choice: 'B', label: '落ち着いたロングコート' }],
  audienceLabel: '友達＋リンク', endsAt: '2026-09-30T12:00:00.000Z', capabilities: ['vote'],
};
