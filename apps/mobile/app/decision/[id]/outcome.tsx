import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useDemoState } from '../../../src/demo-context';
import { DemoBanner, PrimaryButton, Screen, usePalette } from '../../../src/ui';

export default function Outcome() {
  const c = usePalette();
  const { id = 'demo-owner-closed' } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useDemoState();
  const [text, setText] = useState(state.outcome);
  if (!state.finalChoice) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>先に最終決断を記録してください。</Text></Screen>;
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>その後（任意）</Text>
    <Text style={{ color: c.muted, marginVertical: 12 }}>本人の決断：{state.finalChoice}。あとから追加・編集できます。</Text>
    <TextInput accessibilityLabel="その後" value={text} onChangeText={setText} maxLength={80} multiline placeholder="使ってみてどうだった？" placeholderTextColor={c.muted} style={{ minHeight: 110, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink, textAlignVertical: 'top' }} />
    <Text style={{ color: c.muted, textAlign: 'right' }}>{text.length} / 80</Text>
    <PrimaryButton label="保存して詳細へ戻る" onPress={() => { dispatch({ type: 'save-outcome', text }); router.replace(`/decision/${id}`); }} />
  </Screen>;
}
