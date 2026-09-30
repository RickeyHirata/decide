import type { Metadata } from 'next';import './style.css';
export const metadata:Metadata={title:'DECIDE',description:'二択の相談に参加する'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ja"><body>{children}</body></html>}
