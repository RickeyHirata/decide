import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useDemoState } from '../../../src/demo-context';
import { canAccessOwnerRecord, decisionFixtures } from '../../../src/demo-state';
import { DemoBanner, PrimaryButton, Screen, usePalette } from '../../../src/ui';

export default function Review() {
  const c = usePalette();
  const { id = 'demo-owner-closed' } = useLocalSearchParams<{ id: string }>();
  const { state, dispatch } = useDemoState();
  const sourceFixture = decisionFixtures[id];
  const fixture = sourceFixture && state.postStates[id] === 'closed' ? { ...sourceFixture, phase: 'closed' as const } : sourceFixture;
  const record = state.decisions[id];
  const [score, setScore] = useState<number | null>(record?.review.score ?? null);
  const [memo, setMemo] = useState(record?.review.memo ?? '');
  if (!canAccessOwnerRecord(fixture)) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>この画面は表示できません。</Text></Screen>;
  if (!record?.finalChoice) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>最終決断がないため振り返りは保存できません。</Text></Screen>;

  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 14, color: c.muted }}>本人の決断 {record.finalChoice}</Text>
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>この決断を振り返る</Text>
    {record.review.status !== 'none' ? <Text style={{ color: c.muted, marginTop: 8 }}>現在：{record.review.status}{record.review.postponedUntil ? `（${record.review.postponedUntil}）` : ''}</Text> : null}
    <View style={styles.scores}>{Array.from({ length: 10 }, (_, i) => i + 1).map((number) => <Pressable key={number} accessibilityLabel={`満足度 ${number}`} accessibilityState={{ selected: score === number }} onPress={() => setScore(number)} style={[styles.score, { borderColor: score === number ? c.ink : c.line, backgroundColor: c.surface }]}><Text style={{ color: c.ink, fontWeight: '700' }}>{number}</Text></Pressable>)}</View>
    <TextInput accessibilityLabel="振り返りメモ" value={memo} onChangeText={setMemo} maxLength={300} multiline placeholder="メモ（任意）" placeholderTextColor={c.muted} style={[styles.input, { color: c.ink, borderColor: c.line }]} />
    <Text style={{ color: c.muted }}>自分だけに保存 ・ {memo.length} / 300</Text>
    <PrimaryButton disabled={!score} label="振り返りを保存して詳細へ戻る" onPress={() => { if (score) dispatch({ type: 'save-review', decisionId: id, score, memo }); router.replace(`/decision/${id}`); }} />
    {record.review.status !== 'postponed' ? <Pressable onPress={() => router.push({ pathname: '/sheet/o10', params: { returnTo: `/decision/${id}/review`, decisionId: id } })} style={styles.secondary}><Text style={{ color: c.ink }}>まだ結果が分からない — 延期する</Text></Pressable> : null}
    <Pressable onPress={() => { dispatch({ type: 'skip-review', decisionId: id }); router.replace(`/decision/${id}`); }} style={styles.secondary}><Text style={{ color: c.muted }}>今回は振り返らない</Text></Pressable>
  </Screen>;
}

const styles = StyleSheet.create({
  scores: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 16 },
  score: { width: '17%', minHeight: 48, borderWidth: 1, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: { minHeight: 100, borderWidth: 1, borderRadius: 12, padding: 12, textAlignVertical: 'top', marginTop: 18 },
  secondary: { minHeight: 48, justifyContent: 'center', alignItems: 'center', marginTop: 8 },
});
