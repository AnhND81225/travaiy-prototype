import {useState} from 'react';
import {ArrowRight} from 'lucide-react';
import {TravelHeader} from './UI';
import './product-polish.css';
export function ProfileNameScreen({name,onSave,onBack}:{name:string;onSave:(name:string)=>void;onBack:()=>void}){
 const [value,setValue]=useState(name==='Hoàng Nam'?'':name);const [error,setError]=useState('');
 return <div className="travel-screen polish-screen"><TravelHeader title="Làm quen một chút nhé" onBack={onBack}/><main className="travel-scroll name-screen"><img src="/images/lumi-wave.png" alt="Lumi vẫy tay chào bạn"/><span className="name-greeting">XIN CHÀO, MÌNH LÀ LUMI</span><h1>Mình gọi bạn là gì?</h1><p>Cùng tạo một hành trình mang dấu ấn của bạn.</p><form className="polish-form" onSubmit={e=>{e.preventDefault();const text=value.trim();if(!text)return setError('Bạn nhập tên muốn được gọi nhé.');onSave(text);}}><label>Tên của bạn<input autoComplete="given-name" required maxLength={40} value={value} onChange={e=>setValue(e.target.value)} placeholder="Ví dụ: Minh Anh"/></label>{error&&<p role="alert">{error}</p>}<button type="submit" className="travel-pill">Rất vui được gặp bạn <ArrowRight size={17}/></button></form><small>Tên chỉ lưu trong bản demo trên thiết bị này.</small></main></div>;
}
