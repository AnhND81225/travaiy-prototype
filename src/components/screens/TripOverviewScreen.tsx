import {useNavigate} from 'react-router-dom';
import {CalendarDays, Camera, Wallet, Users, Navigation, Backpack, ClipboardList, ChevronRight, BedDouble, Pencil, Map, Image as ImageIcon} from 'lucide-react';
import {BottomNav} from '../common/BottomNav';
import {TravelHeader, Image} from '../../features/travel/UI';
import {TripProgress} from '../../features/travel/TripProgress';
import {useTravel} from '../../features/travel/TravelContext';
import {STAYS} from '../../features/travel/fixtures';
import type {NavTab,TripWizardData} from '../../types/travel';
import '../../features/travel/product-polish.css';
interface Props{onNavigateTab:(tab:NavTab)=>void;tripData?:TripWizardData;onOpenDay:(day:number)=>void;onEditTrip:()=>void;onOpenPreparation:()=>void;onOpenPackingList:()=>void;onOpenTodaySchedule?:()=>void;onOpenGroupSpace?:()=>void;onOpenExpenses?:()=>void;onOpenJournal?:()=>void;onOpenTravelWallet?:()=>void;onOpenSubscription?:()=>void;onBack:()=>void;}
export function TripOverviewScreen(props:Props){
 const {plan,completedActivities}=useTravel();const nav=useNavigate();const stay=STAYS.find(s=>s.id===plan.stayId);const done=completedActivities[plan.id]||[];
 const tools=[{name:'Hôm nay',icon:Navigation,run:props.onOpenTodaySchedule,tone:'mint'},{name:'Hành lý',icon:Backpack,run:props.onOpenPackingList,tone:'gold'},{name:'Chi tiêu',icon:Wallet,run:props.onOpenExpenses,tone:'blue'},{name:'Camera',icon:Camera,run:()=>nav('/trip/camera'),tone:'rose'},{name:'Nhóm',icon:Users,run:props.onOpenGroupSpace,tone:'lavender'},{name:'Lộ trình',icon:Map,run:()=>nav('/trip/route'),tone:'mint'}];
 return <div className="travel-screen polish-screen"><TravelHeader title={plan.destination} subtitle="Chuyến đi của bạn" onBack={props.onBack} action={<button className="travel-icon" aria-label="Chỉnh sửa lịch trình" onClick={props.onEditTrip}><Pencil size={18}/></button>}/><main className="travel-scroll polish-stack">
  <section aria-label="Công cụ chuyến đi"><div className="polish-heading"><h2>Công cụ chuyến đi</h2><button onClick={props.onOpenPreparation}>Chuẩn bị <ChevronRight size={13}/></button></div><div className="overview-tools">{tools.map(t=><button key={t.name} onClick={t.run} className={`tone-${t.tone}`}><t.icon size={21}/><span>{t.name}</span></button>)}</div></section>
  <section className="overview-photo-hero"><Image src={plan.coverImage} alt={plan.destination}/><div><span>{plan.planningMode==='manual'?'Tự lên lịch':'Lịch trình AI · bản demo'}</span><h1>{plan.destination}</h1><p><CalendarDays size={13}/>{plan.dates} · {plan.days} ngày</p></div></section>
  <TripProgress/>
  <button className="overview-hotel-compact" onClick={()=>nav(stay?`/stay/${stay.id}`:`/explore/stays?destination=${encodeURIComponent(plan.destination)}`)}>{stay?<Image src={stay.image} alt={stay.name}/>:<span className="hotel-placeholder"><BedDouble size={24}/></span>}<span><small>CHỖ Ở</small><b>{stay?.name||'Chọn khách sạn / homestay'}</b><small>{stay?'Xem hoặc đổi chỗ ở':'Điểm nghỉ cho hành trình'}</small></span><ChevronRight size={17}/></button>
  <section className="polish-stack"><div className="polish-heading"><h2>Lịch trình từng ngày</h2><button onClick={props.onEditTrip}><Pencil size={13}/>Sửa</button></div>{plan.daysSchedule.map(day=><button key={day.dayNumber} className="overview-day-card" onClick={()=>props.onOpenDay(day.dayNumber)}><span className="overview-day-number"><small>NGÀY</small><b>{day.dayNumber}</b></span><span><strong>{day.title}</strong><small>{day.items.length?`${day.items.length} hoạt động · ${day.items.filter(i=>done.includes(i.id)).length} đã xong`:'Chưa có hoạt động · Thêm địa điểm'}</small><span className="overview-day-thumbs">{day.items.slice(0,3).map(i=><Image key={i.id} src={i.image||plan.coverImage} alt={i.placeName}/>)}</span></span><ChevronRight size={17}/></button>)}</section>
  <div className="overview-secondary-links"><button onClick={props.onOpenJournal}><ImageIcon size={16}/>Album chuyến đi<ChevronRight size={14}/></button><button onClick={props.onOpenTravelWallet}><ClipboardList size={16}/>Ví giấy tờ <small>Mô phỏng</small><ChevronRight size={14}/></button></div>
 </main><BottomNav activeTab="trips" onTabChange={props.onNavigateTab}/></div>;
}
