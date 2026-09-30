# 04 デザインシステム

v1.2の白黒・ライム・ライラックを採用する。Z世代全員に好まれることを実証した配色とは呼ばない。画面の主役は作者・質問・A/B・本人の決断。プロフィールと共有面で自己表現を強め、通常操作の装飾は抑える。

正確な値は `design/tokens.ts` と `design/tokens.json`。表示状態・公開範囲・DNA判定を色の定数へ混ぜない。

| 要素 | 固定する値・挙動 |
|---|---|
| Light / Dark | OS設定を初期値。canvas #FFF / #101113、ink #111214 / #F5F5F7 |
| A / B | A面 #ECF3CE / #343E23、B面 #E9E1FF / #383049。左A・右B固定 |
| ブランド | #D5FF45、文字 #152000。＋・選択・小さい決断スタンプに限定 |
| 余白 | 4/6/8/12/14/16/18/24/32。画面左右18、幅360未満14、A/B間6 |
| 角丸 | 入力12、主CTA14、選択肢18、特別な決断面20 |
| 質問 | 25sp/35、800、左揃え、全文折返し |
| 選択肢 | 写真あり19/27・700、写真なし26/36・700 |
| 本文 | 16/24・400、ラベル14/20・600、補助12/18・400 |
| タップ | 独立44dp、通常48dp、主CTA52dp以上 |
| アイコン | Lucideの一貫したセット、24/20。アイコンのみの操作に読み上げ名 |
| 動き | press100ms、state160ms、sheet240ms。Reduce Motionは0 |
| 写真 | A/B各1:1、cover、crop位置調整、拡大は別操作 |
| 下部ナビ | 本体56dp+bottom safe area。作成中はキーボードと重ねない |

日本語はOS標準フォント。ブランドの大きい英字は装飾で、表示名とは別の必須入力を作らない。幅320dpや文字倍率1.5以上ではA/Bを縦積み可能とし、順番と同面積を保つ。320〜430dpで横スクロール無し、タブレットの投稿幅上限560dp。画像のcropは比率を保ち、テキストは画像上に焼き込まない。

## コンポーネント契約

| component | 入力 | 出力・責務 |
|---|---|---|
| AuthorRow | authorDisplay、audienceLabel、publishedAt | 匿名時にプロフィールリンクを作らない |
| DecisionPair | options、myBallot、result | 同じ幅と高さ、選択枠+チェック、拡大独立 |
| VoteConfirmation | canChange、mutableUntil | 確定CTAと一回変更の説明 |
| VoteResult | phase、a、b、total | 現在/最終を明記、0票・同数、率合計100 |
| FinalDecisionBlock | choice、revision、authorDisplay | 本人が選んだ方を示す。多数派の勝者と混同しない |
| SettingsSummary | audience、endAt、finalDueAt、voteMode | 具体的日時、設定変更の入口 |
| ScorePicker | nullまたは整数1〜10 | 5×2、色+枠+読み上げ、初期点数なし |
| HistoryEntry | share projectionまたはowner record | 版・日付・本人の選択と満足度 |
| DNAState | progress/trend/type/insufficient | 件数と算定できる事実だけ |
| FeedbackState | loading/empty/error/held/unavailable | 入力を失わせず次の操作を示す |

## 写真と素材

受信上限1画像10MiB、最大24MP、JPEG/PNG/WebP。HEICは端末でJPEGへ変換してから送る。原本はprivate bucketに保持。利用者向け画像はEXIF・GPSを除去した派生画像のみ配信する。クロップ前の表示用画像を保持するので後から位置を調整できる。生原本URLをゲスト/他人/OGPに渡さない。

配信用の長辺は最大2048px、フィード1:1は1080pxまで。原本と派生は別キー。ファイル名はランダムで作者IDや本文を含めない。公開範囲にかかわらず保存bucketはprivateとし、07の画像プロキシで返す。

`design/assets/` の写真は設計見本限定。人物は架空プロフィールの表現で、利用・推薦の証拠ではない。`credits.md` に出典を保持。本番の初期ユーザーとして投入しない。

## アクセシビリティとローカライズ

通常文字4.5:1、主要な操作境界3:1を設計目標とする。lineは装飾線であり、入力の唯一の境界にしない。色だけでA/B・選択・エラーを表現しない。写真そのもののコントラストを定数検証で保証しない。

日本語テキストは翻訳キーへ集約する。A/Bラベル以外の英語で操作を置き換えない。スクリーンリーダー順序は作者→範囲→質問→A→B→状態→主CTA。秒単位の残時間を毎秒読み上げない。200%文字・VoiceOver/TalkBack・キーボード・Safe Areaは実機確認が必要。
