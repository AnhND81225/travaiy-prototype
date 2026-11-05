import type { TripDayItem, TripPlan } from '../../types/travel';
export type GeoPoint = { lat: number; lng: number };
export type Stay = { id: string; name: string; area: string; type: string; price: number; rating: number; image: string; gallery: string[]; location: GeoPoint; amenities: string[]; description: string };
export type LocatedItem = TripDayItem & { backendPlaceId?: string | null; location?: GeoPoint; locked?: boolean };
export type ActivePlan = Omit<TripPlan, 'daysSchedule'> & { backendTripId?: string; backendVersion?: number; backendMode?: string; backendStatus?: string; backendCompletedIds?: string[]; backendWarnings?: string[]; planningMode?: 'ai' | 'manual'; placeSelection?: string[]; placesChosen?: boolean; companionType?: 'solo' | 'group'; companionCount?: number; departureTime?: string; returnTime?: string; budgetAmount?: number; stayId?: string; stayRoomCount?: number; hotelBudgetPerNight?: number; startDate?: string; endDate?: string; checkIn?: string; checkOut?: string; daysSchedule: (Omit<TripPlan['daysSchedule'][number], 'items'> & { items: LocatedItem[] })[] };
export type PhotoMoment = { id: string; tripId: string; src: string; title: string; region: string; date: string; location?: GeoPoint; isSample?: boolean; createdAt?: string; placeId?: string; frameId?: string; trashedAt?: string };
export const distanceKm = (a: GeoPoint, b: GeoPoint) => {
  const rad = Math.PI / 180; const dlat = (b.lat-a.lat)*rad; const dlng=(b.lng-a.lng)*rad;
  const s=Math.sin(dlat/2)**2+Math.cos(a.lat*rad)*Math.cos(b.lat*rad)*Math.sin(dlng/2)**2;
  return 6371*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));
};
export function routeDistance(items: LocatedItem[], anchor: GeoPoint): number {
  const points=[anchor,...items.flatMap(i=>i.location?[i.location]:[]),anchor];
  return points.slice(1).reduce((sum,p,i)=>sum+distanceKm(points[i],p),0);
}
// Only reorder uninterrupted, unlocked blocks. Missing coordinates are fixed boundaries.
// Times are slots: retain slot times when exchanging activities inside a free block.
export function optimizePlan(plan: ActivePlan, stay: Stay): ActivePlan {
  return {...plan,stayId:stay.id,daysSchedule:plan.daysSchedule.map(day=>{
    const items=day.items.map(i=>({...i})); if(!stayAppliesOnDay(plan,day.dayNumber))return {...day,items}; let index=0;
    while(index<items.length){
      if(items[index].locked||!items[index].location){index++;continue;}
      let end=index; while(end<items.length&&!items[end].locked&&items[end].location)end++;
      const left=index?items[index-1].location||stay.location:stay.location;
      const right=end<items.length?items[end].location||stay.location:stay.location;
      const original=items.slice(index,end);const pending=[...original];const ordered:LocatedItem[]=[];let current=left;
      while(pending.length){pending.sort((a,b)=>distanceKm(current,a.location!)-distanceKm(current,b.location!));const next=pending.shift()!;ordered.push(next);current=next.location!;}
      const length=(r:LocatedItem[])=>{const p=[left,...r.map(i=>i.location!),right];return p.slice(1).reduce((s,x,i)=>s+distanceKm(p[i],x),0);};
      let improved=true;let rounds=0;
      while(improved&&rounds++<20){improved=false;for(let a=0;a<ordered.length-1;a++)for(let b=a+1;b<ordered.length;b++){const next=[...ordered.slice(0,a),...ordered.slice(a,b+1).reverse(),...ordered.slice(b+1)];if(length(next)+0.001<length(ordered)){ordered.splice(0,ordered.length,...next);improved=true;}}}
      const chosen=length(ordered)<=length(original)?ordered:original;
      for(let j=0;j<chosen.length;j++)items[index+j]={...chosen[j],time:original[j].time};
      index=end;
    }
    return {...day,items};
  })};
}
export function clusterPhotos(photos: PhotoMoment[], zoom: number) {
  const buckets=new Map<string,PhotoMoment[]>();
  const scale=zoom<7?0:zoom<10?0.5:zoom<13?4:zoom<16?40:1000;
  for(const photo of photos){if(!photo.location)continue;const key=scale===0?(photo.location.lat>17?'north':'south'):`${Math.floor(photo.location.lat*scale)}:${Math.floor(photo.location.lng*scale)}`;buckets.set(key,[...(buckets.get(key)||[]),photo]);}
  return [...buckets.entries()].map(([id,items])=>({id,items,location:{lat:items.reduce((s,p)=>s+p.location!.lat,0)/items.length,lng:items.reduce((s,p)=>s+p.location!.lng,0)/items.length}}));
}

export function isoDate(value:string=''):string {
 if(/^\d{4}-\d{2}-\d{2}$/.test(value))return value;
 const match=/^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);return match?`${match[3]}-${match[2]}-${match[1]}`:'';
}
export function dayCount(start:string,end:string){const a=Date.parse(isoDate(start)+'T12:00:00Z'),b=Date.parse(isoDate(end)+'T12:00:00Z');return Number.isFinite(a)&&Number.isFinite(b)?Math.round((b-a)/86400000)+1:0;}
export function lodgingError(start:string,end:string,checkIn:string,checkOut:string){
 const a=isoDate(start),b=isoDate(end),c=isoDate(checkIn),d=isoDate(checkOut);
 if(!a||!b||b<a)return 'Chọn ngày về từ ngày đi trở đi.';
 if(!c||!d)return 'Chọn ngày nhận và trả phòng.';
 if(c<a||d>b)return 'Ngày ở cần nằm trong thời gian chuyến đi.';
 if(d<=c)return 'Ngày trả phòng phải sau ngày nhận phòng.';
 return '';
}
export function stayAppliesOnDay(plan:ActivePlan,dayNumber:number){
 if(!plan.startDate||!plan.checkIn||!plan.checkOut)return true;
 const date=new Date(isoDate(plan.startDate)+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+dayNumber-1);const key=date.toISOString().slice(0,10);
 return key>=isoDate(plan.checkIn)&&key<=isoDate(plan.checkOut);
}
