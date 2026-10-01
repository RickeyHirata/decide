import { useState } from 'react';
import { Text, TextInput } from 'react-native';
import { DemoBanner, PrimaryButton, Screen, usePalette } from '../src/ui';

export default function Support() {
  const c = usePalette();
  const [text, setText] = useState('');
  const [previewed, setPreviewed] = useState(false);
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>通報・問い合わせ</Text>
    <Text style={{ color: c.muted, marginVertical: 12 }}>理由と詳細のローカル確認のみです。サーバー未接続のため通報は送信されません。</Text>
    <TextInput value={text} onChangeText={(value) => { setText(value); setPreviewed(false); }} maxLength={300} multiline placeholder="詳細（任意）" placeholderTextColor={c.muted} style={{ minHeight: 120, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink, textAlignVertical: 'top' }} />
    <PrimaryButton label={previewed ? 'ローカル内容を確認済み' : '送信内容をローカルで確認'} onPress={() => setPreviewed(true)} />
    {previewed ? <Text style={{ color: c.muted, marginTop: 8 }}>実送信はしていません。入力はこの画面を閉じるまで保持されます。</Text> : null}
  </Screen>;
}
