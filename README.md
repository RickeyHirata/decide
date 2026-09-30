# DECIDE — Codex実装引き渡し v1.5

完成版：2026-09-28（日本時間）。基準はユーザー提示MVP v1.0、UI v1.2、承認済み成長方針v1.3、直前の改訂v1.4。今回の依頼に基づき、実装に必要な未定義部分を確定した統合仕様です。実アプリの実装完了・公開・ユーザーテスト完了を意味しません。

## 使い方

1. このフォルダーを、Codexから参照できる作業フォルダーに展開してください。既存プロジェクトでは `handoff/decide-v1.5/` などへ置きます。既存のファイルを上書きする必要はありません。
2. `CODEX_START_PROMPT.md` の「貼り付けるプロンプト」をCodexへ送ってください。ファイル添付を使う場合は、この一式も添付します。
3. Codexは仕様を読み、既存リポジトリがあれば確認してから、M0→M5の順に実装します。新規ならTypeScriptのモノレポを作ります。

認証キーや公開ドメインが未準備でも、画面、純粋な業務ロジック、ローカル用DB、API、テストの実装に着手できます。実サービスへ接続する際に必要な設定は `docs/14-setup-release.md` に分けています。

## 読む順序

| ファイル | 役割 |
|---|---|
| `CODEX_START_PROMPT.md` | そのまま送る着手指示 |
| `AGENTS.md` | 実装中に守る短い恒常ルール |
| `docs/01-product-contract.md` | 実装の基準仕様・段階別範囲 |
| `docs/02-screen-flow.md` / `03-screen-spec.md` | 画面遷移・各画面の操作と状態 |
| `docs/04-design-system.md` / `design/` | 配色・寸法・画面見本・素材 |
| `docs/05-state-machines.md` | 投票・期限・決断・振り返りの状態 |
| `docs/06-architecture.md` / `07-data-security.md` | 技術構成・DB・認可 |
| `docs/08-api-contract.md` / `contracts/openapi.json` | API入力・出力・エラー |
| `docs/09-jobs-notifications.md` | Cron・通知・再送・取消 |
| `docs/10-moderation-privacy.md` | 投稿審査・通報・削除 |
| `docs/11-dna-ranking-analytics.md` | DNA・フィード・計測の算定 |
| `docs/12-acceptance-test-plan.md` | 実装完了の検証条件 |
| `docs/13-implementation-plan.md` | M0〜M5の依存と完了条件 |
| `docs/14-setup-release.md` | 接続設定・運用・公開前の作業 |
| `docs/15-decisions-and-traceability.md` | 旧仕様との差分と判断理由 |
| `docs/16-source-notes.md` | 公式資料と確認日 |
| `verification/REPORT.md` | この一式で実際に検証した範囲 |

`design/screen-catalog.html` はブラウザーで開ける画面設計見本です。架空データを使い、サーバーには接続しません。`design/reference-v1.2/` は見た目の参考です。画像内の件数・文言・古い挙動より、v1.5の本文仕様を優先してください。

`reference/` は重要な境界条件を実行可能にした参照コードです。APIサーバーや認可済みデータ取得の代用品ではありません。`contracts/schema.sql` は制約と非公開のDB骨格で、業務RPCを実装する前にクライアントへ開放してはいけません。

## 同梱の検証

Node.js 24以降で、外部サービスへ接続せず実行できます。

```sh
node --test tests/*.test.mjs
python3 tools/verify_bundle.py
```

TypeScript型検査、SQL適用、画面見本の検査を行った場合の結果は `verification/REPORT.md` に記載しています。未実施の実機・OAuth・Push・本番RLS試験を合格扱いにしないでください。

このパッケージが実装の正本です。過去のv1.1等を追加で探したり、矛盾するルールを混在させたりする必要はありません。
