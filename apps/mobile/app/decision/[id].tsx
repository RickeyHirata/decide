import { Link, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { decisionFixtures, resultPercent } from '../../src/demo-state';
import { demoDecision } from '../../src/demo';
import { DemoBanner, PrimaryButton, Screen, usePalette } from '../../src/ui';

export default function Decision() {
  const c = usePalette();
  const { id } = useLocalSearchParams<{ id: string }>();
  const fixture = id ? decisionFixtures[id] : undefined;
  const { state, dispatch } = useDemoState();
  const initialChoice = fixture?.selectedChoice ?? (id === 'demo-coat' ? state.voteChoice : null);
  const [choice, setChoice] = useState<'A' | 'B' | null>(initialChoice);
  const [error, setError] = useState(false);

  if (!fixture) return <Screen><DemoBanner /><Text style={[styles.title, { color: c.ink }]}>この相談は表示できません</Text><Text style={{ color: c.muted }}>無効・削除・権限不足の詳細は表示しません。</Text></Screen>;
  const currentFixture = fixture;

  const locked = fixture.ballot === 'locked' || (id === 'demo-coat' && state.voteLocked);
  const mutable = fixture.ballot === 'mutable';
  const canChoose = fixture.role === 'voter' && fixture.phase === 'open' && !locked;
  const votes = fixture.votes ?? (locked ? { A: 6, B: 4 } : undefined);
  const result = votes && (fixture.phase === 'closed' || (fixture.role === 'voter' && locked)) ? resultPercent(votes) : null;

  function confirmVote() {
    if (!choice) return;
    if (mutable && choice !== currentFixture.selectedChoice) {
      router.push({ pathname: '/sheet/o07', params: { returnTo: `/decision/${currentFixture.id}`, choice } });
      return;
    }
    dispatch({ type: 'cast-vote', choice });
  }

  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 14, color: c.muted }}>{fixture.role === 'owner' ? 'あなたの相談' : 'ミナ'} ・ {fixture.phase === 'open' ? '受付中' : '受付終了'} ・ {fixture.ballot}</Text>
    <Text style={[styles.title, { color: c.ink }]}>{demoDecision.question}</Text>
    <View style={styles.pair}>{demoDecision.options.map((option, index) => <Pressable
      key={option.choice}
      accessibilityRole="button"
      accessibilityState={{ selected: choice === option.choice, disabled: !canChoose }}
      disabled={!canChoose}
      onPress={() => setChoice(option.choice)}
      style={[styles.option, { backgroundColor: index ? c.lilac : c.lime, borderColor: c.ink }, choice === option.choice && styles.selected]}
    ><Text style={{ color: c.ink, fontSize: 18, lineHeight: 27, fontWeight: '700' }}>{option.choice}{choice === option.choice ? '　✓' : ''}{'\n'}{option.label}</Text></Pressable>)}</View>

    {fixture.role === 'owner' && fixture.phase === 'open' ? <Text style={[styles.note, { color: c.muted }]}>投稿者には受付終了まで途中集計を表示しません。</Text> : null}
    {result ? <View style={[styles.result, { borderColor: c.line }]}><Text style={{ fontSize: 20, fontWeight: '700', color: c.ink }}>{result.A === result.B ? '最終結果　同数' : `結果　A ${result.A}% / B ${result.B}%`}</Text><Text style={{ color: c.muted }}>{result.total}票（ローカルfixture）</Text></View> : null}
    {error ? <Text accessibilityRole="alert" style={{ color: c.danger }}>接続エラーの見本です。選択内容は保持しています。</Text> : null}

    {canChoose ? <PrimaryButton disabled={!choice} label={mutable ? 'この投票で確定して結果を見る' : choice ? `${choice} に投票して結果を見る` : 'A または B を選ぶ'} onPress={confirmVote} /> : null}
    {canChoose && choice ? <Pressable style={styles.secondary} onPress={() => setError(!error)}><Text style={{ color: c.muted }}>失敗状態を試す</Text></Pressable> : null}
    {fixture.role === 'owner' && fixture.phase === 'open' ? <PrimaryButton label="今決める（受付を終了）" onPress={() => router.push('/decision/demo-owner-closed/decide')} /> : null}
    {fixture.role === 'owner' && fixture.phase === 'closed' && !state.finalChoice ? <PrimaryButton label="決断を記録する" onPress={() => router.push(`/decision/${fixture.id}/decide`)} /> : null}

    <View style={[styles.links, { borderColor: c.line }]}>
      {locked && fixture.role === 'voter' ? <Link href="/sheet/o04" style={{ color: c.ink }}>ひとことを書く</Link> : null}
      {fixture.role === 'owner' ? <Link href="/sheet/o05" style={{ color: c.ink }}>投稿メニュー</Link> : null}
      {state.finalChoice ? <><Text style={{ color: c.ink, fontWeight: '700' }}>本人の決断：{state.finalChoice}</Text>{state.outcome ? <Text style={{ color: c.ink }}>その後：{state.outcome}</Text> : null}<Link href={`/decision/${fixture.id}/outcome`} style={{ color: c.ink }}>その後を追加・編集</Link><Link href={`/decision/${fixture.id}/review`} style={{ color: c.ink }}>振り返る</Link></> : null}
      {state.finalPending ? <Text style={{ color: c.muted }}>まだ決めていないため、最終決断は記録されていません。</Text> : null}
    </View>
  </Screen>;
}

const styles = StyleSheet.create({
  title: { fontSize: 25, lineHeight: 35, fontWeight: '800', marginTop: 8 },
  pair: { flexDirection: 'row', gap: 6, marginTop: 22 },
  option: { flex: 1, minHeight: 180, borderRadius: 18, padding: 16, borderWidth: 0 },
  selected: { borderWidth: 3 },
  note: { fontSize: 12, lineHeight: 18, marginTop: 14 },
  result: { borderTopWidth: 1, borderBottomWidth: 1, paddingVertical: 18, marginTop: 18 },
  secondary: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  links: { borderTopWidth: 1, marginTop: 20, paddingTop: 18, gap: 20 },
});
