# 15 差分と判断

ユーザー提示MVP v1.0→UI v1.2→承認された成長方針v1.3→追加検討v1.4を統合し、今回の実装準備依頼で未定義部分を具体化したv1.5。新しく決めたことを過去に承認済みだったと装わない。旧v1.1の未承認提案と参考画像内の古い挙動は採用しない。

| 論点 | v1.5の結論と理由 |
|---|---|
| 1画面投稿案 | 2画面維持。設定確認と元の承認仕様を優先 |
| 終了まで全員結果不可案 | 確定した非作者は途中集計可。作者は終了まで不可。「確定して結果を見る」と整合 |
| 10分だけfinal訂正案 | 時間制限無し・版付き・直近24時間で3回。古いReviewを新決断の評価にしない |
| 公開投票の匿名性 | 参加者自体を非表示固定。センシティブな参加履歴を保護 |
| guestひとこと不可案 | リンクguestも1件、常時匿名、審査/rate厳格化 |
| 選択友達＋匿名相談 | 匿名はfriends/allだけ。小人数の指名で匿名性を失いやすいため |
| 履歴公開 | 本人の確認した記録snapshotだけ。友達の票・メモを公開しない |
| 登録でguestを記名化 | origin維持。登録を匿名解除や追加票として扱わない |
| 0票延長とfinal逆転 | 相対期限は実終了起算、固定finalを越える延長禁止 |
| 0票終了後の元本文 | 終了後は固定。投票が無くても決断の対象を後から変えない |
| 3日後では結果不明 | Review1回延期と催促辞退、後から回答可 |
| DNA10件なら必ずタイプ | 比較可能データも要求。観測できない情報収集量等を推測しない |
| 通知Badge | 本人final/Review/申請だけ。友達未回答で埋めない |
| 配色 | 白黒を基盤、A lime/B lilac、顔と投稿を主役。古いbeige路線に戻さない |

v1.4の成長案は段階化：選択友達・15分・その後はR1、watch/再共有/公開guest pilot/フォロー強調はR2、Poll/許可した二択remix/自分の全文検索はR3。R1にも公開閲覧/登録者投票/基本Followは残す。DM/一般コメント/動画/広告課金を追加しない。

新規の技術決定：Expo mobile＋小さいNext BFF、private schema＋server RPC、guest Authと短期claim、投稿ロック後server clock、別DTO、revision、Node画像worker、outbox、実装用DNA3軸、M0〜M5。根拠はdocs06〜11、公式資料は16。

| 基準 | 画面 | 中心API | DB | テスト |
|---|---|---|---|---|
| P02投稿 | S05〜08 | create/edit/media | posts/options/assets | T13〜20/29/60 |
| P03範囲 | S06/08/25 | getPost/invite | audience/grants | T05〜12/59 |
| P04投票 | S08/09/W01 | cast/change/lock | ballots/notes | T17〜26/34〜40 |
| P05期限 | S06/08/10 | close/get | posts/jobs | T29〜33 |
| P06編集 | S05/O05/O09 | append/category | addenda/posts | T18〜20/27 |
| P07決断 | S10/11 | final/outcome | final_revisions/outcomes | T41〜43 |
| P08Review | S12/O10 | review/postpone | reviews/reminders | T44〜47 |
| P09履歴 | S14〜19 | history/dna | shares/dna_snapshots | T48〜51 |
| P10関係 | S20/21/27 | friend/follow/block | relationship tables | T08/28 |
| P11運用 | S26/28/A01/02 | reports/admin/delete | moderation/jobs | T52〜66 |

市場PMF、Z世代支持、広告収益、心理尺度としてのDNA、X規模性能は未実証。18+日本招待ベータは運用初期案、法務/実規約/連絡先/通報当番は公開前ゲート。これらを口実にローカルの実装を止めない一方、本番完成済みと報告しない。
