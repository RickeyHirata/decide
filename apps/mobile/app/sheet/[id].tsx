import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';
import { useDemoState } from '../../src/demo-context';
import { canConfirmVoteChange, decisionFixtures, demoNowForDecision, isFutureIso, projectDecision } from '../../src/demo-state';
import { ChoiceButton, PrimaryButton, StatePanel, usePalette } from '../../src/ui';

const categories = ['ファッション', '買い物', '旅行', '仕事', '学び', '健康', '食事', '恋愛', '家族', '趣味', 'その他'];
const titles: Record<string, string> = { o01: '写真選択・位置調整', o02: '期限を選ぶ', o03: '相談する友達', o04: '投票者ひとこと', o05: '投稿メニュー', o06: '回答者', o07: '投票を変更', o08: '終了・削除', o09: 'カテゴリ修正', o10: '振り返りを延期' };

export default function Sheet() {
  const c = usePalette();
  const params = useLocalSearchParams<Record<string, string>>();
  const { id = '', returnTo, choice, decisionId, option } = params;
  const { state, dispatch } = useDemoState();
  const fixture = decisionId ? decisionFixtures[decisionId] : undefined;
  const now = decisionId ? demoNowForDecision(state, decisionId) : '';
  const projection = projectDecision(fixture, state, now);
  const [deadline, setDeadline] = useState(state.settings.voteDeadline);
  const [customDeadline, setCustomDeadline] = useState(state.settings.customVoteDeadline);
  const [friends, setFriends] = useState(state.settings.friendIds);
  const [postpone, setPostpone] = useState(state.settings.reviewPostpone);
  const [customReviewAt, setCustomReviewAt] = useState(state.settings.customReviewAt);
  const [text, setText] = useState(decisionId ? state.notes[decisionId] ?? '' : '');
  const [category, setCategory] = useState(decisionId ? state.categories[decisionId] ?? 'その他' : 'その他');
  const [destructive, setDestructive] = useState<'closed' | 'deleted' | null>(null);
  const photoOption = option === 'A' || option === 'B' ? option : null;
  const committedPhoto = photoOption ? state.photoDrafts[photoOption] : null;
  const [photoSelected, setPhotoSelected] = useState(committedPhoto?.selected ?? false);
  const [cropX, setCropX] = useState(committedPhoto?.cropX ?? 0.5);
  const [cropY, setCropY] = useState(committedPhoto?.cropY ?? 0.5);
  const [respondentState, setRespondentState] = useState<'ready' | 'empty' | 'error'>('ready');

  const allowed = (() => {
    if (id === 'o01') return Boolean(photoOption);
    if (['o02', 'o03'].includes(id)) return true;
    if (id === 'o04') return fixture?.role === 'voter' && Boolean(projection.result);
    if (['o05', 'o06', 'o08', 'o09'].includes(id)) return fixture?.role === 'owner';
    if (id === 'o07') return canConfirmVoteChange(fixture, state, now, choice);
    if (id === 'o10') return Boolean(decisionId && state.decisions[decisionId]?.finalChoice && state.decisions[decisionId].review.status !== 'postponed');
    return false;
  })();

  function close() {
    if (!returnTo) return router.back();
    const preserved = Object.fromEntries(Object.entries(params).filter(([key]) => !['id', 'returnTo', 'choice'].includes(key)));
    return router.replace({ pathname: returnTo as never, params: preserved });
  }

  function confirm() {
    if (!allowed) return;
    if (id === 'o01' && photoOption) dispatch({ type: 'set-photo-draft', option: photoOption, selected: photoSelected, cropX, cropY });
    if (id === 'o02') dispatch({ type: 'set-deadline', value: deadline, customAt: deadline === '日時指定' ? customDeadline : undefined });
    if (id === 'o03') dispatch({ type: 'set-friends', ids: friends });
    if (id === 'o04' && decisionId) dispatch({ type: 'save-note', decisionId, text });
    if (id === 'o05' && decisionId && text.trim()) dispatch({ type: 'append-addendum', decisionId, text });
    if (id === 'o07' && decisionId && (choice === 'A' || choice === 'B')) dispatch({ type: 'change-vote', decisionId, choice, now });
    if (id === 'o08' && decisionId && destructive) dispatch({ type: 'set-post-state', decisionId, state: destructive });
    if (id === 'o09' && decisionId) dispatch({ type: 'set-category', decisionId, category });
    if (id === 'o10' && decisionId) dispatch({ type: 'postpone-review', decisionId, mode: postpone, customAt: postpone === 'custom' ? customReviewAt : undefined });
    close();
  }

  const invalidDate = (id === 'o02' && deadline === '日時指定' && !isFutureIso(customDeadline)) || (id === 'o10' && postpone === 'custom' && !isFutureIso(customReviewAt));
  const disabled = !allowed || invalidDate || (id === 'o03' && friends.length === 0) || (id === 'o04' && text.length > 80) || (id === 'o05' && !text.trim()) || (id === 'o08' && !destructive);

  return <Modal visible transparent animationType="slide" onRequestClose={close}><View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,.45)', justifyContent: 'flex-end' }}><View accessibilityViewIsModal style={{ backgroundColor: c.canvas, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 18, paddingBottom: 32, maxHeight: '90%' }}>
    <Text style={{ fontSize: 22, fontWeight: '800', color: c.ink }}>{id.toUpperCase()}　{titles[id] ?? '不明なシート'}</Text>
    {!allowed ? <Text accessibilityRole="alert" style={{ color: c.danger, marginVertical: 12 }}>この操作は利用できません。権限、相談状態、期限、またはURLを確認してください。</Text> : null}
    {id === 'o01' && allowed ? <><ChoiceButton label={photoSelected ? `${photoOption}のデモ写真を外す` : `${photoOption}にデモ写真を選ぶ`} selected={photoSelected} onPress={() => setPhotoSelected(!photoSelected)} />{photoSelected ? <><Text style={{ color: c.muted, marginTop: 8 }}>1:1 crop中心 X {cropX} / Y {cropY}</Text><ChoiceButton label="左上" selected={cropX === 0.25} onPress={() => { setCropX(0.25); setCropY(0.25); }} /><ChoiceButton label="中央" selected={cropX === 0.5} onPress={() => { setCropX(0.5); setCropY(0.5); }} /><ChoiceButton label="右下" selected={cropX === 0.75} onPress={() => { setCropX(0.75); setCropY(0.75); }} /></> : null}</> : null}
    {id === 'o02' ? <>{['1時間', '3時間', '1日', '1週間', '日時指定'].map((value) => <ChoiceButton key={value} label={value} selected={deadline === value} onPress={() => setDeadline(value)} />)}{deadline === '日時指定' ? <TextInput accessibilityLabel="投票終了日時" value={customDeadline} onChangeText={setCustomDeadline} style={{ minHeight: 48, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink, marginTop: 8 }} /> : null}</> : null}
    {id === 'o03' ? [['mina-demo', 'ミナ'], ['yui-demo', 'ユイ']].map(([value, label]) => <ChoiceButton key={value} label={label} selected={friends.includes(value)} onPress={() => setFriends(friends.includes(value) ? friends.filter((friend) => friend !== value) : [...friends, value])} />) : null}
    {id === 'o04' && allowed ? <><TextInput accessibilityLabel="投票者ひとこと" value={text} onChangeText={setText} maxLength={80} multiline style={{ minHeight: 80, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink }} /><Text style={{ color: c.muted }}>{text.length} / 80・ローカルのみ</Text></> : null}
    {id === 'o05' && allowed ? <><Text style={{ color: c.muted, marginVertical: 8 }}>追記は送信後に上書きしません。ローカルデモのみです。</Text><TextInput accessibilityLabel="追記" value={text} onChangeText={setText} maxLength={300} multiline style={{ minHeight: 80, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink }} /><Pressable onPress={() => router.replace({ pathname: '/sheet/o09', params: { decisionId } })} style={{ minHeight: 48, justifyContent: 'center' }}><Text style={{ color: c.ink }}>カテゴリを修正 ›</Text></Pressable><Pressable onPress={() => router.replace({ pathname: '/sheet/o08', params: { decisionId } })} style={{ minHeight: 48, justifyContent: 'center' }}><Text style={{ color: c.danger }}>終了・削除 ›</Text></Pressable></> : null}
    {id === 'o06' && allowed ? <><View style={{ flexDirection: 'row', gap: 12 }}><Pressable onPress={() => setRespondentState('ready')}><Text style={{ color: c.ink }}>表示</Text></Pressable><Pressable onPress={() => setRespondentState('empty')}><Text style={{ color: c.ink }}>空</Text></Pressable><Pressable onPress={() => setRespondentState('error')}><Text style={{ color: c.ink }}>失敗</Text></Pressable></View>{respondentState === 'ready' ? <Text style={{ color: c.ink, marginTop: 16 }}>ミナ、ユイ（架空の記名回答者）</Text> : <StatePanel kind={respondentState === 'error' ? 'error' : 'empty'} onRetry={() => setRespondentState('ready')}>{respondentState === 'empty' ? '回答者はいません。' : '回答者を読み込めませんでした。'}</StatePanel>}</> : null}
    {id === 'o07' && allowed ? <Text style={{ color: c.ink, marginVertical: 12 }}>選択を {choice} へ変更します。確定後は再変更できません。</Text> : null}
    {id === 'o08' && allowed ? <><ChoiceButton label="受付を手動終了（ローカル）" selected={destructive === 'closed'} onPress={() => setDestructive('closed')} /><ChoiceButton label="相談を削除（ローカル）" selected={destructive === 'deleted'} onPress={() => setDestructive('deleted')} />{destructive ? <Text style={{ color: c.danger, marginTop: 8 }}>{destructive === 'closed' ? '新しい票を受け付けなくなります。' : 'デモ一覧と詳細を表示不可にします。実データは削除しません。'}</Text> : null}</> : null}
    {id === 'o09' && allowed ? categories.map((value) => <ChoiceButton key={value} label={value} selected={category === value} onPress={() => setCategory(value)} />) : null}
    {id === 'o10' && allowed ? <><ChoiceButton label="7日後" selected={postpone === '7d'} onPress={() => setPostpone('7d')} /><ChoiceButton label="日時指定" selected={postpone === 'custom'} onPress={() => setPostpone('custom')} />{postpone === 'custom' ? <TextInput accessibilityLabel="延期日時" value={customReviewAt} onChangeText={setCustomReviewAt} style={{ minHeight: 48, borderWidth: 1, borderColor: c.line, borderRadius: 12, padding: 12, color: c.ink }} /> : null}</> : null}
    {id !== 'o06' ? <PrimaryButton disabled={disabled} label={!allowed ? '操作できません' : id === 'o08' ? '影響を確認して実行' : '確定'} onPress={confirm} /> : null}
    <Pressable accessibilityRole="button" onPress={close} style={{ minHeight: 48, justifyContent: 'center' }}><Text style={{ textAlign: 'center', color: c.ink }}>{allowed ? '取消' : '閉じる'}</Text></Pressable>
  </View></View></Modal>;
}
