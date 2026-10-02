import { Link, useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { historyFixtures } from '../../src/demo-state';
import { DemoBanner, Screen, Section, usePalette } from '../../src/ui';

export default function HistoryDetail() {
  const c = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state } = useDemoState();
  const localRecord = id === 'demo-owner-closed' ? state.decisions[id] : undefined;
  const archived = id ? historyFixtures[id] : undefined;
  if (id === 'demo-owner-closed' && !localRecord?.finalChoice) return <Screen><DemoBanner /><Text style={{ color: c.ink }}>最終決断がまだないため、完了履歴はありません。</Text></Screen>;
  if (!localRecord?.finalChoice && !archived) return <Screen><DemoBanner /><Text style={{ color: c.ink, fontSize: 25, fontWeight: '800' }}>この履歴は表示できません</Text></Screen>;

  const entry = archived ?? { id: id!, date: '2026年9月28日', category: 'ファッション', question: '週末の旅行には、どちらのコートが合う？', decision: localRecord!.finalChoice! };
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 14, color: c.muted }}>{entry.date} ・ {entry.category}</Text>
    <Text style={{ fontSize: 25, lineHeight: 35, fontWeight: '800', color: c.ink, marginTop: 8 }}>{entry.question}</Text>
    <Section title="本人の決断"><Text style={{ fontSize: 20, fontWeight: '700', color: c.ink }}>{entry.decision}</Text>{localRecord?.outcome ? <Text style={{ color: c.ink }}>その後：{localRecord.outcome}</Text> : null}<Text style={{ color: c.muted, marginTop: 8 }}>満足度 {localRecord?.review.score ? `${localRecord.review.score} / 10` : '未回答'}</Text></Section>
    {localRecord?.finalChoice ? <Link href={`/decision/${id}/review`} style={{ color: c.ink, minHeight: 48, paddingVertical: 12 }}>振り返りを書く ›</Link> : null}
    <Link href={`/history/${id}/share`} style={{ color: c.ink, minHeight: 48, paddingVertical: 12 }}>履歴の共有範囲を設定 ›</Link>
    {localRecord?.finalChoice ? <Link href={`/decision/${id}`} style={{ color: c.ink, minHeight: 48, paddingVertical: 12 }}>元の相談を見る（権限は別に確認）</Link> : null}
  </Screen>;
}
