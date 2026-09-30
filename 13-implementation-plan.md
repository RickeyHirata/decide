# 13 実装順序

| 段階 | 作るもの | 完了証拠 |
|---|---|---|
| M0 表示 | monorepo、tokens、33画面/10シート、fixtures、共通状態、2画面投稿、Webゲスト | 起動手順、型検査、320/390/414幅・明暗・文字倍率、操作確認。全体完成とは呼ばない |
| M1 認証/認可 | Supabase migrations、Auth/profile、友達/Follow/block、BFF session、role denial、DTO投影、再認証 | 実DB否認試験、JWT種別、guest/permanent/Auth復帰の統合。キー無しはlocal adapterまで |
| M2 相談/投票 | private media、AI job接続、create/edit/invite、投票3操作、期限settle、guest claim/merge | 競合、期限、編集凍結、失効、冪等、漏洩検査。写真/審査エラー保持 |
| M3 記録 | final/outcome/review、延期、履歴snapshot、プロフィール統計、DNA | 版競合・通知取消・旧Review分離・共有privacy・算定テスト |
| M4 運用 | Cron/outbox、Push、通知Badge、staff運営、通報/異議、削除、log redaction | job再試行、配信前ACL、実機Push、削除再試行、staff MFA |
| M5 R1統合 | 通しE2E、性能・障害・a11y、設定文書、CI | 12のR1条件。実機/外部待ちとコード不足を分離して明記 |

初期flagsは全false。R2/R3のDB型とextension pointを用意しても、未完成の機能をナビへ出さない。R1は公開閲覧と登録者投票・基本Followを含む。R2でpublic guest pilot/watch/repost、R3でPoll/remix/searchをそれぞれ追加ゲートで有効化。

CI：lint→typecheck→domain→ローカルSupabase DB/API→Web E2E→build。実機試験は別に証拠を残す。スナップショットだけで投票正当性を検証しない。競合は独立DB接続で実際に同時実行。migrationのAuth FK・default privileges・Storage policyを忘れない。

IMPLEMENTATION_STATUS.mdに段階、変更ファイル、実行コマンド/結果、未検証・外部待ち、次の作業を残す。外部鍵無しでfixtureを使う場合は画面にデモを明示、本番では設定不足で起動を拒否。AI未設定で自動allowを返さない。

新規開発で期待するroot scripts：dev:mobile / dev:web / typecheck / test:unit / test:db / test:e2e / build:web。実装したpackage managerに合った正確なコマンドをREADMEへ書く。未作成scriptを実行済みと報告しない。
