# 11 DNA・推薦・計測

Decision DNA v0.1は最近のアプリ内行動の分類。MBTI、人格・能力診断とは別。外で考えた時間、情報収集量、他人への助言の因果的貢献は観測不能なのでnullとし、架空得点を作らない。

対象はdistinct postのdecision、削除/無効化なし、最新版finalに有効Reviewあり。最近のReview30件（reviewedAt順）、旧finalのReviewやPollは含めない。0〜2蓄積、3〜4分析開始、5〜9傾向のみ、10以上は必要な比較データがある場合だけタイプ。全部neither/0票/同数なら10件でも分析中。

| 軸 | 算式 | 初期閾値 |
|---|---|---|
| 多数派との距離 | final時snapshotが3有効票以上・非同数・最終A/Bのうち少数派を選んだ割合 | 比較5件以上、0.5以上large |
| 記録までの時間 | actualClosedAt→最新版finalRecordedAtの中央値 | 10件以上、3h以下quick |
| 満足度安定 | scoreの母標準偏差 | 10件以上、2.0以下stable |

| large | quick | stable | 名称 |
|---|---|---|---|
| true | true | true | 一番星 |
| false | true | true | 舵取り |
| false | false | true | 目利き |
| true | true | false | 勝負師 |
| true | false | true | 策士 |
| false | true | false | 切り札 |
| false | false | false | 道しるべ |
| true | false | false | 開拓者 |

閾値/名称対応は実装用仮説。10件は妥当性の証明ではない。表示更新は5件の新しい有効Reviewかつ14日経過。編集だけを新規件数にしない。削除/訂正で最低条件未満なら即タイプ撤回。algorithmVersion/inputVersion/displayedAt/displayedReviewIdsを保存。平均や期限内割合は補助指標、成功率とは呼ばない。

友達フィード：認可→block/審査除外→未回答open→期限帯(1h以内/1d以内/他)→直近30日相互有効回答回数→publishedAt/id。同author連続最大2、新finalは24h優先候補、操作中に並びを飛ばさない。

発見初期スコア=0.4interest+0.2freshness+0.2follow+0.2quality。interest=(最近30投票のカテゴリ件数+1)/(対象数+11)、freshness=exp(-公開後時間h/48)、follow=0/1。qualityは閲覧50未満0.5、以上は(確定投票者+5)/(重複除外閲覧者+10)を0〜1に丸める。公開後7日まで、actor/sessionごとの露出を1回、cookie消失の完全除外は保証しない。0.0001丸め、同点は公開日時/id降順。少数候補は新しい順fallback。

20候補で同author最大2・政治社会最大4。他カテゴリ不足を政治で埋めない。明示政治カテゴリ閲覧時は比率上限を外す。政治/恋愛の選択方向から属性を推定しない。通報数だけで降格せず確認済み違反を区別。炎上・同数への加点無し。R3 Pollは別系列。

イベント：compose_started、decision_published、invite_opened、ballot_accepted、ballot_locked、final_recorded/corrected、review_saved/edited、result_returned、guest_upgraded、follow_created、notification_optout。eventId unique、server確定イベントを正本。本文/choice方向/画像/tokenをanalyticsへ入れない。result_returnedは別visit、15秒pollingを再訪と数えない。guestとaccount、public/friends、Decision/Pollを分ける。

週次有効参加者=その週に有効票を確定、または他者の回答がある自分の相談を初めてfinal記録した登録者unique。スタッフ/test除外。guest別集計。

初期検証案：6グループ×10〜15人。仮基準は初回相談の期限内3確定票60%、7日以内2件目25%、終了後7日以内final50%。成熟観測50相談以上、友達対象0〜2は3票指標から別集計し全件も併記。業界標準/成功保証ではない。R2発信者10〜20人は募集案で確保済みではない。架空票や運営催促で成功値を作らない。
