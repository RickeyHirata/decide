import { Link, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { DemoBanner, Screen, Section, usePalette } from '../../src/ui';

export default function HistoryDetail() {
  const c = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useDemoState();
  if (id === 'demo-owner-closed' && !state.finalChoice) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>最終決断がまだないため、完了履歴はありません。</Text></Screen>;
  const decision = id === 'demo-owner-closed' ? state.finalChoice : id === 'demo-desk' ? 'B' : 'A';
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 14, color: c.muted }}>2026年9月28日 ・ ファッション</Text>
    <Text style={{ fontSize: 25, lineHeight: 35, fontWeight: '800', color: c.ink, marginTop: 8 }}>週末の旅行には、どちらのコートが合う？</Text>
    <Section title="本人の決断"><Text style={{ fontSize: 20, fontWeight: '700', color: c.ink }}>{decision}</Text>{id === 'demo-owner-closed' && state.outcome ? <Text style={{ color: c.ink }}>その後：{state.outcome}</Text> : null}<Text style={{ color: c.muted, marginTop: 8 }}>満足度 {id === 'demo-owner-closed' && state.review.score ? `${state.review.score} / 10` : '未回答'}</Text></Section>
    {id === 'demo-owner-closed' ? <Link href={`/decision/${id}/review`} style={{ color: c.ink, minHeight: 48, paddingVertical: 12 }}>振り返りを書く ›</Link> : null}
    <Link href={`/history/${id}/share`} style={{ color: c.ink, minHeight: 48, paddingVertical: 12 }}>履歴の共有範囲を設定 ›</Link>
    <Link href={`/decision/${id}`} style={{ color: c.ink, minHeight: 48, paddingVertical: 12 }}>元の相談を見る（権限は別に確認）</Link>
  </Screen>;
}
