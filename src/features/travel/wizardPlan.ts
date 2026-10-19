import {manualPlacesFor} from './manualPlaces';
import { MOCK_PLACES } from '../../data/mockData';
import type { TripWizardData } from '../../types/travel';
import { INITIAL_PLAN, STAYS, images } from './fixtures';
import { dayCount, isoDate, lodgingError, optimizePlan, type Stay, type ActivePlan } from './model';
// Deterministic preview fixtures; no live AI request.
export function buildWizardPlan(data:TripWizardData):ActivePlan{
 const start=isoDate(data.startDate),end=isoDate(data.endDate);const count=Math.max(1,Math.min(30,dayCount(start,end)||1));
 const stay=STAYS.find(s=>s.id===data.stayId&&s.area.includes(data.destination));
 const draft:ActivePlan={planningMode:'ai',companionType:data.companionType,companionCount:data.companionCount,departureTime:data.departureTime,returnTime:data.returnTime,budgetAmount:data.budgetAmount,id:`trip-${data.destination}-${start}`,destination:data.destination,stayRoomCount:lodgingBudget(data).rooms,hotelBudgetPerNight:lodgingBudget(data).nightly,title:`${data.destination} · ${count} ngày`,days:count,dates:`${start.split('-').reverse().join('/')} – ${end.split('-').reverse().join('/')}`,startDate:start,endDate:end,checkIn:stay?(data.stayDatesMode==='custom'?isoDate(data.checkIn):start):undefined,checkOut:stay?(data.stayDatesMode==='custom'?isoDate(data.checkOut):end):undefined,coverImage:data.destination==='Đà Nẵng'?images.bridge:data.destination==='Hội An'?images.town:images.hero,estimatedCostPerPerson:`${data.budgetAmount.toLocaleString('vi-VN')}đ`,daysSchedule:Array.from({length:count},(_,index)=>{
 const date=new Date(start+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+index);const dateText=Number.isNaN(date.getTime())?'':`${date.getUTCDate()}/${date.getUTCMonth()+1}`;
 const sample=data.destination==='Đà Nẵng'?INITIAL_PLAN.daysSchedule[index]:undefined;
 return {dayNumber:index+1,title:sample?.title||`Khám phá ${data.destination}`,dateText,dayCost:sample?.dayCost||'Chưa dự tính',items:sample?sample.items.map(i=>({...i})):[]};
 })};
 if(data.mustVisitPlaces.length){
  const choices=manualPlacesFor(data.destination);
  draft.daysSchedule.forEach(day=>{day.items=[];day.dayCost='Chưa dự tính';});
  [...new Set(data.mustVisitPlaces)].forEach((name,index)=>{
   const place=choices.find(p=>p.name===name);const day=draft.daysSchedule[index%draft.daysSchedule.length];
   const slot=Math.floor(index/draft.daysSchedule.length);const minutes=9*60+slot*90;
   day.items.push({id:`selected-${index}`,time:`${String(Math.floor(minutes/60)).padStart(2,'0')}:${String(minutes%60).padStart(2,'0')}`,placeName:name,category:place?.category||'Tự chọn',duration:place?.duration||'60 phút',cost:'Chưa dự tính',note:'Điểm bạn đã chọn · thời gian sắp xếp mẫu.',image:place?.image||draft.coverImage,location:place?.location,address:place?.address});
  });
  return stay?optimizePlan(draft,stay):draft;
 }
 const wanted = MOCK_PLACES.filter(p=>p.city===data.destination&&data.mustVisitPlaces.includes(p.name));
 const used=new Set<string>();
 draft.daysSchedule.forEach((day,index)=>{
  if(!day.items.length){
   const cityPlaces=MOCK_PLACES.filter(p=>p.city===data.destination);
   const place=cityPlaces[index%Math.max(1,cityPlaces.length)];
   day.items=[{id:`sample-${index}-am`,time:'09:00',placeName:place?.name||`Khám phá ${data.destination} (gợi ý mẫu)`,category:place?.category||'Tham quan',duration:'90 phút',cost:place?.priceRange||'Chưa dự tính',note:'Hoạt động minh họa; cần xác nhận thông tin trước khi đi.',image:place?.images[0]}, {id:`sample-${index}-lunch`,time:'12:00',placeName:'Ăn trưa và nghỉ ngơi',category:'Ẩm thực',duration:'60 phút',cost:'Chưa dự tính',note:'Khung giờ ăn được giữ nguyên.',locked:true}, {id:`sample-${index}-pm`,time:'15:00',placeName:`Dạo quanh ${data.destination} (gợi ý mẫu)`,category:'Ngoài trời',duration:'60 phút',cost:'Chưa dự tính',note:'Gợi ý mẫu để thử lịch trình; chưa có tuyến đường thực tế.'}];
  }
  day.items.forEach(i=>used.add(i.placeName));
 });
 wanted.filter(p=>!used.has(p.name)).forEach((place,index)=>{const day=draft.daysSchedule[index%draft.daysSchedule.length];day.items.push({id:`wanted-${place.id}`,time:'17:00',placeName:place.name,category:place.category,duration:'45 phút',cost:place.priceRange,note:'Địa điểm bạn muốn ghé; giờ minh họa.',image:place.images[0]});day.items.sort((a,b)=>a.time.localeCompare(b.time));});
 return stay?optimizePlan(draft,stay):draft;
}

export function wizardDateError(data:TripWizardData){
 const count=dayCount(data.startDate,data.endDate);if(count<1)return 'Ngày về cần từ ngày đi trở đi.';if(count>30)return 'Bản xem trước hỗ trợ tối đa 30 ngày.';
 const stay=STAYS.find(s=>s.id===data.stayId&&s.area.includes(data.destination));
 return stay?lodgingError(data.startDate,data.endDate,data.stayDatesMode==='custom'?data.checkIn||'':data.startDate,data.stayDatesMode==='custom'?data.checkOut||'':data.endDate):'';
}

export function lodgingBudget(data:TripWizardData){
 const nights=Math.max(0,dayCount(data.startDate,data.endDate)-1);const people=data.companionType==='solo'?1:Math.max(1,data.companionCount);const rooms=Math.max(1,data.stayRoomCount||Math.ceil(people/2));
 const suggested=Math.max(100000,Math.floor((data.budgetAmount*people*0.35/Math.max(1,nights*rooms))/50000)*50000);
 return {nights,people,rooms,nightly:data.hotelBudgetPerNight??suggested,suggested};
}
export function rankStays(stays:Stay[],data:TripWizardData){
 const budget=lodgingBudget(data);if(!budget.nights)return [];
 return stays.filter(s=>s.area.includes(data.destination)).map(stay=>({stay,withinBudget:stay.price<=budget.nightly,over:Math.max(0,stay.price-budget.nightly),estimatedTotal:stay.price*budget.rooms*(data.stayDatesMode==='custom'?Math.max(0,dayCount(data.checkIn||'',data.checkOut||'')-1):budget.nights)})).sort((a,b)=>Number(b.withinBudget)-Number(a.withinBudget)||(a.withinBudget?b.stay.rating-a.stay.rating:a.over-b.over)||a.stay.price-b.stay.price);
}

export function wizardNeedsStay(data:TripWizardData){return dayCount(data.startDate,data.endDate)>1&&!STAYS.some(s=>s.id===data.stayId&&s.area.includes(data.destination));}
