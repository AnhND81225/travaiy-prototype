import React, {useEffect, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {TokenStorage} from '../../api/core/apiConfig';
import {aiApi, paceFor, type Context, type Event, type Job, type Place, type Trip, type View, type Wizard} from './api';
import type {UserPreferences} from '../../types/travel';
import './ai.css';
import {GeoapifyMap} from './GeoapifyMap';

const money = (value: number) => new Intl.NumberFormat('vi-VN').format(value) + ' ₫';
const localDate = () => new Intl.DateTimeFormat('en-CA', {timeZone: 'Asia/Ho_Chi_Minh'}).format(new Date());
const friendly: Record<string,string> = {
  PLAN_VERSION_CONFLICT: 'Chuyến đi đã thay đổi. Tải lại chuyến và gửi yêu cầu mới.',
  QUOTA_EXHAUSTED: 'Chuyến này đã dùng hết lượt tạo lịch.',
  NO_FEASIBLE_PLAN: 'Chưa xếp được lịch phù hợp. Hãy giảm địa điểm hoặc mở rộng thời gian.',
  AI_UNAVAILABLE: 'Chưa kết nối được AI. Kiểm tra cấu hình dịch vụ rồi thử lại.',
  AI_TIMEOUT: 'AI phản hồi chậm. Bạn có thể thử lại sau.',
  INVALID_AI_OUTPUT: 'Kết quả AI chưa đạt kiểm tra. Lịch hiện tại được giữ nguyên.',
  TRAVEL_DATA_UNAVAILABLE: 'Chưa lấy được thời tiết và đánh giá. Vui lòng thử lại.',
};
const warnings: Record<string,string> = {
  MOCK_PLAN:'Đang dùng lịch mô phỏng để thử luồng. Bật Jev ở máy chủ để nhận đề xuất AI thật.',
  TRAVEL_TIME_ESTIMATED:'Chưa tính thời gian di chuyển vào lịch mô phỏng.',
  OPENING_HOURS_UNKNOWN:'Một số địa điểm chưa có giờ mở cửa xác minh. Hãy kiểm tra trước khi đi.',
  COST_UNKNOWN:'Chưa đủ giá tham khảo để tính tổng ngân sách chuyến đi.',
  LOCATION_UNKNOWN:'Một số địa điểm chưa có tọa độ xác minh.',
  ROUTE_DRIVING_ESTIMATE:'Thời gian di chuyển ước tính theo ô tô, chưa tính giao thông thực tế.',
  ROUTING_UNAVAILABLE:'Chưa lấy được tuyến đường. Cần kiểm tra lại thời gian di chuyển.',
  WEATHER_UNAVAILABLE:'Chưa có dự báo cho ngày đi. Hãy kiểm tra lại gần ngày khởi hành.',
  RAIN_RISK:'Dự báo có khả năng mưa khi bạn hoạt động ngoài trời. Xem Đồng hành để điều chỉnh.',
  REVIEWS_PARTIAL:'Một số địa điểm chưa lấy được đánh giá Google khớp chính xác.',
  BUDGET_EXCEEDED:'Chi phí hoạt động dự kiến vượt ngân sách đã chọn.',
  NO_CHANGES_NEEDED:'Tình huống này chưa ảnh hưởng đến lịch, bạn có thể giữ nguyên.',
  STAY_TIME_BUFFER:'Đã chừa 30 phút nhận/trả phòng; đây chưa phải xác nhận đặt phòng.',
};

export function AIWorkspace({preferences, onPreferences}: {preferences: UserPreferences; onPreferences: (p: UserPreferences) => void}) {
  const [signedIn,setSignedIn] = useState(()=>TokenStorage.isAuthenticated());
  const [email,setEmail] = useState(''); const [password,setPassword] = useState('');
  const [destinations,setDestinations] = useState<{id:string;name:string}[]>([]);
  const [destination,setDestination] = useState(''); const [places,setPlaces] = useState<Place[]>([]);
  const [selected,setSelected] = useState<string[]>([]);
  const [start,setStart] = useState(localDate); const [end,setEnd] = useState(localDate);
  const [count,setCount] = useState(1); const [budget,setBudget] = useState(1500000);
  const [trips,setTrips] = useState<{id:string;title:string;status:string}[]>([]);
  const [view,setView] = useState<View | null>(null); const trip = view?.trip;
  const [job,setJob] = useState<Job | null>(null); const [data,setData] = useState<Context | null>(null);
  const [busy,setBusy] = useState(''); const [error,setError] = useState('');
  const [eventType,setEventType] = useState<Event['type']>('rest');
  const [eventDate,setEventDate] = useState(localDate); const [from,setFrom] = useState('14:00'); const [to,setTo] = useState('15:00');
  const [delay,setDelay] = useState(30);
  const mounted = useRef(true); const inFlight = useRef(false);
  const polling = job && ['QUEUED','RUNNING'].includes(job.state);
  const disabled = !!busy || !!polling;
  const editable = view && ['OWNER','EDITOR'].includes(view.role) && trip?.status !== 'COMPLETED';

  function report(e: unknown) {
    const code = (e as {code?: string})?.code;
    setError(friendly[code || ''] || (e instanceof Error ? e.message : 'Có lỗi, vui lòng thử lại.'));
    if (!TokenStorage.isAuthenticated()) setSignedIn(false);
  }
  async function run(label: string, task: () => Promise<void>) {
    if (inFlight.current) return;
    inFlight.current = true; setBusy(label); setError('');
    try { await task(); } catch(e) { report(e); }
    finally { inFlight.current = false; if (mounted.current) setBusy(''); }
  }
  async function reload(id: string) { const next = await aiApi.trip(id); setView(next); return next.trip; }
  async function openTrip(id: string) {
    await run('Đang mở chuyến đi…', async () => {
      const next = await reload(id); setJob(null); setData(null); setEventDate(next.wizard.startDate || localDate());
      sessionStorage.setItem('travelowkey-active-trip', id);
      const pending = sessionStorage.getItem(`travelowkey-job-${id}`);
      if (pending) setJob(await aiApi.job(id,pending));
    });
  }
  useEffect(() => { mounted.current = true; return () => {mounted.current=false;}; }, []);
  useEffect(() => {
    let cancelled=false;
    aiApi.destinations().then(r => {if(!cancelled){setDestinations(r.items);setDestination(r.items[0]?.id || '');}}).catch(report);
    return () => {cancelled=true;};
  }, []);
  useEffect(() => {
    let cancelled=false; setPlaces([]);setSelected([]);
    if(destination) aiApi.places(destination).then(r => {if(!cancelled)setPlaces(r.items.filter(p=>p.category!=='stay'));}).catch(report);
    return () => {cancelled=true;};
  }, [destination]);
  useEffect(() => {
    if(signedIn) aiApi.trips().then(r=>setTrips(r.items)).catch(report);
  }, [signedIn, trip?.id, trip?.status]);
  useEffect(() => {
    if (!polling || !trip || !job) return;
    let cancelled=false; let timer: ReturnType<typeof setTimeout>;
    const poll = async () => {
      try {
        const next = await aiApi.job(trip.id,job.id);
        if(cancelled) return;
        setJob(next);
        if(next.state==='SUCCEEDED') {await reload(trip.id);}
        else if(next.state==='FAILED') setError(friendly[next.errorCode || ''] || 'Không tạo được lịch. Hãy thử lại.');
        else timer=setTimeout(poll,1500);
      } catch(e) {if(!cancelled){report(e);timer=setTimeout(poll,5000);}}
    };
    timer=setTimeout(poll,1000);
    return () => {cancelled=true;clearTimeout(timer);};
  }, [polling,trip?.id,job?.id]);

  async function submit(current: Trip, event?: Event) {
    // Persist the key before sending; retrying an uncertain POST uses the same payload/key.
    const body=JSON.stringify({version:current.version,preferences,event:event ? {...event,observedAt:undefined} : undefined});
    const storage=`travelowkey-submit-${current.id}`;
    const previous=JSON.parse(sessionStorage.getItem(storage) || 'null') as {body:string;key:string;event?:Event} | null;
    const key=previous?.body===body ? previous.key : crypto.randomUUID();
    const stableEvent=previous?.body===body ? previous.event : event;
    sessionStorage.setItem(storage,JSON.stringify({body,key,event:stableEvent}));
    const next=await aiApi.submit(current,preferences,key,stableEvent);
    sessionStorage.removeItem(storage);
    sessionStorage.setItem(`travelowkey-job-${current.id}`,next.id); setJob(next);
  }
  async function createPlan() {
    if (!selected.length || !start || end<start || (Date.parse(end)-Date.parse(start))/86400000>=30) {setError('Chọn địa điểm và thời gian chuyến đi từ 1 đến 30 ngày.');return;}
    await run('Đang chuẩn bị chuyến đi…',async()=>{
      const name=destinations.find(d=>d.id===destination)?.name || 'Chuyến đi';
      const created=await aiApi.create(name);
      const wizard: Wizard={destinationId:destination,startDate:start,endDate:end,departureTime:'08:00',returnTime:'20:00',
        companionType:count===1?'solo':'group',companionCount:count,budgetVnd:budget,categories:[],pace:paceFor(preferences.travelStyle),
        transport:'car',accommodation:'',notes:'',stay:null};
      const saved=await aiApi.save(created.trip,wizard,selected);setView(saved);setEventDate(start);setData(null);
      sessionStorage.setItem('travelowkey-active-trip',saved.trip.id);
      await submit(saved.trip);
    });
  }
  const toggleInterest=(value:string)=>onPreferences({...preferences,interests:preferences.interests.includes(value)?preferences.interests.filter(x=>x!==value):[...preferences.interests,value]});
  const activeWeather=data?.weather.hours?.filter(h=>h.time.slice(0,10)===eventDate && h.time.slice(11,16)>='08:00' && h.time.slice(11,16)<='20:00') || [];
  const total=trip?.selectedPlaces.reduce((sum,p)=>sum+(p.estimatedCostVnd || 0)*trip.wizard.companionCount,0) || 0;
  const placeName=(id:string|null)=>trip?.selectedPlaces.find(p=>p.id===id)?.name || 'Nghỉ / di chuyển';

  return <main className="ai-workspace">
    <header><Link to="/home">← Trang chủ</Link><span>TRAVELOWKEY</span></header>
    <section className="ai-hero"><p>CHUYẾN ĐI THEO CÁCH CỦA BẠN</p><h1>Lên lịch hợp gu.<br/>Đi cùng bạn.</h1><p>Sở thích của bạn, đánh giá địa điểm và thời tiết cùng giúp tạo một lịch trình phù hợp hơn.</p></section>
    {error && <div role="alert" className="ai-error">{error}<button onClick={()=>setError('')} aria-label="Đóng thông báo">×</button></div>}
    {busy && <p role="status">{busy}</p>}
    {!signedIn ? <form className="ai-card" onSubmit={e=>{e.preventDefault();void run('Đang đăng nhập…',async()=>{await aiApi.login(email,password);setPassword('');setSignedIn(true);});}}>
      <h2>Đăng nhập để lưu chuyến đi</h2><label>Email<input type="email" required autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)}/></label>
      <label>Mật khẩu<input type="password" required autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={disabled}>Đăng nhập</button>
    </form> : <>
      <section className="ai-card"><div className="ai-row"><h2>Chuyến đi của bạn</h2><button className="ai-secondary" disabled={disabled} onClick={()=>{TokenStorage.clearTokens();setSignedIn(false);setView(null);setJob(null);setData(null);setTrips([]);}}>Đăng xuất</button></div>
        {trips.map(t=><button key={t.id} className="ai-trip" disabled={disabled} onClick={()=>void openTrip(t.id)}>{t.title}<small>{t.status}</small></button>)}
        {trip && <button className="ai-secondary" disabled={disabled} onClick={()=>{setView(null);setJob(null);setData(null);}}>+ Tạo chuyến mới</button>}
      </section>
      <section className="ai-card"><h2>Gu du lịch của bạn</h2><p>Đã lấy từ các lựa chọn ban đầu. Bạn có thể chỉnh trước khi tạo hoặc điều chỉnh lịch.</p>
        <div className="ai-chips">{['Ăn uống & cà phê','Thiên nhiên & khám phá','Văn hóa & lịch sử','Chụp ảnh & check-in','Nghỉ dưỡng & thư giãn','Vui chơi & mua sắm'].map(i=><button type="button" disabled={disabled} key={i} aria-pressed={preferences.interests.includes(i)} onClick={()=>toggleInterest(i)}>{i}</button>)}</div>
        <label>Nhịp đi<select disabled={disabled} value={preferences.travelStyle} onChange={e=>onPreferences({...preferences,travelStyle:e.target.value})}>{Array.from(new Set([preferences.travelStyle,'Thư giãn','Cân bằng','Năng động'])).map(s=><option key={s}>{s}</option>)}</select></label>
        <p><b>Ưu tiên:</b> {preferences.priorities.join(' · ') || 'Chưa chọn'}<br/><b>Thời gian yêu thích:</b> {preferences.timeOfDay.join(' · ') || 'Linh hoạt'}</p><Link to="/onboarding/step-3?from=profile">Chỉnh ưu tiên</Link>
      </section>
      {!trip ? <section className="ai-card"><h2>01 / Lên kế hoạch</h2>
        <label>Điểm đến<select value={destination} onChange={e=>setDestination(e.target.value)} disabled={disabled}>{destinations.map(d=><option value={d.id} key={d.id}>{d.name}</option>)}</select></label>
        {!destinations.length && <p>Chưa có điểm đến. Cần khởi tạo catalog demo ở backend.</p>}
        <div className="ai-row"><label>Ngày đi<input type="date" value={start} onChange={e=>{setStart(e.target.value);if(end<e.target.value)setEnd(e.target.value);}}/></label><label>Ngày về<input type="date" min={start} value={end} onChange={e=>setEnd(e.target.value)}/></label></div>
        <div className="ai-row"><label>Số người<input type="number" min="1" max="100" value={count} onChange={e=>setCount(Math.max(1,Math.min(100,Number(e.target.value))))}/></label><label>Ngân sách (₫)<input type="number" min="0" step="100000" value={budget} onChange={e=>setBudget(Math.max(0,Number(e.target.value)))}/></label></div>
        <p>Chọn các nơi muốn ghé. AI ưu tiên theo sở thích và xếp giờ cho bạn.</p>
        {places.map(p=><label className="ai-place" key={p.id}><input type="checkbox" checked={selected.includes(p.id)} onChange={()=>setSelected(s=>s.includes(p.id)?s.filter(id=>id!==p.id):[...s,p.id])}/><span><b>{p.name}</b><small>{p.indoor?'Trong nhà':'Ngoài trời'} · {p.durationMinutes} phút · {p.estimatedCostVnd===null?'Chưa biết giá':money(p.estimatedCostVnd)}</small></span></label>)}
        <button disabled={disabled || !selected.length} onClick={()=>void createPlan()}>Tạo lịch theo sở thích</button>
      </section> : <>
        <section className="ai-card"><div className="ai-row"><h2>{trip.title}</h2><span className="ai-badge">{trip.planMode==='LIVE'?'AI Jev':trip.planMode==='MOCK'?'Mô phỏng':'Bản nháp'}</span></div>
          <p>{trip.wizard.startDate} → {trip.wizard.endDate} · {trip.wizard.companionCount} người</p>
          <p>Ngân sách: <b>{money(trip.wizard.budgetVnd || 0)}</b>.<br/>{trip.selectedPlaces.some(p=>p.estimatedCostVnd!==null)?`Chi phí hoạt động đã biết: ${money(total)}.`:'Chưa có đủ giá tham khảo để ước tính chi phí.'}<small>Chưa bao gồm khách sạn và phương tiện.</small></p>
          {total>trip.wizard.budgetVnd && <p role="alert">Chi phí hoạt động vượt ngân sách đã đặt.</p>}
          <div className="ai-actions"><button className="ai-secondary" disabled={disabled} onClick={()=>void run('Đang tải lại…',async()=>{await reload(trip.id);})}>Tải lại</button>
            {editable && <button disabled={disabled} onClick={()=>void run('Đang gửi yêu cầu…',()=>submit(trip))}>Tạo lại theo gu hiện tại</button>}
            {editable && trip.days.some(d=>d.activities.length>0) && trip.status!=='ACTIVE' && <button disabled={disabled} onClick={()=>void run('Đang bắt đầu chuyến…',async()=>{let current=trip;if(current.status==='DRAFT')current=(await aiApi.status(current,'PLANNED')).trip;setView(await aiApi.status(current,'ACTIVE'));})}>Bắt đầu chuyến đi</button>}
            {editable && trip.status==='ACTIVE' && <button className="ai-secondary" disabled={disabled} onClick={()=>void run('Đang kết thúc chuyến…',async()=>{setView(await aiApi.status(trip,'COMPLETED'));})}>Kết thúc chuyến</button>}
          </div>
          {polling && <p role="status">Đang đánh giá địa điểm và kiểm tra lịch… Bạn có thể mở lại chuyến để xem kết quả.</p>}
          {Array.from(new Set(job?.proposal?.warnings.map(w=>w.code) || [])).map(code=><p className="ai-warning" key={code}>{warnings[code] || 'Có thông tin cần kiểm tra lại trước chuyến đi.'}</p>)}
          {trip.days.map(day=><div key={day.date} className="ai-day"><h3>{day.date}</h3>{day.activities.map((a,i)=>{
            const previous=day.activities[i-1];const minutes=previous?.placeId && a.placeId ? data?.routing.minutes?.[previous.placeId]?.[a.placeId] : null;
            return <React.Fragment key={a.id}>{minutes!=null && <small className="ai-transfer">↳ Di chuyển ước tính {minutes} phút (ô tô)</small>}<div className="ai-activity"><time>{a.startTime}</time><div><b>{placeName(a.placeId)}</b><small>{a.durationMinutes} phút{a.locked?' · Đã khóa':''}</small></div><input type="checkbox" aria-label={`Hoàn thành ${placeName(a.placeId)}`} disabled={disabled || !editable || trip.status!=='ACTIVE'} checked={trip.completedActivityIds.includes(a.id)} onChange={e=>void run('Đang lưu tiến độ…',async()=>setView(await aiApi.complete(trip,a,e.target.checked)))}/></div></React.Fragment>;
          })}</div>)}
        </section>
        <section className="ai-card"><h2>02 / Đồng hành cùng bạn</h2><p>{trip.completedActivityIds.length} hoạt động hoàn thành. Các hoạt động đã hoàn thành sẽ được giữ khi đổi lịch.</p>
          <button disabled={disabled} onClick={()=>void run('Đang lấy thời tiết và đánh giá…',async()=>setData(await aiApi.context(trip.id)))}>Xem thời tiết & đánh giá</button>
          {data && <><small>Cập nhật {new Date(data.observedAt).toLocaleString('vi-VN')}</small><p><a href="https://open-meteo.com/" target="_blank" rel="noreferrer">Thời tiết Open-Meteo</a> · {data.weather.status==='available'?'Dự báo theo giờ':'Chưa có dự báo cho ngày này'}</p>
            <div className="ai-weather">{activeWeather.filter((_,i)=>i%3===0).map(h=><div key={h.time}><b>{h.time.slice(11,16)}</b><span>{h.temperature ?? '—'}°C</span><small>Mưa {h.rainProbability ?? '—'}%</small></div>)}</div>
            {activeWeather.some(h=>(h.rainProbability || 0)>=60) && <p className="ai-warning">Có khả năng mưa. Chọn khung giờ dưới đây để xem đề xuất đổi lịch ngoài trời.</p>}
          </>}
          <label>Tình huống<select value={eventType} onChange={e=>setEventType(e.target.value as Event['type'])}><option value="rest">Mình mệt, muốn nghỉ</option><option value="rain">Có mưa, tránh hoạt động ngoài trời</option><option value="delay">Mình đang trễ lịch</option></select></label>
          <label>Ngày<input type="date" value={eventDate} min={trip.wizard.startDate} max={trip.wizard.endDate} onChange={e=>setEventDate(e.target.value)}/></label>
          <div className="ai-row"><label>Từ<input type="time" value={from} onChange={e=>setFrom(e.target.value)}/></label><label>Đến<input type="time" value={to} onChange={e=>setTo(e.target.value)}/></label></div>
          {eventType==='delay' && <label>Trễ bao nhiêu phút<input type="number" min="1" max="1440" value={delay} onChange={e=>setDelay(Number(e.target.value))}/></label>}
          <button disabled={disabled || !editable || !trip.days.length || from>=to} onClick={()=>void run('Đang tìm phương án…',()=>submit(trip,{type:eventType,date:eventDate,startTime:from,endTime:to,delayMinutes:eventType==='delay'?delay:null,source:'user',observedAt:new Date().toISOString()}))}>Xem đề xuất điều chỉnh</button>
          {job?.operation==='ADAPT' && job.state==='SUCCEEDED' && !job.dismissed && <div className="ai-proposal"><h3>Đề xuất thay đổi</h3>{!job.changes.length && <p>Lịch hiện tại không cần thay đổi.</p>}{job.changes.map(c=><p key={c.activityId}>{placeName(trip.days.flatMap(d=>d.activities).find(a=>a.id===c.activityId)?.placeId || null)}<br/>{c.beforeDate} {c.beforeTime} → {c.afterDate} {c.afterTime}</p>)}<div className="ai-actions">{(!job.appliedVersion ? ['apply','dismiss'] as const : !job.undoneVersion ? ['undo'] as const : []).map(action=><button key={action} disabled={disabled || !editable || (action==='apply' && trip.version!==job.baseVersion) || (action==='undo' && trip.version!==job.appliedVersion)} onClick={()=>void run('Đang cập nhật lịch…',async()=>{setJob(await aiApi.action(trip,job,action));await reload(trip.id);})}>{action==='apply'?'Đồng ý đổi lịch':action==='dismiss'?'Giữ lịch cũ':'Hoàn tác'}</button>)}</div></div>}
        </section>
        {data && <section className="ai-card"><h2>Đánh giá từ Google Maps</h2><p>Mẫu tối đa 5 review mỗi nơi. Nội dung do người dùng Google đóng góp.</p>{data.places.map((p,i)=>p.status==='available'?<article className="ai-review" key={p.placeId}><a href={p.googleMapsUri} target="_blank" rel="noreferrer"><b>{p.name}</b></a>{p.provider === 'serpapi' && <p>Thu thập qua SerpApi · Nguồn Google Maps</p>}<p>★ {p.rating ?? '—'} · {p.userRatingCount ?? 0} lượt đánh giá</p>{p.reviews?.map((r,j)=><blockquote key={j}><a href={r.authorUri || r.googleMapsUri || p.googleMapsUri} target="_blank" rel="noreferrer">{r.author}</a> · {r.rating}★<p>{r.text}</p><a href={r.googleMapsUri || p.googleMapsUri} target="_blank" rel="noreferrer">Xem review trên Google Maps</a></blockquote>)}</article>:<p key={p.placeId || i}>{placeName(p.placeId || null)}: chưa lấy được đánh giá xác nhận.</p>)}<p><a href="https://maps.google.com" target="_blank" rel="noreferrer">Google Maps</a></p></section>}
        <GeoapifyMap places={trip.selectedPlaces} />
      </>}
    </>}
    <footer>Travelowkey · Lịch trình là đề xuất, thời tiết và thời gian di chuyển có thể thay đổi.</footer>
  </main>;
}
