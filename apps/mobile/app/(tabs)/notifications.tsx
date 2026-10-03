import { Link } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { DemoBanner, Screen, Section, StatePanel, usePalette } from '../../src/ui';

export default function Notifications() {
  const c = usePalette();
  const { state } = useDemoState();
  const record = state.decisions['demo-owner-closed'];
  return <Screen scroll>
    <DemoBanner />
    <Text style={[styles.title, { color: c.ink }]}>通知</Text>
    <Section title={`対応が必要　${state.unresolvedActions}`}>
      {state.unresolvedActions === 0
        ? <StatePanel>対応が必要な通知はありません。</StatePanel>
        : <>
          {!record?.finalChoice && !record?.finalPending ? <Link href="/decision/demo-owner-closed/decide" style={[styles.item, { color: c.ink }]}>コートの相談を決断する ›</Link> : null}
          {record?.finalChoice && record.review.status === 'none' ? <Link href="/decision/demo-owner-closed/review" style={[styles.item, { color: c.ink }]}>前の決断を振り返る ›</Link> : null}
        </>}
    </Section>
    <Section title="お知らせ">
      <Text style={[styles.item, { color: c.ink }]}>ユイが友達申請を承認しました</Text>
      <Text style={{ color: c.muted }}>既読のお知らせはBadge件数に含みません。</Text>
    </Section>
  </Screen>;
}

const styles = StyleSheet.create({ title: { fontSize: 25, fontWeight: '800', marginBottom: 18 }, item: { fontSize: 16, lineHeight: 24, minHeight: 48, paddingVertical: 12 } });
