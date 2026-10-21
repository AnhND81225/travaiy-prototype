import {useState} from 'react';
import {useNavigate,useSearchParams} from 'react-router-dom';
import {Check,MapPin,MapPinOff,Navigation,SlidersHorizontal} from 'lucide-react';
import {useTravel} from './TravelContext';
import {STAYS} from './fixtures';
import {TravelMap} from './TravelMap';
import {TravelHeader,Pill} from './UI';
import {TripWorkspaceNav} from './TripWorkspaceNav';
import {type GeoPoint,distanceKm} from './model';
import './product-polish.css';

export function RoutePlannerScreen(){
 const {plan}=useTravel();const nav=useNavigate();const [params]=useSearchParams();
 const initialDay=Number(params.get('day'))||1;
 const [day,setDay]=useState(initialDay);
 const scheduledIds=(number:number)=>(plan.daysSchedule.find(item=>item.dayNumber===number)||plan.daysSchedule[0]).items.filter(item=>item.location).map(item=>item.id);
 const [selected,setSelected]=useState<string[]>(()=>scheduledIds(initialDay));const [fromStay,setFromStay]=useState(true);const [editingStops,setEditingStops]=useState(false);
 const daily=plan.daysSchedule.find(item=>item.dayNumber===day)||plan.daysSchedule[0];const stay=STAYS.find(item=>item.id===plan.stayId);
 const chosen=daily.items.filter(item=>item.location&&selected.includes(item.id));
 const route:GeoPoint[]=[...(stay&&fromStay?[stay.location]:[]),...chosen.flatMap(item=>item.location?[item.location]:[])];
 const mapMarkers=[...(stay?[{id:'stay',location:stay.location,label:`Chỗ ở · ${stay.name}`,initials:'⌂',kind:'stay' as const}]:[]),...daily.items.filter(item=>item.location).map((item,index)=>({id:item.id,location:item.location!,label:`${item.time} · ${item.placeName}`,initials:String(index+1),kind:'place' as const}))];
 const mapCenter=mapMarkers[0]?.location||{lat:16.0544,lng:108.2022};const missingCoordinates=daily.items.filter(item=>!item.location);
 const length=route.slice(1).reduce((sum,point,index)=>sum+distanceKm(route[index],point),0);const first=route[0],last=route.at(-1);
 const url=first&&last?`https://www.google.com/maps/dir/?api=1&origin=${first.lat},${first.lng}&destination=${last.lat},${last.lng}${route.length>2?'&waypoints='+encodeURIComponent(route.slice(1,-1).map(point=>`${point.lat},${point.lng}`).join('|')):''}`:'';
 const canOpenMaps=route.length>=2&&route.length<=11;
 return <div className="travel-screen polish-screen">
  <TravelHeader title="Lộ trình trong ngày" subtitle={plan.destination} onBack={()=>nav('/trip/overview')}/><TripWorkspaceNav/>
  <main className="travel-scroll polish-stack">
   <div className="adaptive-day-tabs">{plan.daysSchedule.map(item=><button key={item.dayNumber} aria-pressed={daily.dayNumber===item.dayNumber} onClick={()=>{setDay(item.dayNumber);setSelected(scheduledIds(item.dayNumber));setFromStay(true);setEditingStops(false);}}>Ngày {item.dayNumber}</button>)}</div>
   <section className="polish-card route-map-card" aria-label={`Bản đồ ngày ${daily.dayNumber}`}>
    <div className="route-map-heading"><div><h2>Tuyến gợi ý theo lịch ngày {daily.dayNumber}</h2><p>{canOpenMaps?`${chosen.length} điểm ghé · khoảng ${length.toFixed(1)} km đường thẳng`:'Cần ít nhất 2 điểm có vị trí để tạo tuyến'}</p></div><span>{mapMarkers.length} điểm có vị trí</span></div>
    <div className="route-preview-map route-selection-map"><TravelMap center={mapCenter} zoom={12} route={route.length>1?route:[]} markers={mapMarkers}/>{canOpenMaps&&<a href={url} target="_blank" rel="noopener noreferrer" className="route-map-direct-link"><Navigation size={16}/>Mở toàn bộ lịch trình trên Google Maps</a>}</div>
    {!!missingCoordinates.length&&<p className="route-map-warning"><MapPinOff size={14}/><span><b>{missingCoordinates.length} điểm chưa có vị trí bản đồ.</b> Các điểm này chưa thể dùng để tính đường đi.</span></p>}
   </section>
   <section className="polish-card route-summary"><div><h2><Check size={16}/>Đã lấy các điểm từ lịch trình</h2><p className="travel-footnote">Tuyến được sắp theo giờ trong ngày. Bạn chỉ cần chỉnh nếu muốn bỏ bớt hoặc thêm điểm dừng.</p></div><button type="button" className="route-edit-stops" aria-expanded={editingStops} onClick={()=>setEditingStops(value=>!value)}><SlidersHorizontal size={15}/>{editingStops?'Xong':'Tùy chỉnh điểm dừng'}</button></section>
   {editingStops&&<section className="polish-card route-stops-editor" aria-label="Tùy chỉnh điểm dừng">
    <p className="travel-footnote">Bỏ tích một điểm nếu không muốn đưa nó vào tuyến.</p>
    {stay&&<label className="route-place-choice"><input type="checkbox" checked={fromStay} onChange={event=>setFromStay(event.target.checked)}/><span><b>Xuất phát từ {stay.name}</b><small>Chỗ ở đã chọn · hiển thị trên bản đồ</small></span></label>}
    {daily.items.map(item=><label key={item.id} className={`route-place-choice ${!item.location?'unavailable':''}`}><input type="checkbox" disabled={!item.location} checked={selected.includes(item.id)} onChange={()=>setSelected(ids=>ids.includes(item.id)?ids.filter(id=>id!==item.id):[...ids,item.id])}/><span><b>{item.placeName}</b><small>{item.time}{!item.location?' · Chưa có tọa độ — không thể tính đường':''}</small></span></label>)}
    {!daily.items.length&&<Pill secondary onClick={()=>nav(`/trip/edit/${daily.dayNumber}`)}><MapPin size={15}/>Thêm địa điểm vào ngày này</Pill>}
   </section>}
  </main>
  <footer className="wizard-footer">{!canOpenMaps&&<Pill disabled><Navigation size={16}/>Chưa đủ điểm để chỉ đường</Pill>}<p className="travel-footnote mt-2">Bấm nút trên bản đồ để mở tuyến đầy đủ trong Google Maps.</p></footer>
 </div>;
}
