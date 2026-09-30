# 12 受入条件

以下は実装時の完了条件で、現在の合格一覧ではない。今回実行した検証だけをverification/REPORT.mdに記す。U=純粋関数、D=実DB/RPC、I=API/Auth統合、E=端末/Web、O=運用。PGlite上のSQL制約検査はSupabase Auth/複数接続の競合試験の代わりではない。

| ID | 条件と期待結果 | 試験/段階 |
|---|---|---|
| T01 | anon/authenticatedから全業務テーブルとserver専用RPCへの直接アクセス拒否 | D/I M1 |
| T02 | 改ざん/期限切れ/別project JWT、停止actor拒否。guestをaccount扱いしない | I M1 |
| T03 | bootstrap並列でもactor1件、永久Auth登録未完了は投稿不可 | D/I M1 |
| T04 | 同意版・年齢条件・handle一意、認証取消後の元画面復帰 | I/E M1 |
| T05 | friends=snapshot×現関係、新しい友達に過去投稿を開放しない | U/I M1 |
| T06 | 有効grantだけリンク閲覧、推測ID/失効/不存在は同じ404 | U/I M2 |
| T07 | リンク再生成/縮小でgrant・画像・通知・再送応答・共有記録を失効 | I M2 |
| T08 | block双方Friend/Follow解除、アクセス/通知制限、解除で復元なし | I M1 |
| T09 | 匿名作者がDTO/media path/log/OGP/analytics/Realtimeに漏れない | I M2 |
| T10 | public参加者を作者にも非表示、個別投票先の逆引き不可 | U/I M2 |
| T11 | 履歴共有に本人記録だけ、元post/票/他者メモの権限拡大無し | U/I M3 |
| T12 | 他者プロフィール集計に私的/匿名履歴が入らない | I M3 |
| T13 | 2画面投稿、必須3欄、4初期値、公開方式固定 | E M0/M2 |
| T14 | NFC/ZWJ/結合文字/IME/80/30/300境界、重複A/B・空白拒否 | U/I/E M2 |
| T15 | 分類失敗Other、本人修正優先、審査失敗held | I M2/M4 |
| T16 | 同一key同bodyは1件、別body409、失効後秘密再送なし | D/I M2 |
| T17 | 同一actor並列投票でも有効1票、自票拒否 | D/I M2 |
| T18 | 初票と本文編集の競合で投票対象内容を保持 | D M2 |
| T19 | 全票無効後もfirstVoteEverAt保持、自由編集へ戻らない | U/D M2 |
| T20 | A/B各1、option移動/削除再作成による凍結回避不可 | D M2 |
| T21 | mutableでも受付人数増、作者には中間集計無し | U/I M2 |
| T22 | 299.999秒変更可、300秒不可、即確定/変更/終了でlocked | U/D M2 |
| T23 | 同choice再送は変更不消費、別choice1回で確定、再変更不可 | U/D M2 |
| T24 | 端末時計不使用、ロック待ち後server clockで判定 | D/I M2 |
| T25 | 確定非作者だけ中間集計、他人のメモと選択アイコンは終了後 | U/I/E M2 |
| T26 | 0/1/2/3/大量票、同数、割合合計100、0票は回答なし | U/E M2 |
| T27 | 追記300/総1500、時刻、上書き禁止、削除placeholder | I/E M2 |
| T28 | 投票者note80/1件/編集なし/削除後再作成なし、guest匿名審査 | I M2 |
| T29 | 公開時起算、審査中の指定期限超過は公開しない | U/I M2 |
| T30 | 0票延長1回4種、15分/custom/manual無し、固定final超過無し | U/D M2 |
| T31 | Cron遅延時も旧期限起算、延長後期限も過ぎれば同時終了 | U/D M2 |
| T32 | 期限ちょうどの投票/延長/手動終了並列、重複処理なし | D M2 |
| T33 | final日付は実終了日基準、JST日跨ぎ/IANA/DST/うるう日 | U/D M2 |
| T34 | 閲覧にguest Auth不要、投票前にApple/Google要求なし | I/E M2 |
| T35 | guest多重抑止/rate limit、共有IPの全員を同一人としない | I/O M2 |
| T36 | guest新規登録で時刻/変更回数/anonymous origin不変 | U/I M2 |
| T37 | guest既存account統合は登録票優先、有効票増加なし | U/D/I M2 |
| T38 | 作者への統合は自己票無効、締切再開無し、claim単回 | U/D/I M2 |
| T39 | OAuth cancel/expiry/別flow/別user/再読込、無断票移管無し | I/E M2 |
| T40 | R1でR2/R3の直APIもFEATURE_DISABLED | I M2/M5 |
| T41 | 作者だけ終了後final A/B/neither、0票可、undecidedはfinal無し | U/I M3 |
| T42 | 同choice再送非訂正、別choice新版、日上限、旧Review分離 | I M3 |
| T43 | outcome80+1写真、訂正前outcomeを新版へ流用しない | I/E M3 |
| T44 | Review72h/144h、早期回答取消、neither対象/undecided対象外 | U/I M3/M4 |
| T45 | Review初期null、1〜10整数、初回revision0・編集最新revision | U/I/E M3 |
| T46 | 延期1回7d/custom180d、元催促取消、辞退後回答可 | U/I M3/M4 |
| T47 | final訂正とReview競合で旧版409、入力保持 | D/I M3 |
| T48 | history preview後版更新→publish409、共有対象変更→self | I/E M3 |
| T49 | DNA各件数/比較不足/recent30/8タイプ対応 | U/I M3 |
| T50 | DNA更新5件AND14d、編集非新規、削除で即条件再判定 | U/I M3 |
| T51 | 旧final/review版は本人のみ。他者DTOへ含めない | I/E M3 |
| T52 | transaction outbox/lease/retry/dedupe、失敗投票の通知無し | D/I M4 |
| T53 | 登録投票者通知、claim後判定、失効/block/削除後送信禁止 | I M4 |
| T54 | 1票Push無し、3票初到達1回、quiet/digest/締切前1回 | U/I M4 |
| T55 | Badge=未解消対応、既読別、解決/保留/Review期限で減る | I/E M4 |
| T56 | Expo ticket≠端末受領、receipt/無効token/配信不明 | I/O M4 |
| T57 | AI旧版結果を新内容へ適用しない。失敗時自動allow無し | I M4 |
| T58 | 通報数だけで削除しない。異議/staff MFA/監査 | I/E/O M4 |
| T59 | 匿名24h/友達3/168h5/checking含む1、削除・競合回避不可 | D/I M2/M4 |
| T60 | 原本/EXIF/private画像漏洩無し、サイズ/画素/MIME/期限検査 | I M2/M4 |
| T61 | decode/審査失敗で他入力保持、重い画像処理を同期投票に入れない | I/E M2 |
| T62 | 削除再認証ticket10分単回、client時刻/refresh iatで代替不可 | I/E M1/M4 |
| T63 | 削除直後アクセス拒否、物理削除再試行/通知取消 | I/O M4 |
| T64 | CSRF/Origin/CORS/XSS/open redirect/cookie/PKCE、secret無し | I M1/M5 |
| T65 | 同時100閲覧・20票秒5分、重複無し、lock待ち/p95記録 | I/O M5 |
| T66 | backup復元/job停止再開/flags OFFへの縮退 | O M5 |
| T67 | 33画面10シートの遷移/戻る/権限/主操作/失敗状態 | E M0/M5 |
| T68 | 320/390/414、明暗、長文、200%文字、片側写真に横切れ無し | E M0/M5 |
| T69 | 44dp、色以外の手掛かり、focus/読み上げ/Reduce Motion | E M0/M5 |
| T70 | keyboard/IMEでCTA到達、sheet focus/復帰、エラー入力保持 | E M0/M5 |
| T71 | loadingに架空0票無し、empty/error/unavailable回復 | E M0/M5 |
| T72 | 新規相談→外部Web票→確定→本人final→Review→履歴→削除 | I/E M5 |

R2追加：canonical再共有の失効連動、watch明示同意/Push初期OFF、公開guest投稿allowlist。R3追加：Pollにfinal/Review/DNA無し、remixは許可された文字だけ（写真/票/私的内容無し）、検索は自分の権限内。R1合格をこれらの合格として代用しない。
