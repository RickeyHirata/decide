import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { useDemoState } from '../../../src/demo-context';
import { canAccessOwnerRecord, decisionFixtures, resultPercent, type FinalChoice } from '../../../src/demo-state';
import { ChoiceButton, DemoBanner, PrimaryButton, Screen, usePalette } from '../../../src/ui';

export default function Decide() {
  const c = usePalette();
  const { id = 'demo-owner-closed' } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useDemoState();
  const fixture = decisionFixtures[id];
  const record = state.decisions[id];
  const [choice, setChoice] = useState<FinalChoice | 'undecided' | null>(record?.finalChoice ?? null);

  if (!canAccessOwnerRecord(fixture)) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>この画面は表示できません</Text></Screen>;
  const result = fixture.votes ? resultPercent(fixture.votes) : null;

  function save() {
    if (!choice) return;
    if (choice === 'undecided') dispatch({ type: 'hold-final', decisionId: id });
    else dispatch({ type: 'save-final', decisionId: id, choice });
    router.replace(`/decision/${id}`);
  }

  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 14, color: c.muted }}>投票は終了しました ・ {result?.A === result?.B ? '最終結果は同数' : `A ${result?.A}% / B ${result?.B}%`}</Text>
    <Text style={{ fontSize: 25, lineHeight: 35, fontWeight: '800', color: c.ink }}>あなたはどう決めましたか？</Text>
    <ChoiceButton tone="a" label="A　明るいショートコート" selected={choice === 'A'} onPress={() => setChoice('A')} />
    <ChoiceButton tone="b" label="B　落ち着いたロングコート" selected={choice === 'B'} onPress={() => setChoice('B')} />
    <ChoiceButton label="どちらでもない" selected={choice === 'neither'} onPress={() => setChoice('neither')} />
    <ChoiceButton label="まだ決めていない" selected={choice === 'undecided'} onPress={() => setChoice('undecided')} />
    <PrimaryButton disabled={!choice} label={choice === 'undecided' ? '保留して詳細へ戻る' : '決断を記録して詳細へ戻る'} onPress={save} />
    <Text style={{ color: c.muted, marginTop: 12 }}>「その後」と振り返りは任意です。保存後に詳細から追加できます。</Text>
  </Screen>;
}
