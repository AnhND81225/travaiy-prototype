import type {TripWizardData} from '../../types/travel';
import {requiredWizardStep} from './wizardFlow';
import {dayCount,isoDate,type ActivePlan} from './model';
import {images,STAYS} from './fixtures';
export function createManualPlan(destination:string,startDate:string,endDate:string,stayId?:string):ActivePlan{
 const days=dayCount(startDate,endDate);
 if(!destination.trim()||!Number.isInteger(days)||days<1||days>30)throw new Error('Chọn điểm đến và thời gian từ 1 đến 30 ngày.');
 const stay=STAYS.find(s=>s.id===stayId&&s.area.includes(destination));
 if(destination!=='TP.HCM'&&days>1&&!stay)throw new Error('Chọn một chỗ ở cho chuyến đi qua đêm.');
 const cover=destination==='TP.HCM'?images.bridge:destination==='Đà Lạt'?images.dalatCabin:destination==='Hội An'?images.town:images.hero;
 return {id:`manual-${crypto.randomUUID()}`,planningMode:'manual',stayId:stay?.id,checkIn:stay?startDate:undefined,checkOut:stay?endDate:undefined,destination,title:`${destination} · Tự lên lịch`,days,startDate,endDate,dates:`${startDate.split('-').reverse().join('/')} – ${endDate.split('-').reverse().join('/')}`,coverImage:cover,estimatedCostPerPerson:'Chưa dự tính',daysSchedule:Array.from({length:days},(_,index)=>({dayNumber:index+1,title:`Ngày ${index+1} · ${destination}`,dateText:new Date(Date.parse(startDate+'T12:00:00Z')+index*86400000).toISOString().slice(5,10).split('-').reverse().join('/'),dayCost:'Chưa dự tính',items:[]}))};
}

export function updateManualSelection(plan:ActivePlan,names:string[]):ActivePlan{
 const selection=[...new Set(names)];const old=new Set(plan.placeSelection||[]);
 return {...plan,placeSelection:selection,daysSchedule:plan.daysSchedule.map(day=>({...day,items:day.items.filter(item=>!old.has(item.placeName)||selection.includes(item.placeName))}))};
}

export function manualPlanFromWizard(data:TripWizardData,tripId:string):ActivePlan{
 if(requiredWizardStep(data))throw new Error('Hoàn tất thông tin chuyến đi trước khi tự xếp lịch.');
 const plan=createManualPlan(data.destination,isoDate(data.startDate),isoDate(data.endDate),data.stayId);
 return {...plan,id:tripId,companionType:data.companionType,companionCount:data.companionCount,departureTime:data.departureTime,returnTime:data.returnTime,budgetAmount:data.budgetAmount,hotelBudgetPerNight:data.hotelBudgetPerNight,stayRoomCount:data.stayRoomCount,checkIn:plan.stayId?isoDate(data.stayDatesMode==='custom'?data.checkIn:data.startDate):undefined,checkOut:plan.stayId?isoDate(data.stayDatesMode==='custom'?data.checkOut:data.endDate):undefined,placeSelection:[...new Set(data.mustVisitPlaces)],placesChosen:true};
}
