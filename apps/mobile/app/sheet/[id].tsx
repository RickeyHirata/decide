import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { ChoiceButton, PrimaryButton, usePalette } from '../../src/ui';

const labels: Record<string, [string, string]> = {
  o01: ['写真選択・位置調整', '未実装：写真選択と1:1 crop操作は次のM0作業です。'],
  o02: ['期限を選ぶ', '確定するまで投稿設定は変わりません。'],
  o03: ['相談する友達', '1人以上を選び、確定してください。'],
  o04: ['投票者ひとこと', '未実装：80文字入力と審査状態は次のM0作業です。'],
  o05: ['投稿メニュー', '未実装：role/capabilities別の操作は次のM0作業です。'],
  o06: ['回答者', '未実装：許可された記名回答者のprojectionは次のM0作業です。'],
  o07: ['投票を変更', '変更すると確定し、再変更できません。'],
  o08: ['終了・削除', '未実装：操作別の影響確認は次のM0作業です。'],
  o09: ['カテゴリ修正', '未実装：固定11カテゴリの選択は次のM0作業です。'],
  o10: ['振り返りを延期', '延期は一度だけです。確定するまで状態は変わりません。'],
};

export default function Sheet() {
  const c = usePalette();
  const params = useLocalSearchParams<Record<string, string>>();
  const { id = 'o01', returnTo, choice } = params;
  const { state, dispatch } = useDemoState();
  const [deadline, setDeadline] = useState(state.settings.voteDeadline);
  const [friends, setFriends] = useState(state.settings.friendIds);
  const [postpone, setPostpone] = useState(state.settings.reviewPostpone);
  const [title, body] = labels[id] ?? ['不明なシート', 'このシートは実装されていません。'];
  const implemented = ['o02', 'o03', 'o07', 'o10'].includes(id);

  function close() {
    if (!returnTo) return router.back();
    const preserved = Object.fromEntries(Object.entries(params).filter(([key]) => !['id', 'returnTo', 'choice'].includes(key)));
    return router.replace({ pathname: returnTo as never, params: preserved });
  }
  function confirm() {
    if (id === 'o02') dispatch({ type: 'set-deadline', value: deadline });
    if (id === 'o03') dispatch({ type: 'set-friends', ids: friends });
    if (id === 'o07' && (choice === 'A' || choice === 'B')) dispatch({ type: 'change-vote', choice });
    if (id === 'o10') dispatch({ type: 'postpone-review', mode: postpone });
    close();
  }

  return <Modal visible transparent animationType="slide" onRequestClose={close}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.45)', justifyContent: 'flex-end' }}>
      <View accessibilityViewIsModal style={{ backgroundColor: c.canvas, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 32 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: c.ink }}>{id.toUpperCase()}　{title}</Text>
        <Text style={{ color: c.muted, lineHeight: 24, marginVertical: 12 }}>{body}</Text>
        {id === 'o02' ? ['15分', '1時間', '3時間', '1日'].map((value) => <ChoiceButton key={value} label={value} selected={deadline === value} onPress={() => setDeadline(value)} />) : null}
        {id === 'o03' ? [['mina-demo', 'ミナ'], ['yui-demo', 'ユイ']].map(([value, label]) => <ChoiceButton key={value} label={label} selected={friends.includes(value)} onPress={() => setFriends(friends.includes(value) ? friends.filter((friend) => friend !== value) : [...friends, value])} />) : null}
        {id === 'o07' ? <Text style={{ color: c.ink }}>現在の選択から {choice ?? '未選択'} へ変更します。</Text> : null}
        {id === 'o10' ? <><ChoiceButton label="7日後" selected={postpone === '7d'} onPress={() => setPostpone('7d')} /><ChoiceButton label="日時指定（デモ値）" selected={postpone === 'custom'} onPress={() => setPostpone('custom')} /></> : null}
        {implemented ? <PrimaryButton disabled={id === 'o03' && friends.length === 0} label="確定" onPress={confirm} /> : null}
        <Pressable accessibilityRole="button" onPress={close} style={{ minHeight: 48, justifyContent: 'center' }}><Text style={{ textAlign: 'center', color: c.ink }}>{implemented ? '取消' : '閉じる'}</Text></Pressable>
      </View>
    </View>
  </Modal>;
}
