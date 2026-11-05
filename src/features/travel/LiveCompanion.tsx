import {useEffect, useRef, useState} from 'react';
import {aiApi, type Context, type Event, type Job} from '../ai/api';
import {useTravel} from './TravelContext';
import {liveError, toActivePlan, waitForJob} from './livePlanning';
import {INITIAL_PREFERENCES} from '../../data/mockData';
import {Pill} from './UI';

export function LiveCompanion({dayNumber}: {dayNumber: number}) {
  const {plan, setPlan, companion} = useTravel();
  const [busy, setBusy] = useState(false); const flight = useRef(false);
  const [error, setError] = useState(''); const [data, setData] = useState<Context | null>(null);
  const {job,setJob} = companion;
  const [type, setType] = useState<Event['type']>('rest');
  const [time, setTime] = useState('14:00');
  const storageKey = `travaiy-companion-${plan.id}`;
  const day = plan.daysSchedule.find(d => d.dayNumber === dayNumber);
  useEffect(() => { setData(null); setError(''); }, [plan.id]);
  async function run(task: () => Promise<void>) {
    if (flight.current) return;
    flight.current = true; setBusy(true); setError('');
    try { await task(); } catch (e) {setError(liveError(e));}
    finally {flight.current = false; setBusy(false);}
  }
  async function refresh() {
    const trip = (await aiApi.trip(plan.id)).trip;
    setPlan(toActivePlan(trip, plan)); return trip;
  }
  async function propose() {
    const current = await refresh();
    if (current.status !== 'ACTIVE') throw new Error('Bấm bắt đầu chuyến đi trước khi yêu cầu điều chỉnh.');
    const [hour, minute] = time.split(':').map(Number);
    const end = Math.min(1439, hour * 60 + minute + 30);
    const event: Event = {type, date: day!.dateText, startTime: time, endTime: `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`, delayMinutes: type === 'delay' ? 30 : null, source: 'user', observedAt: new Date().toISOString()};
    const stored = sessionStorage.getItem(storageKey);
    const pending = stored ? JSON.parse(stored) : {key: crypto.randomUUID(), event, version: current.version};
    sessionStorage.setItem(storageKey, JSON.stringify(pending));
    const preferences = JSON.parse(localStorage.getItem('travaiy-user-preferences-v1') || 'null') || INITIAL_PREFERENCES;
    const submitted = pending.jobId ? await aiApi.job(current.id, pending.jobId)
      : await aiApi.submit({...current, version: pending.version}, preferences, pending.key, pending.event);
    pending.jobId = submitted.id; sessionStorage.setItem(storageKey, JSON.stringify(pending));
    let result: Job;
    try {result = await waitForJob(current.id, submitted);}
    catch(error){const latest=await aiApi.job(current.id,submitted.id).catch(()=>null);if(latest?.state==='FAILED')sessionStorage.removeItem(storageKey);throw error;}
    setJob(result);
    if (result.state === 'SUCCEEDED' && !result.changes.length) sessionStorage.removeItem(storageKey);
  }
  async function act(action: 'apply' | 'dismiss' | 'undo') {
    const current = await refresh();
    const result = await aiApi.action(current, job!, action);
    setJob(result); await refresh();
    if (action !== 'apply') sessionStorage.removeItem(storageKey);
  }
  const applied = !!job?.appliedVersion && !job?.undoneVersion;
  const pending = job && !job.appliedVersion && !job.dismissed && job.changes.length > 0;
  const hours = data?.weather.hours?.filter(h => h.time.startsWith(day?.dateText || '') && Number(h.time.slice(11,13)) >= 8 && Number(h.time.slice(11,13)) <= 20);
  return <section className="adaptive-inline adaptive-inline-picker" aria-label="Đồng hành AI">
    <div className="adaptive-inline-heading"><div><span>ĐỒNG HÀNH CÙNG BẠN</span><h2>Gợi ý tiếp theo cho bạn</h2></div><small>Ngày {dayNumber}</small></div>
    <div className="adaptive-inline-actions">
      <Pill disabled={busy || plan.backendStatus === 'ACTIVE' || plan.backendStatus === 'COMPLETED'} secondary onClick={() => void run(async () => {
        let trip = await refresh();
        if (trip.status === 'DRAFT') trip = (await aiApi.status(trip, 'PLANNED')).trip;
        if (trip.status === 'PLANNED') trip = (await aiApi.status(trip, 'ACTIVE')).trip;
        setPlan(toActivePlan(trip, plan));
      })}>{plan.backendStatus === 'ACTIVE' ? 'Đang trong chuyến đi' : plan.backendStatus === 'COMPLETED' ? 'Đã kết thúc chuyến đi' : 'Bắt đầu chuyến đi'}</Pill>
      <Pill disabled={busy} secondary onClick={() => void run(async () => setData(await aiApi.context(plan.id)))}>Xem thời tiết & đánh giá</Pill>
    </div>
    {hours?.length ? <p>Dự báo trong ngày: {Math.min(...hours.map(h => h.temperature ?? 0))}–{Math.max(...hours.map(h => h.temperature ?? 0))}°C · khả năng mưa cao nhất {Math.max(...hours.map(h => h.rainProbability ?? 0))}%. Nguồn Open-Meteo.</p> : data && <p>Chưa có dự báo cho ngày này.</p>}
    <div role="status"><p>{companion.positionStatus}</p>{companion.checking&&<p>AI đang kiểm tra lịch, vị trí và thời tiết…</p>}</div>
    <label><input type="checkbox" checked={companion.enabled} onChange={e=>companion.setEnabled(e.target.checked)}/> Tự gợi ý khi hoàn thành điểm đến và khi app đang mở</label>
    <div className="adaptive-inline-actions"><Pill secondary onClick={()=>void companion.enableNotifications()}>Bật thông báo thiết bị</Pill><Pill secondary disabled={busy||companion.checking} onClick={()=>void companion.check()}>Kiểm tra ngay</Pill></div>
    {companion.notificationStatus&&<p>{companion.notificationStatus}</p>}
    {companion.notice&&<p role="status">{companion.notice.message}</p>}
    {companion.error&&<p role="alert">{companion.error}</p>}
    <p>Chỉ theo dõi khi app đang mở và chuyến đi đang diễn ra. Không dùng dữ liệu kẹt xe. Lịch chỉ đổi khi bạn đồng ý.</p>
    <details><summary>Báo tình huống khác</summary>
    <label>Tình huống <select value={type} disabled={busy || !!pending || applied} onChange={e => setType(e.target.value as Event['type'])}><option value="rest">Muốn nghỉ 30 phút</option><option value="rain">Có mưa</option><option value="delay">Trễ 30 phút</option></select></label>
    <label>Thời điểm <input type="time" value={time} disabled={busy || !!pending || applied} onChange={e => setTime(e.target.value)}/></label>
    <p>AI sẽ đề xuất thay đổi; lịch chỉ đổi sau khi bạn đồng ý.</p>
    {!pending && !applied && <Pill disabled={busy || companion.checking || !time} onClick={() => void run(propose)}>{busy ? 'Đang xử lý…' : 'Xem đề xuất điều chỉnh'}</Pill>}
    </details>
    {pending && <div>{job.changes.map(change => <p key={change.activityId}>{plan.daysSchedule.flatMap(d => d.items).find(i => i.id === change.activityId)?.placeName || 'Hoạt động'}: {change.beforeDate} {change.beforeTime} → {change.afterDate} {change.afterTime}</p>)}<Pill disabled={busy} onClick={() => void run(() => act('apply'))}>Áp dụng đề xuất</Pill><Pill disabled={busy} secondary onClick={() => void run(() => act('dismiss'))}>Giữ lịch hiện tại</Pill></div>}
    {applied && <Pill disabled={busy} secondary onClick={() => void run(() => act('undo'))}>Hoàn tác thay đổi</Pill>}
    {job && !job.changes.length && <p>Lịch hiện tại chưa cần thay đổi.</p>}
    {error && <p role="alert" className="adaptive-error">{error}</p>}
    {data && <details><summary>Đánh giá địa điểm từ Google Maps</summary><p>Thu thập qua SerpApi · mẫu tối đa 5 đánh giá mỗi nơi.</p>{data.places.map((place, index) => <article key={place.placeId || index}>
      <h3>{place.name || plan.daysSchedule.flatMap(d => d.items).find(i => i.backendPlaceId === place.placeId)?.placeName || 'Địa điểm'}</h3>
      {place.status === 'available' ? <><p>{place.rating ?? '—'} ★ · {place.userRatingCount ?? '—'} đánh giá</p>{place.reviews?.map((review, index) => <blockquote key={index}><p>{review.text}</p><a href={review.googleMapsUri || place.googleMapsUri} target="_blank" rel="noreferrer">{review.author} · {review.rating} ★ · Xem nguồn Google Maps</a></blockquote>)}</> : <p>Chưa lấy được đánh giá khớp với địa điểm này.</p>}
    </article>)}</details>}
  </section>;
}
