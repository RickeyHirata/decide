# 07 データと認可

schema.sqlはDB骨格。clientに直接開放せず、M1/M2で実装するtransaction RPCと安全なDTOを経由する。SQLのbyte上限は異常入力の最終防壁であり、80/30等の書記素検証を代替しない。AuthとのFKは実Supabase migrationでactors.auth_user_id→auth.users(id)を追加する。

## 返却フィールドの契約

常に最初にpost可視性を検査。owner以外にchecking/held/rejected/deletedを返さない。第三者は存在しない場合と同じ404。ownerにもdeleted内容は返さない。結果をCSSで隠すだけにしない。

| 項目 | 作者・受付中 | 未投票/変更可能 | 確定した非作者 | 終了後の閲覧権限あり |
|---|---|---|---|---|
| 質問・選択肢 | 可 | 可 | 可 | 可 |
| 受付人数 | 可 | 可 | 可 | 可 |
| A/B集計 | 不可 | 不可 | 可（現在結果） | 可（最終結果） |
| 回答済みの登録者一覧 | named/choice_anonymousのみ | 不可 | 不可 | named/choice_anonymousのみ |
| 登録者の個別投票先 | 不可 | 自分だけ | 自分だけ | namedのみ |
| 他人のひとこと | 不可 | 不可 | 不可 | 審査済みのみ、方式に合わせ匿名化 |
| 自分の票/ひとこと | 自票なし | 自分だけ | 自分だけ | 自分だけ |
| 作者のReview・旧決断版 | 作者のみ | 不可 | 不可 | 作者のみ。共有snapshotは別 |

publicはparticipation_hidden固定で、上表の登録者一覧と個別先を作者にも返さない。guest originの票とメモは登録後も匿名。countと比率だけを返す。匿名作者のAuthorDisplayはkind=anonymous,labelだけで、id/handle/avatar/profile linkを含めない。本人にはisOwnerを返すがraw author_idを必要なく広げない。

友達は投稿時snapshot AND 現在の友達 AND blockなし。friends_linkはこれに「現在有効なgrant」をOR。block判定はリンクより優先。ただし公開投稿はログアウト閲覧が可能で、blockでインターネット全体から消せるとは説明しない。元の私的な投稿がリンク失効しても、以前の投票や登録を永久閲覧権限にしない。

## 招待・ゲスト統合

invite tokenは暗号学的乱数32bytes以上、DBはdigestのみ。生tokenは最初の表示/再生成時のみ返し、URLにあるtokenは交換後history.replaceStateで除去。Referrer-Policy:no-referrer、アクセスログredaction、OGPは限定投稿では一般文だけ。交換grantの有効期限は24h、invite失効/policy revision変更で即拒否。長期に有効な元リンクを再度開けば再交換できる。

Webではgrantをserver sessionへ保持し、APIへX-Invite-Grantで渡す。NativeはSecureStore。ブラウザーJSにAuth refresh tokenを渡さない。grant自体は投票者本人の認証ではない。投票時のactorはverified anonymous Authまたはregistered Authから決める。

登録前にguest+post+flowに紐付けた単回claimを作る（10分、DB digest）。登録後、同一flowとguest証明、現在のaccount JWTをサーバーで検証。自動Auth昇格なら同じuser IDを維持。既存accountとの衝突はdocs05のmergeで処理。既存account票優先、guest票移管は時刻/変更回数/origin維持、作者への統合は自己票無効。claim失効やcancelでは票を消さず、引き継げなかったことを説明する。生claimをanalyticsへ出さない。

## 画像・履歴

Storageは全画像private。原本は運営処理だけ。GET mediaは親post/履歴snapshot/profileの現在ACLを確認し、EXIF除去した派生画像をproxy配信、no-store。asset pathに作者IDを含めない。元sourceが非公開でも、その画像を含めた本人の履歴snapshotを明示公開した場合は、そのsnapshotを親として限定された派生画像だけ配信する。元post閲覧は許可しない。失効後の再要求は拒否するが、閲覧者が既に保存したコピーの遠隔削除は保証しない。

履歴共有はserver生成whitelist：質問、A/Bと公開を確認した写真、本人のfinal、選択したoutcome/score/reviewNoteだけ。ballots/responders/notes/invite/authorIdを入れない。previewHashは対象revisionと選択フィールドに紐付ける。範囲縮小/削除/final訂正/共有対象メモ変更でenabled=false、selfへ戻す。

## DB不変条件

actorごとの有効票はpostとunique。A/Bはそれぞれ1行、post作成と2行を同一transactionにする。first_vote_ever_atは一度だけ。初票後の本文・写真・方式・期限手動変更禁止、scope縮小だけ可。final/reviewはpostとfinal revisionで結ぶ。旧Reviewを最新finalへ付け替えない。notifications/jobsはdedupe key、idempotencyはprincipal+operation+key一意。functionsは固定search_path、動的SQLへ利用者入力を連結しない。

公開APIでは停止状態と登録完了を毎回確認。運営APIはstaff_membersに在籍しMFAのaal2を検証。service key保持だけで運営ユーザーとして扱わない。一般ユーザーの通報文にある命令で運営権限やAIのポリシーを変えない。
