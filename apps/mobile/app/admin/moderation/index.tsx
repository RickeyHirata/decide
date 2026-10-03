import { Link } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { useDemoState } from '../../../src/demo-context';
import { DemoBanner, Screen, StatePanel, usePalette } from '../../../src/ui';

export default function ModerationList() {
  const c = usePalette();
  const { state } = useDemoState();
  const [view, setView] = useState<'ready' | 'empty' | 'error'>('ready');
  const cases = Object.entries(state.moderationCases).filter(([, item]) => ['held', 'reported', 'appealed'].includes(item.status));
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>運営案件（staff fixture）</Text>
    <Text style={{ color: c.danger, marginVertical: 8 }}>実staff認証・MFA・監査ログには未接続です。操作はローカル状態だけを変更します。</Text>
    <View style={{ flexDirection: 'row', gap: 16, minHeight: 44, alignItems: 'center' }}><Pressable onPress={() => setView('ready')}><Text style={{ color: c.ink }}>一覧</Text></Pressable><Pressable onPress={() => setView('empty')}><Text style={{ color: c.ink }}>空</Text></Pressable><Pressable onPress={() => setView('error')}><Text style={{ color: c.ink }}>失敗</Text></Pressable></View>
    {view === 'error' ? <StatePanel kind="error" onRetry={() => setView('ready')}>案件を読み込めませんでした。</StatePanel> : null}
    {view === 'empty' || (view === 'ready' && cases.length === 0) ? <StatePanel>対応中の案件はありません。</StatePanel> : null}
    {view === 'ready' ? cases.map(([id, item]) => <Link key={id} href={`/admin/moderation/${id}`} style={{ color: c.ink, minHeight: 56, paddingVertical: 14 }}>{item.status.toUpperCase()}　{id} ›</Link>) : null}
  </Screen>;
}
