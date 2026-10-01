import Link from 'next/link';
export default function Unavailable(){return <main><p className="demo">ローカルデモ — サーバー未接続</p><h1>この相談は表示できません</h1><p>リンクが無効か、相談を表示する権限がありません。削除・失効などの内部状態はここでは案内しません。</p><Link href="/">トップへ戻る</Link></main>}
