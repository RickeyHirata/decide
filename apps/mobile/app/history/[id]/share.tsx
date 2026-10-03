import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import { useDemoState } from '../../../src/demo-context';
import { historyFixtures, type ShareScope } from '../../../src/demo-state';
import { ChoiceButton, DemoBanner, PrimaryButton, Screen, usePalette } from '../../../src/ui';

export default function Share() {
  const c = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useDemoState();
  const valid = Boolean(id && (state.decisions[id]?.finalChoice || historyFixtures[id]));
  const committed = id ? state.decisions[id]?.shareScope ?? 'self' : 'self';
  const [value, setValue] = useState<ShareScope>(committed);
  if (!id || !valid) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>この履歴は表示できません</Text></Screen>;
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>履歴を共有</Text>
    <Text style={{ color: c.muted, marginVertical: 12 }}>本人の決断だけを共有します。票・回答者・ひとことは含みません。</Text>
    {([['self', '自分だけ'], ['friends', '友達'], ['public', '公開']] as const).map(([scope, label]) => <ChoiceButton key={scope} label={label} selected={value === scope} onPress={() => setValue(scope)} />)}
    <PrimaryButton label="共有範囲を保存して戻る" onPress={() => { dispatch({ type: 'set-share', decisionId: id, scope: value }); router.back(); }} />
    <Text style={{ color: c.muted, marginTop: 8 }}>現在の保存値：{committed}</Text>
  </Screen>;
}
