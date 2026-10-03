import Link from 'next/link';

export default function Continue() {
  return <main>
    <p className="demo">ローカルデモ — 架空データ・認証未接続</p>
    <p>元の相談</p>
    <h1>週末の旅行には、どちらのコートが合う？</h1>
    <p>登録後もゲスト時の票は1票のまま引き継がれ、投票時の匿名扱いは変わりません。</p>
    <p><strong>Apple / Google認証はこのローカルデモでは操作できません。</strong></p>
    <Link href="/i/demo">今は登録せず相談へ戻る</Link>
  </main>;
}
