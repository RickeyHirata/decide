import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { canConfirmVoteChange, decisionFixtures, demoNowForDecision, isFutureIso } from '../../src/demo-state';
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
  const { id = 'o01', returnTo, choice, decisionId } = params;
  const { state, dispatch } = useDemoState();
  const [deadline, setDeadline] = useState(state.settings.voteDeadline);
  const [customDeadline, setCustomDeadline] = useState(state.settings.customVoteDeadline);
  const [friends, setFriends] = useState(state.settings.friendIds);
  const [postpone, setPostpone] = useState(state.settings.reviewPostpone);
  const [customReviewAt, setCustomReviewAt] = useState(state.settings.customReviewAt);
  const [title, body] = labels[id] ?? ['不明なシート', 'このシートは実装されていません。'];
  const implemented = ['o02', 'o03', 'o07', 'o10'].includes(id);
  const changeNow = decisionId ? demoNowForDecision(state, decisionId) : '';
  const canChangeVote = id !== 'o07' || canConfirmVoteChange(decisionId ? decisionFixtures[decisionId] : undefined, state, changeNow, choice);

  function close() {
    if (!returnTo) return router.back();
    const preserved = Object.fromEntries(Object.entries(params).filter(([key]) => !['id', 'returnTo', 'choice'].includes(key)));
    return router.replace({ pathname: returnTo as never, params: preserved });
  }
  function confirm() {
    if (id === 'o02') dispatch({ type: 'set-deadline', value: deadline, customAt: deadline === '日時指定' ? customDeadline : undefined });
    if (id === 'o03') dispatch({ type: 'set-friends', ids: friends });
    if (id === 'o07' && canChangeVote && decisionId && (choice === 'A' || choice === 'B')) dispatch({ type: 'change-vote', decisionId, choice, now: changeNow });
    if (id === 'o10' && decisionId) dispatch({ type: 'postpone-review', decisionId, mode: postpone, customAt: postpone === 'custom' ? customReviewAt : undefined });
    close();
  }

  return <Modal visible transparent animationType="slide" onRequestClose={close}>
    <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.45)', justifyContent: 'flex-end' }}>
      <View accessibilityViewIsModal style={{ backgroundColor: c.canvas, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 32 }}>
        <Text style={{ fontSize: 22, fontWeight: '800', color: c.ink }}>{id.toUpperCase()}　{title}</Text>
        <Text style={{ color: c.muted, lineHeight: 24, marginVertical: 12 }}>{body}</Text>
        {id === 'o02' ? <>{['1時間', '3時間', '1日', '1週間', '日時指定'].map((value) => <ChoiceButton key={value} label={value} selected={deadline === value} onPress={() => setDeadline(value)} />)}{deadline === '日時指定' ? <TextInput accessibilityLabel="投票終了日時" value={customDeadline} onChangeText={setCustomDeadline} placeholder="2026-10-02T09:00" placeholderTextColor={c.muted} style={{ minHeight: 48, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink, marginTop: 8 }} /> : null}</> : null}
        {id === 'o03' ? [['mina-demo', 'ミナ'], ['yui-demo', 'ユイ']].map(([value, label]) => <ChoiceButton key={value} label={label} selected={friends.includes(value)} onPress={() => setFriends(friends.includes(value) ? friends.filter((friend) => friend !== value) : [...friends, value])} />) : null}
        {id === 'o07' ? canChangeVote ? <Text style={{ color: c.ink }}>選択を {choice} へ変更します。確定後は再変更できません。</Text> : <Text accessibilityRole="alert" style={{ color: c.danger }}>この投票は変更できません。期限切れ、確定済み、権限なし、または不正なリンクです。</Text> : null}
        {id === 'o10' ? <><ChoiceButton label="7日後" selected={postpone === '7d'} onPress={() => setPostpone('7d')} /><ChoiceButton label="日時指定" selected={postpone === 'custom'} onPress={() => setPostpone('custom')} />{postpone === 'custom' ? <TextInput accessibilityLabel="延期日時" value={customReviewAt} onChangeText={setCustomReviewAt} placeholder="2026-10-08T09:00" placeholderTextColor={c.muted} style={{ minHeight: 48, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink, marginTop: 8 }} /> : null}</> : null}
        {implemented ? <PrimaryButton disabled={!canChangeVote || (id === 'o03' && friends.length === 0) || (id === 'o02' && deadline === '日時指定' && !isFutureIso(customDeadline)) || (id === 'o10' && postpone === 'custom' && !isFutureIso(customReviewAt))} label={id === 'o07' && !canChangeVote ? '変更できません' : '確定'} onPress={confirm} /> : null}
        <Pressable accessibilityRole="button" onPress={close} style={{ minHeight: 48, justifyContent: 'center' }}><Text style={{ textAlign: 'center', color: c.ink }}>{implemented ? '取消' : '閉じる'}</Text></Pressable>
      </View>
    </View>
  </Modal>;
}
