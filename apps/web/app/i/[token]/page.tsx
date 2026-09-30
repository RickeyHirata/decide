import { GuestVote } from './vote';
export default async function Invite({params}:{params:Promise<{token:string}>}){const {token}=await params;if(token!=='demo')return <main className="page"><p className="logo">DECIDE</p><h1>この相談は表示できません</h1><p>リンクが無効か、相談が公開されていません。</p></main>;return <GuestVote/>}
