import {useTravel} from './TravelContext';
import './product-polish.css';
export function TripProgress({dayNumber}:{dayNumber?:number}){
 const {plan,completedActivities}=useTravel();
 const items=plan.daysSchedule.filter(d=>dayNumber===undefined||d.dayNumber===dayNumber).flatMap(d=>d.items);
 const ids=completedActivities[plan.id]||[];const done=items.filter(i=>ids.includes(i.id)).length;const percent=items.length?Math.round(done/items.length*100):0;
 return <section className="trip-progress-card" aria-label="Tiến độ lịch trình"><div><b>{dayNumber?`Tiến độ ngày ${dayNumber}`:'Tiến độ hành trình'}</b><span>{done}/{items.length} hoạt động · {percent}%</span></div><div role="progressbar" aria-label="Hoạt động đã hoàn thành" aria-valuenow={done} aria-valuemin={0} aria-valuemax={items.length||1}><span style={{width:`${percent}%`}}/></div></section>;
}
