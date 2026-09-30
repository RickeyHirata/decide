# 08 API契約

機械可読定義はcontracts/openapi.json。認証provider APIを独自実装しない。Web /api、Edge function URLはadapterで吸収し、業務パスは/v1。

- 全mutationにIdempotency-Key UUID。principal+operation+keyとbody hashを保存。同じbodyは同じ論理結果、違うbodyは409。秘密の再送応答は暗号化し10分保持、失効後に古い機密データを返さない。
- 入出力camelCase、DB snake_case。未知フィールド拒否。JSON64KiB、文字列byte16KiBの外枠に、NFC書記素の業務上限を適用。
- 認証principalを本文のactorId/authorIdから受け取らない。targetActorId等の操作対象とは区別。停止・登録未完了・guest・staffを分離。
- 一覧初期20/最大50、署名付きopaque cursor、createdAt+IDで安定tie-break。日時ISO8601 UTC、IANA timezoneを別に保存。
- 投稿DTOはserverNow/revision/policyRevision/capabilities。結果の有無を推測させる不要な集計フィールドを返さない。
- 編集/状態変更はexpectedRevision。投票変更/確定はballot、Reviewはreview、延期/辞退はreviewReminder、その他post操作はpostの版。初回Review/outcome/history shareのみ子が未作成なら0、存在すれば1以上。final登録/訂正はpost版で競合検出し新しいfinal版を作る。
- 票の到着だけでpost revisionを増やさない。aggregateRevisionを別管理。source/policy/lifecycle変更でpost版を更新。
- deleteは202 operationId、利用者向けアクセス停止は同じtransactionで完了し、物理削除はjob。

| HTTP | code | UI回復 |
|---|---|---|
| 400 | INVALID_INPUT | fieldErrorsへ案内、入力保持 |
| 401 | AUTH_REQUIRED / SESSION_EXPIRED | 目的と戻り先を維持して認証 |
| 403 | SELF_VOTE / ACTION_FORBIDDEN / FEATURE_DISABLED | 安全な理由、操作終了 |
| 404 | UNAVAILABLE | 存在/失効/削除を第三者へ区別しない |
| 409 | CONFLICT / CONTENT_FROZEN / POLL_CLOSED / BALLOT_LOCKED / CLAIM_USED | 再取得、本人入力は保持 |
| 422 | MEDIA_REJECTED / MODERATION_HELD | 写真差替・確認状態 |
| 429 | RATE_LIMITED | Retry-Afterと再試行時刻 |
| 503 | TEMPORARILY_UNAVAILABLE | 同じkeyで再試行 |

error={code,message,requestId,fieldErrors?,retryAfterSeconds?}をerrorキーで包む。内部SQL・JWT・emailは返さない。

createPost→202 checking。審査でvisibleになってから公開起算。初票→mutable、結果hidden。lock/change後は非作者だけ現在集計。getPost/listFeedはdeadline settle後に投影。history previewはserverで生成し、publish時にsource/final/review/outcomeの対象版とhashを再確認。

初期rate limit（調整可能な仮値）：投稿20/24h、初票60/10min、guest Auth追加作成20/IP/10minでchallenge、note20/h（guest10/h）、report10/h同対象1件、友達申請30/24h、検索60/min、invite交換120/10min。IP補助は共有回線を考慮し、actor制限の代わりにしない。DBのwindow counterで全instance共通。冪等再送を新規投票として消費しない。

bootstrapはverified Auth principalとactorを対応させる。永久Authでもprofile/terms未完了ならregistrationComplete=false。completeRegistrationはhandle一意、規約版、年齢条件を同一transactionで保存。初期の「招待制」は募集運用を意味し、別の登録コード壁を追加してゲスト→任意登録の流れを遮らない。

削除の再認証はserver challenge→設定済みprovider/PKCE再認証→同じAuth userの新しい認証証拠の検証→単回ticket（10分）。クライアント申告時刻やaccess token refresh時のiatだけでは認めない。provider別の証拠検証はM1実認証試験の必須項目。deleteAccountはticketとactor/sessionを照合して消費し、全session失効とアクセス停止をcommitする。

自分の履歴と他者へ共有する履歴は別DTO。参加者一覧を結果DTOへ無条件に含めない。匿名作者AuthorDisplayは名前・IDの入らないunion。OpenAPIの型だけで認可を完了とみなさない。

初票後の範囲縮小では、新しいaudience_membersが旧集合の部分集合であることも確認する。friends/allへのラベル変更を、閲覧可能な友達の追加として使わせない。myOutcomeとmyHistoryShareRevisionは本人専用で、旧finalに紐付いたoutcomeの訂正・既存共有の版検証に使う。history previewはpostのexpectedRevision、publishはpreviewが返したshareRevisionを使う。共有項目が審査中の202は、第三者に公開完了した意味ではない。
