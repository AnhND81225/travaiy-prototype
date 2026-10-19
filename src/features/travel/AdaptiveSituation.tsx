import React from 'react';
import { CloudRain, Clock3, Coffee, Droplets, MapPin, ShieldCheck } from 'lucide-react';
import type { AdaptiveScenario } from './adaptive';
import './adaptive.css';
export const ADAPTIVE_SHORT = {
  rain: { title: 'Chiều nay có mưa', action: 'Đổi sang điểm trong nhà', icon: CloudRain },
  delay: { title: 'Bạn đang trễ 60 phút', action: 'Bớt một điểm, thêm thời gian', icon: Clock3 },
  rest: { title: 'Đến lúc nghỉ một chút', action: 'Thêm khoảng nghỉ vào lịch', icon: Coffee },
};
export function AdaptiveSituation({scenario,compact=false,time,applied=false}:{scenario:AdaptiveScenario;compact?:boolean;time?:string;applied?:boolean}) {
 const content=ADAPTIVE_SHORT[scenario];const Icon=content.icon;
 return <div className={`adaptive-situation ${scenario} ${compact?'is-compact':''}`}>
   <div className="adaptive-situation-top"><span>{applied?'Đã cập nhật':'AI thích nghi'}</span><small>Mô phỏng</small></div>
   <div className="adaptive-situation-body"><div className="adaptive-weather-icon" aria-hidden="true"><Icon size={compact?46:75} strokeWidth={1.5}/>{scenario==='rain'&&<span className="adaptive-cloud-highlight"/>}</div><div className="adaptive-weather-copy">{!compact&&<strong className="adaptive-weather-value">{scenario==='rain'?'28°':scenario==='delay'?'60′':'Nghỉ'}</strong>}<h2>{applied?'Lịch mới đã sẵn sàng':content.title}</h2><p>{content.action}</p></div></div>
   {!compact&&<div className="adaptive-weather-metrics"><div><Droplets size={17}/><b>{scenario==='rain'?'80%':scenario==='delay'?'1 điểm':'1 khoảng'}</b><span>{scenario==='rain'?'Khả năng mưa':scenario==='delay'?'Giảm bớt':'Nghỉ ngơi'}</span></div><div><Clock3 size={17}/><b>{time||'Theo lịch'}</b><span>Khung giờ đổi</span></div><div><MapPin size={17}/><b>{scenario==='rain'?'Trong nhà':scenario==='delay'?'Thư thả':'Nạp năng lượng'}</b><span>Phương án mới</span></div></div>}
   {!compact&&<div className="adaptive-preserve"><ShieldCheck size={14}/><span>Giữ giờ ăn và các điểm đã khóa</span></div>}
 </div>;
}
