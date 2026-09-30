# 14 セットアップ・公開前ゲート

今すぐ実装を始めるにはこの一式、Node24、Gitとpackage managerがあればよい。実DB統合はSupabase CLI＋Docker互換環境。iOS buildは対応macOS/Xcodeまたは設定済みbuild環境。鍵が無くてもM0とローカル実装を止めない。

| 必要な実値 | 必要になる地点 | 未設定時 |
|---|---|---|
| Supabase URL/publishable/server secret | 実接続 | localプロジェクト、fixtureを区別 |
| Apple Team/Bundle/Service ID・鍵・redirect | Apple認証/配布 | 実機認証未検証 |
| Google OAuth client IDs・redirect | Google認証 | 実認証未検証 |
| Web/API公開domain | Universal/App Links、OAuth、OGP | localhost、架空domainを登録しない |
| Expo/EAS project ID、APNs/FCM | Push/native build | アプリ内通知/job試験は進める |
| AI provider/model/key | 本文審査/分類 | 分類Other、審査held |
| 運営者・連絡先・規約・Privacy・対象年齢 | ベータ外部提供 | ゲートを閉じる |
| 通報担当・保持/backup方針 | ベータ外部提供 | 本番対応済みとしない |

development/staging/productionは別projectとsecret。実データをstagingへ丸ごとコピーしない。clientへ渡すのはpublishable値だけ、server secret/AI key/暗号鍵をGit・ログ・画像へ出さない。env.example空欄は未設定で有効値ではない。

公開ゲート：R1 flags既定値、demo無効、DB/API/画像の認可、OAuth復帰/guest統合、block/report/account delete、private bucket、CSRF/CORS/log redaction、実機Push、通しフロー、運営当番と実規約、素材権利、backup復元/job再開、提出時のストア要件・年齢レーティング・データ申告。

設計目標（未実測）：getPost p95 800ms、投票commit p95 1s。負荷試験は同時100閲覧、同一post20投票/秒×5分、重複・権限漏洩無しを優先。X規模対応済みとは言わない。DB lock待ち、画像転送、anonymous Auth、AI費用、通報滞留を測り必要箇所を拡張する。

この依頼は契約/購入、実ドメイン登録、外部招待送信、ストア提出、本番公開を含まない。開発の準備不足と、公開に必要な本人の実値を混同しない。
