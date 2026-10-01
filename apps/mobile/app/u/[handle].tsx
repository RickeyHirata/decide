import { useState } from 'react';
import { Text } from 'react-native';
import { DemoBanner, PrimaryButton, Screen, Section, usePalette } from '../../src/ui';

export default function PublicProfile() {
  const c = usePalette();
  const [requested, setRequested] = useState(false);
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>ミナ　<Text style={{ fontSize: 14, color: c.muted }}>@mina_demo</Text></Text>
    <Text style={{ color: c.muted }}>公開用の架空プロフィール</Text>
    <PrimaryButton disabled={requested} label={requested ? 'ローカル申請済み' : '友達申請をローカルで試す'} onPress={() => setRequested(true)} />
    {requested ? <Text style={{ color: c.muted, marginTop: 8 }}>この画面を閉じるまでのデモ状態です。実際の申請や通知は送信していません。</Text> : null}
    <Section title="公開された履歴"><Text style={{ color: c.muted }}>本人が確認して共有した履歴だけを表示。非公開・匿名の活動は推測できる統計に含めません。</Text></Section>
  </Screen>;
}
