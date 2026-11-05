import {useNavigate,useLocation} from 'react-router-dom';
import {useTravel} from './TravelContext';
export function CompanionBanner(){
 const {plan,companion}=useTravel();const nav=useNavigate();const route=useLocation();
 const notice=companion.notice;
 if(!notice||plan.backendStatus!=='ACTIVE'||route.pathname.startsWith('/trip/day/')||route.pathname==='/welcome')return null;
 return <aside role="status" aria-label="Thông báo đồng hành" style={{position:'fixed',bottom:90,left:'50%',transform:'translateX(-50%)',width:'min(350px,90vw)',padding:16,background:'white',border:'1px solid #cbd5e1',borderRadius:18,boxShadow:'0 8px 30px #0002',zIndex:80}}>
  <strong>TravAIy · Gợi ý cho bạn</strong><p>{notice.message}</p><button className="travel-pill" onClick={()=>nav(`/trip/day/${notice.dayNumber}`)}>Xem đề xuất</button><button className="wizard-text-button" onClick={companion.clearNotice}>Để sau</button>
 </aside>;
}
