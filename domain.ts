/** Pure reference policy; trusted inputs are built by the verified server adapter.
 * This does not implement DB transactions, OAuth, row fetching or a complete API DTO.
 */
export type Choice='A'|'B';
export type FinalChoice=Choice|'neither';
export type Audience='friends'|'friends_link'|'public';
export type Duration='15m'|'1h'|'3h'|'1d'|'1w'|'custom';
export interface Post {id:string;authorId:string;audience:Audience;anonymous:boolean;voteMode:'named'|'choice_anonymous'|'participation_hidden';publication:'visible'|'checking'|'held'|'rejected'|'deleted';state:'open'|'closed';duration:Duration;endsAt:number;closedAt:number|null;extensionUsed:boolean;firstVoteEverAt:number|null;fixedFinalDueAt:number|null;revision:number;}
export interface Access {actorId:string|null;friendAtPublish:boolean;friendNow:boolean;blocked:boolean;validGrant:boolean;registered:boolean;publicGuestAllowed:boolean;}
export interface Ballot {postId:string;actorId:string;choice:Choice;origin:'account'|'guest';firstAt:number;lockedAt:number|null;changes:0|1;validity:'valid'|'invalid'|'merged';revision:number;}
export const MINUTE=60_000,HOUR=60*MINUTE,DAY=24*HOUR;
export const segmenter=new Intl.Segmenter('ja',{granularity:'grapheme'});
export function normalizeText(s:string,multiline=false):string{return s.normalize('NFC').replace(/\r\n?/g,'\n').replace(multiline?/$^/g:/\n/g,' ').trim();}
export function graphemeCount(s:string):number{return [...segmenter.segment(s.normalize('NFC'))].length;}
export function validatePostText(q:string,a:string,b:string,context=''):{question:string;A:string;B:string;context:string}{
 const values={question:normalizeText(q),A:normalizeText(a),B:normalizeText(b),context:normalizeText(context,true)};
 for(const [key,max] of [['question',80],['A',30],['B',30],['context',300]] as const){if((key!=='context'&&!values[key])||graphemeCount(values[key])>max)throw Error('INVALID_INPUT:'+key);}
 if(values.A===values.B)throw Error('DUPLICATE_OPTIONS');return values;
}
export function canView(p:Post,a:Access):boolean{
 if(p.publication==='deleted')return false;if(a.actorId===p.authorId)return true;
 if(a.blocked||p.publication!=='visible')return false;
 return p.audience==='public'||(a.friendAtPublish&&a.friendNow)||(p.audience==='friends_link'&&a.validGrant);
}
export function tally(p:Post,bs:Ballot[]){const valid=bs.filter(b=>b.postId===p.id&&b.validity==='valid');const a=valid.filter(b=>b.choice==='A').length;return {a,b:valid.length-a,total:valid.length,guestOrigin:valid.filter(b=>b.origin==='guest').length};}
export function settle(p:Post,bs:Ballot[],now:number):Post{
 const x={...p};if(x.state==='closed'||now<x.endsAt)return x;
 const extension:Partial<Record<Duration,number>>={'1h':HOUR,'3h':3*HOUR,'1d':DAY,'1w':DAY};const delta=extension[x.duration];
 if(!x.extensionUsed&&tally(x,bs).total===0&&delta&&(x.fixedFinalDueAt===null||x.endsAt+delta<=x.fixedFinalDueAt)){x.endsAt+=delta;x.extensionUsed=true;x.revision++;}
 if(now>=x.endsAt){x.state='closed';x.closedAt=x.endsAt;x.revision++;}return x;
}
export function ballotState(p:Post,b:Ballot,now:number):'mutable'|'locked'{return b.lockedAt!==null||b.changes===1||p.state==='closed'||now>=p.endsAt||now>=b.firstAt+5*MINUTE?'locked':'mutable';}
export function canEditSource(p:Post):boolean{return p.state==='open'&&p.firstVoteEverAt===null&&p.publication!=='deleted';}
export function cast(p:Post,a:Access,bs:Ballot[],choice:Choice,now:number):{post:Post;ballot:Ballot}{
 const x=settle(p,bs,now);if(!canView(x,a))throw Error('UNAVAILABLE');if(a.actorId===x.authorId)throw Error('SELF_VOTE');if(!a.actorId)throw Error('AUTH_REQUIRED');
 if(!a.registered&&!(x.audience==='friends_link'&&a.validGrant)&&!(x.audience==='public'&&a.publicGuestAllowed))throw Error('ACTION_FORBIDDEN');
 if(x.state==='closed'||x.publication!=='visible')throw Error('POLL_CLOSED');if(bs.some(b=>b.postId===p.id&&b.actorId===a.actorId&&b.validity==='valid'))throw Error('ALREADY_VOTED');
 const ballot:Ballot={postId:p.id,actorId:a.actorId,choice,origin:a.registered?'account':'guest',firstAt:now,lockedAt:null,changes:0,validity:'valid',revision:1};
 x.firstVoteEverAt??=now;return {post:x,ballot};
}
export function change(p:Post,b:Ballot,choice:Choice,now:number):Ballot{if(b.validity!=='valid'||ballotState(p,b,now)==='locked')throw Error('BALLOT_LOCKED');if(choice===b.choice)return {...b};return {...b,choice,changes:1,lockedAt:now,revision:b.revision+1};}
export function lock(p:Post,b:Ballot,now:number):Ballot{if(b.validity!=='valid')throw Error('ACTION_FORBIDDEN');if(b.lockedAt!==null)return {...b};return {...b,lockedAt:Math.min(now,b.firstAt+5*MINUTE,p.closedAt??p.endsAt),revision:b.revision+1};}
/** Caller settles expired deadlines before offering a manual close. */
export function manualClose(p:Post,now:number):Post{if(p.state==='closed')return {...p};return {...p,state:'closed',closedAt:Math.min(now,p.endsAt),revision:p.revision+1};}
export function resultProjection(p:Post,a:Access,bs:Ballot[],now:number){
 if(!canView(p,a))throw Error('UNAVAILABLE');const mine=bs.find(b=>b.actorId===a.actorId&&b.postId===p.id&&b.validity==='valid');
 if(p.state!=='closed'&&(a.actorId===p.authorId||!mine||ballotState(p,mine,now)!=='locked'))return {kind:'hidden' as const};
 return {kind:'available' as const,phase:p.state==='closed'?'final':'current',...tally(p,bs)};
}
export function percentages(a:number,b:number):{a:number;b:number;label:string}|null{if(!Number.isInteger(a)||!Number.isInteger(b)||a<0||b<0)throw Error('INVALID_COUNT');if(a+b===0)return null;const ap=Math.round(a/(a+b)*100);return {a:ap,b:100-ap,label:a===b?'同数':'投票結果'};}
export function authorProjection(p:Post,viewerId:string|null){return p.anonymous?{kind:'anonymous',label:'匿名の友達',isOwner:viewerId===p.authorId}:{kind:'named',id:p.authorId,isOwner:viewerId===p.authorId};}
export function participantProjection(p:Post,viewer:Access,bs:Ballot[]){if(!canView(p,viewer))throw Error('UNAVAILABLE');if(p.voteMode==='participation_hidden'||(p.state==='open'&&viewer.actorId!==p.authorId))return [];
 return bs.filter(b=>b.postId===p.id&&b.validity==='valid'&&b.origin==='account').map(b=>p.state==='closed'&&p.voteMode==='named'?{id:b.actorId,choice:b.choice}:{id:b.actorId});}
export function mergeGuest(p:Post,guest:Ballot,existing:Ballot|null,accountId:string):{guest:Ballot;account:Ballot|null}{
 if(accountId===p.authorId)return {guest:{...guest,validity:'invalid'},account:existing};
 if(existing?.validity==='valid')return {guest:{...guest,validity:'merged'},account:{...existing}};
 return {guest:{...guest,validity:'merged'},account:{...guest,actorId:accountId,origin:'guest',revision:guest.revision+1}};
}
export function historyProjection(input:{anonymous:boolean;question:string;A:string;B:string;final:FinalChoice;score?:number;note?:string;responders?:unknown;votes?:unknown},include:{score:boolean;note:boolean}){
 if(input.anonymous)throw Error('ACTION_FORBIDDEN');return {question:input.question,A:input.A,B:input.B,final:input.final,...(include.score&&input.score!==undefined?{score:input.score}:{}),...(include.note&&input.note?{reviewNote:input.note}:{})};
}
function localParts(ms:number,zone:string){const x=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(ms);return Object.fromEntries(x.filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)])) as Record<string,number>;}
export function finalDue(closedAt:number,preset:'immediate'|'same_day'|'next_day'|'3d'|'1w'|'custom',zone:string,custom?:number):number{
 if(preset==='immediate')return closedAt;if(preset==='custom'){if(custom===undefined||custom<closedAt)throw Error('INVALID_DEADLINE');return custom;}
 const p=localParts(closedAt,zone),days={same_day:0,next_day:1,'3d':3,'1w':7}[preset];const target=Date.UTC(p.year,p.month-1,p.day+days,23,59,59);let guess=target;
 for(let i=0;i<4;i++){const z=localParts(guess,zone);const represented=Date.UTC(z.year,z.month-1,z.day,z.hour,z.minute,z.second);const delta=target-represented;if(!delta)return guess;guess+=delta;}throw Error('INVALID_LOCAL_TIME');
}
export function reviewSchedule(finalAt:number,opts:{answered?:boolean;dismissed?:boolean;postponedAt?:number}={}){return opts.answered||opts.dismissed?[]:opts.postponedAt!==undefined?[opts.postponedAt]:[finalAt+3*DAY,finalAt+6*DAY];}
export function postpone(now:number,count:number,custom?:number){if(count!==0)throw Error('ALREADY_POSTPONED');const at=custom??now+7*DAY;if(at<=now||at>now+180*DAY)throw Error('INVALID_DEADLINE');return at;}
export function quietTime(now:number,zone:string,start=23*60,end=8*60){const p=localParts(now,zone),m=p.hour*60+p.minute;return start===end?false:start<end?m>=start&&m<end:m>=start||m<end;}
export interface DnaEntry {postId:string;intent:'decision'|'poll';current:boolean;deleted:boolean;final:FinalChoice;closedAt:number;finalAt:number;reviewedAt:number;score:number;a:number;b:number;}
export function dna(entries:DnaEntry[]){const uniq=new Map<string,DnaEntry>();for(const e of entries.filter(e=>e.intent==='decision'&&e.current&&!e.deleted&&Number.isInteger(e.score)&&e.score>=1&&e.score<=10&&e.finalAt>=e.closedAt).sort((a,b)=>b.reviewedAt-a.reviewedAt))if(!uniq.has(e.postId))uniq.set(e.postId,e);
 const valid=[...uniq.values()].slice(0,30),n=valid.length;if(n<10)return {state:n<3?'collecting':n<5?'starting':'trend',count:n,type:null};
 const comparable=valid.filter(e=>e.a+e.b>=3&&e.a!==e.b&&e.final!=='neither');if(comparable.length<5)return {state:'insufficient',count:n,type:null};
 const distance=comparable.filter(e=>e.final==='A'?e.a<e.b:e.b<e.a).length/comparable.length;const lags=valid.map(e=>e.finalAt-e.closedAt).sort((a,b)=>a-b);const median=lags.length%2?lags[Math.floor(n/2)]:(lags[n/2-1]+lags[n/2])/2;
 const mean=valid.reduce((s,e)=>s+e.score,0)/n,sd=Math.sqrt(valid.reduce((s,e)=>s+(e.score-mean)**2,0)/n);const key=Number(distance>=.5)*4+Number(median<=3*HOUR)*2+Number(sd<=2);
 return {state:'ready',count:n,type:['道しるべ','目利き','切り札','舵取り','開拓者','策士','勝負師','一番星'][key],distance,median,sd};
}
export function mayUpdateDna(newReviews:number,lastAt:number,now:number,eligible=true){return !eligible||(newReviews>=5&&now-lastAt>=14*DAY);}
