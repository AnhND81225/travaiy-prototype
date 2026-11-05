import {useEffect,useRef,useState} from 'react';
import {aiApi,type Job,type LivePosition,type CompanionAdvice} from '../ai/api';
import {TokenStorage} from '../../api/core/apiConfig';
import {INITIAL_PREFERENCES} from '../../data/mockData';
import {liveError,waitForJob} from './livePlanning';
import type {ActivePlan} from './model';

export function useProactiveCompanion(plan:ActivePlan){
 const [enabled,setEnabled]=useState(true);
 const [positionStatus,setPositionStatus]=useState('Chưa bật theo dõi');
 const [notice,setNotice]=useState<CompanionAdvice|null>(null);
 const [job,setJob]=useState<Job|null>(null);
 const [checking,setChecking]=useState(false);
 const [error,setError]=useState('');
 const [notificationStatus,setNotificationStatus]=useState('');
 const position=useRef<LivePosition|null>(null), flight=useRef(false), lastCheck=useRef(0);
 const latest=useRef({plan,job,enabled});latest.current={plan,job,enabled};
 const epoch=useRef(0), queuedForce=useRef(false);
 const checkRef=useRef<(force?:boolean)=>Promise<void>>(async()=>{});
 const active=!!plan.backendTripId&&plan.backendStatus==='ACTIVE'&&enabled;
 useEffect(()=>{epoch.current++;setNotice(null);setJob(null);setError('');position.current=null;lastCheck.current=0;
  const stored=sessionStorage.getItem(`travaiy-companion-${plan.id}`);
  if(stored){try{const pending=JSON.parse(stored);if(pending.jobId)void aiApi.job(plan.id,pending.jobId).then(j=>{if(latest.current.plan.id===plan.id)setJob(j);}).catch(()=>{});}catch{/* invalid local state */}}
 },[plan.id]);
 useEffect(()=>{if(!active){epoch.current++;position.current=null;}},[active]);
 useEffect(()=>{
  if(!job||['SUCCEEDED','FAILED'].includes(job.state))return;
  let cancelled=false;const tripId=plan.id;
  void waitForJob(tripId,job).then(result=>{if(!cancelled)setJob(result);}).catch(e=>{if(!cancelled){setError(liveError(e));setJob(null);sessionStorage.removeItem(`travaiy-companion-${tripId}`);}});
  return()=>{cancelled=true;};
 },[plan.id,job?.id,job?.state]);
 async function notify(advice:CompanionAdvice){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  try{const registration=await navigator.serviceWorker.getRegistration('/');
   if(registration)await registration.showNotification('TravAIy · Đồng hành',{body:advice.message,tag:`companion-${plan.id}`,data:{url:`/trip/day/${advice.dayNumber}`}});
  }catch{setNotificationStatus('Thông báo hệ thống chưa khả dụng; đề xuất vẫn hiện trong app.');}
 }
 async function enableNotifications(){
  if(!window.isSecureContext||!('Notification' in window)||!('serviceWorker' in navigator)){setNotificationStatus('Thiết bị cần HTTPS và hỗ trợ thông báo. Bạn vẫn nhận đề xuất trong app.');return;}
  try{const permission=await Notification.requestPermission();if(permission==='granted'){await navigator.serviceWorker.register('/companion-sw.js');await navigator.serviceWorker.ready;}
   setNotificationStatus(permission==='granted'?'Đã bật thông báo thiết bị.':'Chưa được cấp quyền thông báo; vẫn thông báo trong app.');
  }catch{setNotificationStatus('Chưa bật được thông báo trên thiết bị này.');}
 }
 async function check(force=false){
  const current=latest.current;
  if(!current.enabled||current.plan.backendStatus!=='ACTIVE'||!TokenStorage.isAuthenticated()||document.hidden)return;
  if(flight.current){if(force)queuedForce.current=true;return;}
  if(!force&&Date.now()-lastCheck.current<300000)return;
  if(current.job&&(!['FAILED','SUCCEEDED'].includes(current.job.state)||(!current.job.appliedVersion&&!current.job.dismissed&&current.job.changes.length>0)))return;
  const runEpoch=epoch.current;const tripId=current.plan.id;
  flight.current=true;lastCheck.current=Date.now();setChecking(true);setError('');
  const valid=()=>epoch.current===runEpoch&&latest.current.plan.id===tripId&&latest.current.enabled&&TokenStorage.isAuthenticated();
  try{
   const gps=position.current&&Date.now()-Date.parse(position.current.observedAt)<120000?position.current:null;
   const advice=await aiApi.assess(tripId,gps);if(!valid())return;
   const progress=(current.plan.backendCompletedIds||[]).slice().sort().join(',');
   const key=`${advice.key}:${progress}`;
   const seenKey=`travaiy-companion-seen-${tripId}`;
   const seen:string[]=JSON.parse(sessionStorage.getItem(seenKey)||'[]');
   setNotice(advice);
   if(seen.includes(key))return;
   if(advice.event){
    const trip=(await aiApi.trip(tripId)).trip;if(!valid()||trip.status!=='ACTIVE')return;
    const storageKey=`travaiy-companion-${tripId}`;
    const stored=sessionStorage.getItem(storageKey);
    const pending=stored?JSON.parse(stored):{key:crypto.randomUUID(),event:advice.event,version:trip.version};
    sessionStorage.setItem(storageKey,JSON.stringify(pending));
    const preferences=JSON.parse(localStorage.getItem('travaiy-user-preferences-v1')||'null')||INITIAL_PREFERENCES;
    const submitted=pending.jobId?await aiApi.job(tripId,pending.jobId):await aiApi.submit({...trip,version:pending.version},preferences,pending.key,pending.event);
    pending.jobId=submitted.id;sessionStorage.setItem(storageKey,JSON.stringify(pending));
    const result=await waitForJob(tripId,submitted);if(!valid())return;
    setJob(result);
    if(!result.changes.length)sessionStorage.removeItem(storageKey);
   }
   if(!valid())return;
   sessionStorage.setItem(seenKey,JSON.stringify([...seen,key].slice(-50)));
   await notify(advice);
  }catch(e){if(valid()){setError(liveError(e));const storageKey=`travaiy-companion-${tripId}`;const stored=sessionStorage.getItem(storageKey);if(stored){try{const pending=JSON.parse(stored);if(pending.jobId){const failed=await aiApi.job(tripId,pending.jobId);if(failed.state==='FAILED')sessionStorage.removeItem(storageKey);}}catch{/* retain unknown job for retry */}}}}
  finally{flight.current=false;setChecking(false);if(queuedForce.current){queuedForce.current=false;void checkRef.current(true);}}
 }
 checkRef.current=check;
 useEffect(()=>{
  if(!active){setPositionStatus('Theo dõi đang tắt');return;}
  let watch:number|undefined;
  const stop=()=>{if(watch!==undefined){navigator.geolocation.clearWatch(watch);watch=undefined;}position.current=null;};
  const start=()=>{
   if(document.hidden||!TokenStorage.isAuthenticated()){stop();setPositionStatus('Tạm dừng khi app không hoạt động');return;}
   if(!navigator.geolocation){setPositionStatus('Thiết bị chưa hỗ trợ vị trí');return;}
   if(watch!==undefined)return;
   setPositionStatus('Đang xin quyền / lấy vị trí…');
   watch=navigator.geolocation.watchPosition(p=>{
    const firstFix=!position.current;
    position.current={lat:p.coords.latitude,lng:p.coords.longitude,accuracy:p.coords.accuracy,observedAt:new Date(p.timestamp).toISOString()};
    setPositionStatus(p.coords.accuracy<=150?'Đang theo dõi vị trí khi app mở':'Vị trí chưa đủ chính xác');
    void checkRef.current(firstFix);
   },e=>{position.current=null;setPositionStatus(e.code===1?'Bạn chưa cho phép vị trí; AI vẫn dùng lịch và thời tiết điểm đến.':'Chưa lấy được vị trí; sẽ thử lại.');},{enableHighAccuracy:true,maximumAge:30000,timeout:15000});
  };
  start();const tick=window.setInterval(()=>{start();void checkRef.current();},30000);
  document.addEventListener('visibilitychange',start);window.addEventListener('travaiy-auth-change',start);
  return()=>{stop();clearInterval(tick);document.removeEventListener('visibilitychange',start);window.removeEventListener('travaiy-auth-change',start);};
 },[active,plan.id]);
 const progress=(plan.backendCompletedIds||[]).slice().sort().join(',');
 useEffect(()=>{if(active)void checkRef.current(true);},[active,plan.id,progress]);
 return {enabled,setEnabled,positionStatus,notice,clearNotice:()=>setNotice(null),job,setJob,checking,error,notificationStatus,enableNotifications,check:()=>checkRef.current(true)};
}
