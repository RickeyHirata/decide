import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Switch, Text, TextInput, View } from 'react-native';
import { DemoBanner, PrimaryButton, Screen, usePalette } from '../../src/ui';

const copy: Record<string, [string, string]> = {
  profile: ['プロフィール編集', '表示名・@ID・自己紹介・タイプ・テーマを編集します。'],
  notifications: ['通知設定', 'OSの通知許可とは別に、対応・お知らせ・23〜8時の休止を設定します。'],
  privacy: ['公開設定', 'DNA・タイプ・友達数・フォロー数の公開範囲を設定します。投稿ごとの範囲は変わりません。'],
  blocked: ['ブロック管理', '解除しても友達・フォロー関係は自動で復元しません。'],
  account: ['アカウント削除', '削除には10分以内の再認証が必要です。ローカルデモでは再認証・削除要求を実行できません。'],
};

export default function Setting() {
  const c = usePalette();
  const { page = 'profile' } = useLocalSearchParams<{ page: string }>();
  const [on, setOn] = useState(false);
  const [text, setText] = useState('');
  const [saved, setSaved] = useState(false);
  const [title, body] = copy[page] ?? ['設定', 'この項目は利用できません。'];
  const account = page === 'account';
  return <Screen scroll>
    <DemoBanner />
    <Text style={{ fontSize: 25, fontWeight: '800', color: c.ink }}>{title}</Text>
    <Text style={{ color: c.muted, lineHeight: 24, marginVertical: 16 }}>{body}</Text>
    {!account && (page === 'profile'
      ? <TextInput value={text} onChangeText={(value) => { setText(value); setSaved(false); }} placeholder="表示名" placeholderTextColor={c.muted} style={{ minHeight: 48, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink }} />
      : <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 56 }}><Text style={{ color: c.ink }}>ローカル設定</Text><Switch value={on} onValueChange={(value) => { setOn(value); setSaved(false); }} /></View>)}
    {!account ? <PrimaryButton label={saved ? 'ローカル設定を保存しました' : 'ローカル設定を保存'} onPress={() => setSaved(true)} /> : <View style={{ backgroundColor: c.surface, borderRadius: 12, padding: 16 }}><Text style={{ color: c.muted }}>実アカウントの削除操作ではありません。M1/M4の再認証と削除処理が接続されるまで操作は無効です。</Text></View>}
  </Screen>;
}
