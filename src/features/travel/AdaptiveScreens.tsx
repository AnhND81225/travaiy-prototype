import {TripProgress} from './TripProgress';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNav } from '../../components/common/BottomNav';
import type { NavTab } from '../../types/travel';
import { ArrowRight, Coffee, Landmark, Clock3, ShieldCheck, ChevronDown } from 'lucide-react';
import { AdaptiveSituation } from './AdaptiveSituation';
import { TravelHeader, Pill, Image } from './UI';
import { useTravel } from './TravelContext';
import { SCENARIOS, protectedItem } from './adaptive';
import { AdaptiveBell, AdaptiveNotice } from './AdaptiveUI';
import { TripWorkspaceNav } from './TripWorkspaceNav';
import './adaptive.css';
export function TodayAdaptiveScreen({onNavigateTab}:{onNavigateTab:(tab:NavTab)=>void}){
 const {plan,adaptive}=useTravel();const nav=useNavigate();const [dayNumber,setDayNumber]=useState(adaptive?.dayNumber||plan.daysSchedule[0]?.dayNumber||1);const day=plan.daysSchedule.find(d=>d.dayNumber===dayNumber)||plan.daysSchedule[0];
 useEffect(()=>{if(adaptive)setDayNumber(adaptive.dayNumber);},[adaptive?.id]);
 return <div className="travel-screen"><TravelHeader title={plan.destination} subtitle="Lịch trình hôm nay" onBack={()=>nav('/trip/overview')} action={<AdaptiveBell/>}/><TripWorkspaceNav/><main className="travel-scroll wizard-body space-y-4"><TripProgress dayNumber={dayNumber}/><AdaptiveNotice/><div className="adaptive-day-tabs">{plan.daysSchedule.map(d=><button key={d.dayNumber} aria-pressed={day?.dayNumber===d.dayNumber} onClick={()=>setDayNumber(d.dayNumber)}>Ngày {d.dayNumber}</button>)}</div><div className="travel-section-title"><h2>Ngày {day?.dayNumber} · {day?.dateText}</h2><button onClick={()=>nav(`/trip/day/${day?.dayNumber||1}`)}>Mở lịch trình</button></div>{!day?.items.length&&<p>Chưa có hoạt động. Thêm hoạt động trong lịch trình từng ngày.</p>}{day?.items.map(item=>{const cleanName=item.placeName.replace(/^Ăn sáng\s*[-–]\s*/i,'').replace(/^Ăn trưa\s*[-–]\s*/i,'').replace(/^Ăn tối\s*[-–]\s*/i,'');return <article className="adaptive-timeline" key={item.id}><time>{item.time}</time><div className="flex-1 min-w-0"><h3 className="font-heading text-[15px] font-bold text-slate-900">{cleanName}</h3><div className="flex items-center gap-2 mt-1"><span className="text-[12px] text-slate-500 font-medium">{item.category} · {item.duration}</span>{protectedItem(item)&&<span className="text-[10px] font-semibold text-amber-800 bg-[#FFF8E6] border border-[#F1B94C]/50 px-2 py-0.5 rounded-full inline-flex items-center gap-1">🔒 Giữ giờ</span>}</div></div></article>;})}<div className="adaptive-utility"><button onClick={()=>nav('/trip/group')}>Nhóm</button><button onClick={()=>nav('/trip/expenses')}>Chi tiêu</button><button onClick={()=>nav('/trip/group/location')}>Vị trí nhóm</button></div></main><BottomNav activeTab="trips" onTabChange={onNavigateTab}/></div>;
}
function shortName(value:string){return value.replace(/\s*\(gợi ý mẫu\)/g,'').replace(/\s*\(gợi ý mẫu.*$/g,'');}
export function AdaptiveReviewScreen(){
 const {adaptive,plan,readAdaptive,applyAdaptive,dismissAdaptive,undoAdaptive}=useTravel();
 const nav=useNavigate();const [error,setError]=useState('');
 useEffect(()=>{readAdaptive();},[adaptive?.id]);
 if(!adaptive)return <div className="travel-screen"><TravelHeader title="AI thích nghi" onBack={()=>nav('/trip/today')}/><main className="travel-scroll wizard-body"><h2>Chưa có đề xuất</h2><p>Chọn tình huống từ màn Hôm nay để bắt đầu.</p><Pill onClick={()=>nav('/trip/today')}>Về lịch hôm nay</Pill></main></div>;
 const before=adaptive.before.daysSchedule.find(d=>d.dayNumber===adaptive.dayNumber);
 const after=adaptive.after.daysSchedule.find(d=>d.dayNumber===adaptive.dayNumber);
 return <div className="travel-screen adaptive-visual-screen">
  <TravelHeader title="Điều chỉnh lịch" subtitle={`${plan.destination} · Ngày ${adaptive.dayNumber}`} onBack={()=>nav('/trip/today')}/>
  <main className="travel-scroll adaptive-visual-main">
   <AdaptiveSituation scenario={adaptive.scenario} time={adaptive.changes[0]?.before.time} applied={adaptive.status==='applied'}/>
   {adaptive.changes.map(change=><section className="adaptive-swap" key={change.before.id} aria-label="Thay đổi đề xuất">
    <div className="adaptive-swap-heading"><h2>{adaptive.scenario==='rain'?'Tránh mưa, vẫn vui':adaptive.scenario==='delay'?'Giữ lịch nhẹ nhàng':'Thêm một khoảng nghỉ'}</h2><span>1 thay đổi</span></div>
    <div className="adaptive-swap-grid">
     <article className="adaptive-place-before"><div className="adaptive-place-art">{change.before.image?<Image src={change.before.image} alt={shortName(change.before.placeName)}/>:<MapPinArtwork/>}<span>Hiện tại</span></div><div className="adaptive-place-copy"><time>{change.before.time}</time><h3>{shortName(change.before.placeName)}</h3></div></article>
     <span className="adaptive-swap-arrow" aria-label="Thay bằng"><ArrowRight size={18}/></span>
     <article className="adaptive-place-after"><div className={`adaptive-place-art adaptive-art-${adaptive.scenario}`}>{change.after?.image?<Image src={change.after.image} alt={shortName(change.after.placeName)}/>:adaptive.scenario==='rain'?<Landmark size={46} strokeWidth={1.35}/>:adaptive.scenario==='rest'?<Coffee size={46} strokeWidth={1.35}/>:<Clock3 size={46} strokeWidth={1.35}/>}<span>{adaptive.scenario==='rain'?'Trong nhà':adaptive.scenario==='rest'?'Nghỉ ngơi':'Bỏ điểm này'}</span></div><div className="adaptive-place-copy"><time>{change.after?.time||change.before.time}</time><h3>{change.after?shortName(change.after.placeName):'Dành thời gian di chuyển'}</h3></div></article>
    </div>
   </section>)}
   <details className="adaptive-full-schedule"><summary><span>Xem toàn bộ lịch</span><ChevronDown size={16}/></summary><div className="adaptive-compare">{[{title:'Hiện tại',day:before},{title:'Đề xuất',day:after}].map(column=><section key={column.title}><h2>{column.title}</h2>{column.day?.items.map(item=><article key={item.id}><time>{item.time}</time><b>{shortName(item.placeName)}</b>{protectedItem(item)&&<small><ShieldCheck size={11}/> Giữ nguyên</small>}</article>)}</section>)}</div></details>
   {error&&<p role="alert" className="adaptive-error">{error}</p>}
  </main>
  <footer className="wizard-footer adaptive-visual-footer">{adaptive.status==='pending'?<><Pill onClick={()=>{const result=applyAdaptive();setError(result);if(!result)nav('/trip/today');}}>Áp dụng lịch mới <ArrowRight size={17}/></Pill><button className="adaptive-keep-button" onClick={()=>{dismissAdaptive();nav('/trip/today');}}>Giữ lịch cũ</button></>:<><p>{adaptive.status==='applied'?'Đã áp dụng lịch mới':adaptive.status==='undone'?'Đã hoàn tác':'Đã giữ lịch cũ'}</p>{adaptive.status==='applied'&&<Pill secondary onClick={()=>{const result=undoAdaptive();setError(result);if(!result)nav('/trip/today');}}>Hoàn tác</Pill>}<button className="adaptive-keep-button" onClick={()=>nav('/trip/today')}>Về lịch hôm nay</button></>}</footer>
 </div>;
}
function MapPinArtwork(){return <Landmark size={40} strokeWidth={1.3}/>;}
