import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDemoState } from '../src/demo-context';
import { DemoBanner, Screen, Section, StatePanel, usePalette } from '../src/ui';

const archived = [
  { id: 'demo-desk', month: '2026年9月', category: '買い物', question: '作業机はどちらにする？', decision: 'B', score: '8 / 10' },
  { id: 'demo-trip', month: '2026年8月', category: '旅行', question: '休みは海と山どちらへ行く？', decision: 'A', score: '9 / 10' },
];

export default function History() {
  const c = usePalette();
  const { state } = useDemoState();
  const [category, setCategory] = useState('すべて');
  const current = state.finalChoice ? [{ id: 'demo-owner-closed', month: '2026年9月', category: 'ファッション', question: '週末の旅行には、どちらのコートが合う？', decision: state.finalChoice, score: state.review.score ? `${state.review.score} / 10` : '未回答' }] : [];
  const entries = [...current, ...archived];
  const shown = category === 'すべて' ? entries : entries.filter((entry) => entry.category === category);
  return <Screen scroll>
    <DemoBanner />
    <Text style={[styles.title, { color: c.ink }]}>決断の履歴</Text>
    <Text style={{ color: c.muted }}>進行中 {state.finalPending ? 1 : 0}件　完了 {entries.length}件</Text>
    <View style={styles.filters}>{['すべて', 'ファッション', '買い物', '旅行'].map((value) => <Pressable key={value} onPress={() => setCategory(value)} style={[styles.filter, { backgroundColor: category === value ? c.ink : c.surface }]}><Text style={{ color: category === value ? c.canvas : c.ink }}>{value}</Text></Pressable>)}</View>
    {shown.length === 0 ? <StatePanel>このカテゴリの履歴はありません。</StatePanel> : shown.map((entry, index) => <Section key={entry.id} title={index === 0 || shown[index - 1]?.month !== entry.month ? entry.month : ''}><Link href={`/history/${entry.id}`} style={[styles.entry, { color: c.ink }]}>{entry.question}{'\n'}<Text style={{ color: c.muted }}>本人の決断 {entry.decision} ・ 満足度 {entry.score}</Text></Link></Section>)}
  </Screen>;
}

const styles = StyleSheet.create({ title: { fontSize: 25, fontWeight: '800' }, filters: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginVertical: 18 }, filter: { minHeight: 44, paddingHorizontal: 14, borderRadius: 999, justifyContent: 'center' }, entry: { fontSize: 16, lineHeight: 25, minHeight: 60 } });
