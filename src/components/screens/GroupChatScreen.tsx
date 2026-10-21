import React, {useState} from 'react';
import {Send,Users} from 'lucide-react';
import {TripWorkspaceNav} from '../../features/travel/TripWorkspaceNav';
import {useTravel} from '../../features/travel/TravelContext';
import {TravelHeader} from '../../features/travel/UI';
import './GroupChatScreen.css';

export function GroupChatScreen({onBack}:{onBack:()=>void}){
 const {plan,groupMessages,sendGroupMessage}=useTravel();const [draft,setDraft]=useState('');
 const submit=(event:React.FormEvent)=>{event.preventDefault();if(!draft.trim())return;sendGroupMessage(draft);setDraft('');};
 return <div className="travel-screen group-chat-screen"><TravelHeader title="Nhắn tin nhóm" subtitle={`${plan.destination} · 6 thành viên`} onBack={onBack}/><TripWorkspaceNav/>
  <main className="travel-scroll group-chat-scroll"><div className="group-chat-status"><Users size={16}/><span>Cả nhóm đang trao đổi về lịch trình chung</span></div><p className="group-chat-date">Hôm nay</p><div className="group-chat-list" aria-live="polite">{groupMessages.map(message=><article key={message.id} className={message.mine?'mine':''}><div><b>{message.mine?'Bạn':message.sender}</b><p>{message.text}</p><small>{message.sentAt}</small></div></article>)}</div></main>
  <form className="group-chat-composer" onSubmit={submit}><input aria-label="Tin nhắn cho nhóm" value={draft} maxLength={500} onChange={event=>setDraft(event.target.value)} placeholder="Nhắn tin cho nhóm…"/><button type="submit" aria-label="Gửi tin nhắn" disabled={!draft.trim()}><Send size={18}/></button></form>
 </div>;
}
