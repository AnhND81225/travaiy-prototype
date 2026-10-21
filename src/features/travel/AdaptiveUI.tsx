import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, X } from 'lucide-react';
import { ModalSheet } from '../../components/common/ModalSheet';
import { useTravel } from './TravelContext';
import { SCENARIOS, type AdaptiveScenario, type AdaptiveSuggestion } from './adaptive';
import { Pill } from './UI';
import { AdaptiveSituation, ADAPTIVE_SHORT } from './AdaptiveSituation';
export function AdaptiveNotice({compact=false}:{compact?:boolean}) {
 const {adaptive,undoAdaptive,dismissAdaptive}=useTravel();const nav=useNavigate();const [error,setError]=useState('');
 if(!adaptive||!['pending','applied'].includes(adaptive.status))return null;
 return <section className="adaptive-notice adaptive-notice-visual" aria-label="Đề xuất AI thích nghi"><AdaptiveSituation scenario={adaptive.scenario} compact applied={adaptive.status==='applied'}/><div className="adaptive-actions">{adaptive.status==='pending'?<><Pill onClick={()=>nav(`/trip/day/${adaptive.dayNumber}`)}>Xem trong lịch trình</Pill><button onClick={dismissAdaptive}>Để sau</button></>:<><Pill secondary onClick={()=>setError(undoAdaptive())}>Hoàn tác</Pill><button onClick={()=>nav(`/trip/day/${adaptive.dayNumber}`)}>Xem lịch trình</button></>}</div>{error&&<p role="alert">{error}</p>}</section>;
}
export function AdaptiveNotificationEntry({onClose}:{onClose:()=>void}) {
 const {adaptive,readAdaptive}=useTravel();const nav=useNavigate();if(!adaptive)return <p className="text-sm text-slate-500">Chưa có cập nhật AI thích nghi trong lịch trình.</p>;
 return <button className="adaptive-notification" onClick={()=>{readAdaptive();onClose();nav(`/trip/day/${adaptive.dayNumber}`);}}><b>{SCENARIOS[adaptive.scenario].icon} {SCENARIOS[adaptive.scenario].title}{adaptive.unread?' · Mới':''}</b><span>{adaptive.status==='pending'?'Có đề xuất đang chờ bạn xem':adaptive.status==='applied'?'Đã áp dụng lịch mới':adaptive.status==='undone'?'Đã hoàn tác về lịch trước':'Đã để sau; bấm để xem lịch trình'}</span><small>Tình huống mô phỏng · Ngày {adaptive.dayNumber}</small></button>;
}

/** Renders adaptive controls in context with the day they can affect. */
export function AdaptiveDayControls({dayNumber}:{dayNumber:number}) {
 const {adaptive,triggerAdaptive,applyAdaptive,dismissAdaptive,undoAdaptive}=useTravel();
 const [error,setError]=useState('');const [previewOpen,setPreviewOpen]=useState(false);
 const activeForDay=adaptive?.dayNumber===dayNumber&&['pending','applied'].includes(adaptive.status);
 const run=(scenario:AdaptiveScenario)=>{const message=triggerAdaptive(scenario);setError(message);};
 if(activeForDay&&adaptive){
  const pending=adaptive.status==='pending';
  const confirmApply=()=>{const message=applyAdaptive();setError(message);if(!message)setPreviewOpen(false);};
  const action=()=>{if(pending)setPreviewOpen(true);else setError(undoAdaptive());};
  return <><section className="adaptive-inline" aria-label="Điều chỉnh lịch bằng AI"><AdaptiveSituation scenario={adaptive.scenario} compact applied={!pending}/><div className="adaptive-inline-copy"><b>{pending?'AI đã chuẩn bị một điều chỉnh phù hợp với lịch ngày này.':'Điều chỉnh AI đã được áp dụng cho lịch ngày này.'}</b><span>{pending?'Xem trước thay đổi trước khi xác nhận áp dụng.':'Bạn có thể hoàn tác bất cứ lúc nào.'}</span></div><div className="adaptive-inline-actions"><Pill onClick={action}>{pending?'Áp dụng đề xuất':'Hoàn tác thay đổi'}</Pill>{pending&&<button onClick={()=>{dismissAdaptive();setError('');}}>Giữ lịch hiện tại</button>}</div>{error&&<p role="alert" className="adaptive-error">{error}</p>}</section>{pending&&<AdaptivePreviewModal suggestion={adaptive} isOpen={previewOpen} onClose={()=>setPreviewOpen(false)} onConfirm={confirmApply}/>}</>;
 }
 return <section className="adaptive-inline adaptive-inline-picker" aria-label="AI thích nghi"><div className="adaptive-inline-heading"><div><span>AI THÍCH NGHI</span><h2>Điều chỉnh lịch khi có thay đổi</h2></div><small>Ngày {dayNumber}</small></div><p>Chọn một tình huống để nhận gợi ý ngay trong lịch trình này.</p><div className="adaptive-scenario-buttons">{(Object.keys(SCENARIOS) as AdaptiveScenario[]).map(scenario=><button key={scenario} type="button" onClick={()=>run(scenario)}><b>{SCENARIOS[scenario].icon} {SCENARIOS[scenario].title}</b><span>{ADAPTIVE_SHORT[scenario].action}</span></button>)}</div>{error&&<p role="alert" className="adaptive-error">{error}</p>}</section>;
}

function AdaptivePreviewModal({suggestion,isOpen,onClose,onConfirm}:{suggestion:AdaptiveSuggestion;isOpen:boolean;onClose:()=>void;onConfirm:()=>void}) {
 const before=suggestion.before.daysSchedule.find(day=>day.dayNumber===suggestion.dayNumber);
 const after=suggestion.after.daysSchedule.find(day=>day.dayNumber===suggestion.dayNumber);
 const changedIds=new Set(suggestion.changes.map(change=>change.before.id));
 const kept=before?.items.filter(item=>!changedIds.has(item.id))||[];
 return <ModalSheet isOpen={isOpen} onClose={onClose} type="dialog" title="Xem trước thay đổi lịch" contentClassName="adaptive-preview-modal"><div className="adaptive-preview"><p className="adaptive-preview-eyebrow">ĐỀ XUẤT CHO NGÀY {suggestion.dayNumber}</p><h2>Bạn sắp thay đổi 1 hoạt động</h2><p className="adaptive-preview-intro">{SCENARIOS[suggestion.scenario].message}</p><div className="adaptive-preview-changes">{suggestion.changes.map(change=><article key={change.before.id}><div className="adaptive-preview-time"><b>{change.before.time}</b><span>Khung giờ được giữ nguyên</span></div><section className="adaptive-preview-place before"><span>LỊCH HIỆN TẠI</span><b>{change.before.placeName}</b><small>{change.before.category} · {change.before.duration}</small></section><p className="adaptive-preview-transition" aria-hidden="true"><span>↓</span> AI đề xuất đổi thành</p><section className="adaptive-preview-place after"><span>SAU KHI ÁP DỤNG</span><b>{change.after?.placeName||'Dành thêm thời gian di chuyển'}</b><small>{change.after ? `${change.after.category} · ${change.after.duration}` : 'Khoảng thời gian trống'}</small></section></article>)}</div><div className="adaptive-preview-kept"><b>✓ Các mốc khác vẫn giữ nguyên</b><span>{kept.map(item=>`${item.time} ${item.placeName.replace(/^Ăn (sáng|trưa|tối)\s*[-–]\s*/i,'')}`).join(' · ')}</span></div><details className="adaptive-preview-schedule"><summary>So sánh toàn bộ lịch ngày {suggestion.dayNumber}</summary><div>{[{label:'Hiện tại',day:before},{label:'Sau khi áp dụng',day:after}].map(column=><section key={column.label}><b>{column.label}</b>{column.day?.items.map(item=><p key={item.id}><time>{item.time}</time>{item.placeName}</p>)}</section>)}</div></details><div className="adaptive-preview-actions"><Pill onClick={onConfirm}>Xác nhận áp dụng thay đổi</Pill><button type="button" onClick={onClose}>Quay lại, chưa áp dụng</button></div></div></ModalSheet>;
}
export function AdaptiveBell(){const {adaptive,readAdaptive}=useTravel();const [open,setOpen]=useState(false);return <><button className="travel-icon relative" aria-label="Thông báo" onClick={()=>{setOpen(true);readAdaptive();}}><Bell size={20}/>{adaptive?.unread&&<span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500"/>}</button><ModalSheet isOpen={open} onClose={()=>setOpen(false)} title="Thông báo"><div className="travel-modal-content"><div className="travel-section-title"><h2>Thông báo</h2><button className="travel-icon" aria-label="Đóng thông báo" onClick={()=>setOpen(false)}><X size={20}/></button></div><AdaptiveNotificationEntry onClose={()=>setOpen(false)}/></div></ModalSheet></>;}
