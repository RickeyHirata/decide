import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { useDemoState } from '../../../src/demo-context';
import { ChoiceButton, DemoBanner, PrimaryButton, Screen, usePalette } from '../../../src/ui';

export default function ModerationDetail() {
  const c = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useDemoState();
  const item = id ? state.moderationCases[id] : undefined;
  const [action, setAction] = useState<'allowed' | 'held' | 'removed' | null>(null);
  const [note, setNote] = useState(item?.note ?? '');
  if (!id || !item) return <Screen><DemoBanner /><Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>案件を表示できません</Text></Screen>;
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>案件 {id}</Text>
    <Text style={{ color: c.danger, marginVertical: 8 }}>staff+MFAを再現するfixtureではありません。外部公開・削除・機能停止は実行しません。</Text>
    <Text style={{ color: c.ink }}>対象版 revision 3　現在：{item.status}</Text>
    <Text style={{ color: c.muted, marginVertical: 8 }}>理由：ローカル検証用の架空案件。最新投稿版を確認する想定です。</Text>
    <ChoiceButton label="公開可（ローカル）" selected={action === 'allowed'} onPress={() => setAction('allowed')} />
    <ChoiceButton label="保留を維持（ローカル）" selected={action === 'held'} onPress={() => setAction('held')} />
    <ChoiceButton label="削除判定（ローカル）" selected={action === 'removed'} onPress={() => setAction('removed')} />
    <TextInput accessibilityLabel="判断メモ" value={note} onChangeText={setNote} multiline placeholder="監査メモ（ローカル）" placeholderTextColor={c.muted} style={{ minHeight: 90, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink, marginTop: 12 }} />
    <PrimaryButton disabled={!action || !note.trim()} label="ローカル判断を確定" onPress={() => { if (action) dispatch({ type: 'moderate-case', caseId: id, status: action, note }); router.back(); }} />
  </Screen>;
}
