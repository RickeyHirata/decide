# 16 公式資料

作成中確認：2026-09-10、主要技術再確認：2026-09-28（日本時間）。リンクは更新されるため着手時と提出時に再確認。SDKの最新patchを推測しない。

| 資料 | 設計への適用 |
|---|---|
| [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) | 恒常ルールと着手プロンプトを分離、既存repositoryの指示を保護 |
| [Expo SDK](https://docs.expo.dev/versions/latest/) | 互換表SDK57/RN0.86/React19.2.3、最低Node22.13。安定patchは実装時固定 |
| [Expo Router API routes](https://docs.expo.dev/router/web/api-routes/) | server機能の条件。Next分離はDECIDE側の判断 |
| [Next installation](https://nextjs.org/docs/app/getting-started/installation) | Node/Web構成と互換版確認 |
| [Supabase anonymous Auth](https://supabase.com/docs/guides/auth/auth-anonymous) | anonymousもauthenticated role。登録者判定を独立させる |
| [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) | service権限の迂回性、サーバー内認可と直接アクセス拒否 |
| [Supabase SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client) | server Auth。opaque BFF sessionはDECIDEの構成 |
| [Edge limits](https://supabase.com/docs/guides/functions/limits) | 256MB/CPU2秒等とSharp/libvips制約、画像はNodeへ |
| [PostgreSQL row locks](https://www.postgresql.org/docs/current/explicit-locking.html) | 行ロック・deadlock、統一ロック順 |
| [Expo Push](https://docs.expo.dev/push-notifications/sending-notifications/) | ticket/receipt/無効token、受理と表示を区別 |
| [Apple UGC](https://developer.apple.com/jp/app-store/review/guidelines/#user-generated-content) | 通報・ブロック・対応・連絡先の公開前確認 |
| [Apple account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) | アプリ内削除の開始、認証/関連データ確認 |
| [WCAG contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) | 通常文字4.5:1。44dpの独自タッチ目標と混同しない |

v1.2のUIを継承し、BeReal/Locket/Partiful/Snapchat/Day One等の着想を、少ない入力・友達の近況・入りやすいWeb・任意の自己表現へ落とした。今回、新たな市場規模や流行ランキングは主張していない。配色だけでZ世代支持を保証せず、R1の継続・誤操作・通知離脱で評価する。素材はdesign/assets/credits.md。架空プロフィールや票数を実利用の証拠と扱わない。
