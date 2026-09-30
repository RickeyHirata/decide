# 09 ジョブ・通知

DB transaction内でoutboxへ記録、Cron毎分dispatch、FOR UPDATE SKIP LOCKEDで最大100jobをlease（2分）。外部配信はat-least-once、dedupeKey・provider ticket・送信状態を管理。処理完了後ack、lease切れは再取得。期限は同期APIでもsettleしCron遅延を投票猶予にしない。

| job | dedupeキー | 取消・再検証 |
|---|---|---|
| media_normalize | asset+version | 削除・差替 |
| moderate_content / classify_category | subjectType+id+contentRevision | 旧版適用禁止、カテゴリ本人修正優先 |
| close_poll | post+deadlineVersion | 延長・手動終了 |
| friend_new_digest | recipient+15分枠 | block・失効・投票済み・削除 |
| unanswered_reminder | recipient+post | 延長後も累計1回、投票/期限/ACL |
| author_reaction | post+first_reaction | 3票初到達だけ、再到達再送なし |
| final_due | post+deadlineVersion | final済み/削除 |
| final_recorded | recipient+post+first | 登録投票者とR2 watch、ACL |
| outcome_updated | recipient+post+outcomeRevision | アプリ内中心、Pushは明示opt-in |
| review_first / review_last | post+finalRevision+kind | 72h/144h、回答・訂正・延期・辞退 |
| review_postponed | post+finalRevision+postponed | 延期先1回、回答・辞退・訂正 |
| dna_recompute | actor+inputVersion | 最新入力だけ表示更新 |
| delete_content | deletionRequestId | 冪等で再開、通常取消なし |

Pushは友達の新規・未回答を1人24h最大2通、15分枠でまとめる仮の初期予算。1票ごとのPush無し。3票到達作者1回。最終決断は投票した登録者へ、guestには送らない。登録時に既に結果があれば画面とアプリ内1件へ補完し、過去Pushの大量再送なし。最終決断訂正は既存アプリ内項目更新だけ、再Pushしない。

期限前通知：15分無し、1h→15分前、3h→30分前、1d→3h前、1w→24h前。customは長さ1h未満無し、1h〜3h未満15分、3h〜24h未満30分、24h〜7d未満3h、7d以上24h。未投票の対象友達だけ。15分まとめによって期限を過ぎる場合は破棄。

23:00〜08:00を初期休止、deviceの現在IANA timezoneを使用。設定で変更/解除可。focusでtimezone更新。朝に無効な未回答通知を再送せず、有効な本人対応だけまとめる。私的・匿名相談は初期Pushに質問/A/B/実名を含めず「参加した相談に更新があります」。payloadにも私的本文を含めない。privatePreviewを明示ONでも匿名作者を開示しない。

友達申請は対応、友達成立はお知らせ、拒否/解除/blockを相手へ通知しない。DNA更新はアプリ内、Push初期OFF。

Badge=未解消かつスヌーズ外の本人final/Review/友達申請件数。友達未回答と未読総数は含めない。既読だけでは減らない。Reviewは最後の予定催促+24hでBadgeを外し、後から回答できる記録は残す。defer24h、postpone/dismiss/answerで対応を解消またはスヌーズ。端末で+1せずserverが再計算。

送信直前に停止・設定・block・post可視性・invite・対象版・期限を再検査。1min/5min/30min/2h/6hの最大5再試行、意味のなくなった通知はexpired、尽きたらdead-letter運営へ。本文をjob payloadへ複製しない。Expo ticket受理≠端末表示≠開封。receipt確認、DeviceNotRegisteredでtoken停止。同一端末の別accountログインでは旧紐付け解除。配信不明再試行の二重表示を完全保証とはしない。
