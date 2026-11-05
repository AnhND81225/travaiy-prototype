import {useProactiveCompanion} from './useProactiveCompanion';
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {aiApi} from '../ai/api';
import {liveError, toActivePlan} from './livePlanning';
import type { Expense } from './expenseModel';
import { INITIAL_PLAN } from './fixtures';
import { usePhotoStore } from './usePhotoStore';
import { createAdaptiveSuggestion, matchesPlan, type AdaptiveScenario, type AdaptiveSuggestion } from './adaptive';
import type { LocalDocument, LocalPost } from './localFiles';
import type { ActivePlan, PhotoMoment } from './model';
type SharedPlace={id:string;name:string;location:{lat:number;lng:number};sharedBy:string};
export type GroupMessage={id:string;sender:string;text:string;sentAt:string;mine:boolean};
export function useStored<T,>(key:string, initial:T) {const [value,setValue]=useState<T>(()=>{try{const saved=localStorage.getItem(key);return saved?JSON.parse(saved):initial;}catch{return initial;}});useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(value));}catch{/* Storage denied: retain session state. */}},[key,value]);return [value,setValue] as const;}
function useTravelValue(){
 const [plan,setPlan]=useStored<ActivePlan>('travaiy-reference-plan-v1',INITIAL_PLAN);
 useEffect(()=>{if(plan.id==='trip-danang-3n2d'||plan.id==='trip-hcm-3n2d')setPlan(INITIAL_PLAN);},[]);
 const companion=useProactiveCompanion(plan);
 const [documents,setDocuments]=useStored<LocalDocument[]>('travaiy-doc-meta-v1',[]);
 const [localPosts,setLocalPosts]=useStored<LocalPost[]>('travaiy-local-posts-v1',[]);
 const [trips,setTrips]=useStored<ActivePlan[]>('travaiy-trips-v1',[INITIAL_PLAN]);
 const [tripStatuses,setTripStatuses]=useStored<Record<string,'planned'|'active'|'completed'>>('travaiy-trip-status-v1',{});
 useEffect(()=>{if(plan.backendTripId&&plan.backendStatus)setTripStatuses(prev=>({...prev,[plan.id]:plan.backendStatus==='ACTIVE'?'active':plan.backendStatus==='COMPLETED'?'completed':'planned'}));},[plan.id,plan.backendStatus]);
 const [entitlements,setEntitlements]=useStored<Record<string,{tier:'free'|'solo'|'group';used:number;requests:string[]}>>('travaiy-access-v1',{});
 const [expenses,setExpenses]=useStored<Expense[]>('travaiy-expenses-v2',[]);
 const [completedActivities,setCompletedActivities]=useStored<Record<string,string[]>>('travaiy-completed-activities-v1',{});
 const [syncError,setSyncError]=useState('');const completionBusy=useRef(false);
 useEffect(()=>{if(plan.backendTripId)setCompletedActivities(prev=>({...prev,[plan.id]:plan.backendCompletedIds||[]}));},[plan.id,plan.backendVersion]);
 const toggleActivity=async(id:string)=>{
  if(plan.backendTripId){
   if(completionBusy.current)return;completionBusy.current=true;setSyncError('');
   try{const current=(await aiApi.trip(plan.id)).trip;const activity=current.days.flatMap(d=>d.activities).find(a=>a.id===id);if(!activity)throw new Error('Không tìm thấy hoạt động.');
    const next=(await aiApi.complete(current,activity,!current.completedActivityIds.includes(id))).trip;setPlan(toActivePlan(next,plan));
   }catch(error){setSyncError(liveError(error));}finally{completionBusy.current=false;}return;
  }
  setCompletedActivities(prev=>{const ids=prev[plan.id]||[];return {...prev,[plan.id]:ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]};});
 };
 const [memberships,setMemberships]=useStored<string[]>('travaiy-memberships-v1',[]);
 const [groupMessages,setGroupMessages]=useStored<GroupMessage[]>('travaiy-group-messages-v1',[{id:'sample-1',sender:'Linh Chi',text:'Mọi người nhớ mang áo mưa nhé, chiều có thể mưa nhẹ.',sentAt:'09:20',mine:false},{id:'sample-2',sender:'Hoàng Nam',text:'Mình đã cập nhật lịch trình chung rồi.',sentAt:'09:24',mine:false}]);
 useEffect(()=>{setTrips(prev=>{const existing=prev.find(t=>t.id===plan.id);const legacy=(t:ActivePlan)=>t.id==='trip-danang-3n2d'||t.id==='trip-hcm-3n2d';if(existing&&matchesPlan(existing,plan)&&!prev.some(legacy))return prev;return [plan,...prev.filter(t=>t.id!==plan.id&&!legacy(t))];});},[plan]);
 const accessFor=(id:string)=>entitlements[id]||{tier:'free' as const,used:0,requests:[]};
 const accessLimit=(tier:'free'|'solo'|'group')=>tier==='free'?3:tier==='solo'?12:30;
 const selectAccess=(id:string,tier:'free'|'solo'|'group')=>setEntitlements(prev=>({...prev,[id]:{...(prev[id]||{used:0,requests:[]}),tier}}));
 const consumeAI=(id:string,requestId:string)=>{
  const access=accessFor(id);if(access.requests.includes(requestId))return true;if(access.used>=accessLimit(access.tier))return false;
  setEntitlements(prev=>{const value=prev[id]||{tier:'free' as const,used:0,requests:[]};if(value.requests.includes(requestId)||value.used>=accessLimit(value.tier))return prev;return {...prev,[id]:{...value,used:value.used+1,requests:[...value.requests,requestId]}};});return true;
 };
 const [adaptive,setAdaptive]=useStored<AdaptiveSuggestion|null>('travaiy-adaptive-v1',null);
 const currentAdaptive=adaptive?.tripId===plan.id?adaptive:null;
 const triggerAdaptive=(scenario:AdaptiveScenario)=>{
  if(currentAdaptive?.status==='applied')return 'Hoàn tác điều chỉnh hiện tại trước khi thử tình huống khác.';
  const next=createAdaptiveSuggestion(plan,scenario,`adaptive-${Date.now()}`);
  if(!next)return 'Chuyến đi chưa có hoạt động có thể đổi. Hãy dùng chuyến demo hoặc thêm hoạt động trước.';
  setAdaptive(next);return '';
 };
 const readAdaptive=()=>setAdaptive(prev=>prev?{...prev,unread:false}:prev);
 const dismissAdaptive=()=>setAdaptive(prev=>prev?{...prev,status:'dismissed',unread:false}:prev);
 const applyAdaptive=()=>{
  if(!currentAdaptive||currentAdaptive.status!=='pending')return 'Đề xuất này không còn chờ áp dụng.';
  if(!matchesPlan(plan,currentAdaptive.before))return 'Lịch đã thay đổi. Hãy tạo lại đề xuất từ lịch hiện tại.';
  setPlan(currentAdaptive.after);setAdaptive({...currentAdaptive,status:'applied',unread:false});return '';
 };
 const undoAdaptive=()=>{
  if(!currentAdaptive||currentAdaptive.status!=='applied')return 'Không có điều chỉnh để hoàn tác.';
  if(!matchesPlan(plan,currentAdaptive.after))return 'Lịch đã được sửa thêm. Không thể hoàn tác tự động để tránh mất thay đổi.';
  setPlan(currentAdaptive.before);setAdaptive({...currentAdaptive,status:'undone',unread:false});return '';
 };
 const startAdaptiveDemo=()=>{setPlan(JSON.parse(JSON.stringify(INITIAL_PLAN)));setAdaptive(null);};
 const {photos:storedPhotos,setPhotos,photoStorageStatus}=usePhotoStore();
 const photos=storedPhotos.filter(p=>!p.trashedAt);
 const trashedPhotos=storedPhotos.filter(p=>!!p.trashedAt);
 const [likedPosts,setLikedPosts]=useStored<Record<string,boolean>>('travaiy-reference-likes-v1',{});
 const [sharedPlaces,setSharedPlaces]=useStored<SharedPlace[]>('travaiy-reference-shared-v1',[]);
 const addPhoto=(photo:PhotoMoment)=>setPhotos(prev=>[photo,...prev]);
 const updatePhoto=(id:string,patch:Partial<PhotoMoment>)=>setPhotos(prev=>prev.map(p=>p.id===id?{...p,...patch}:p));
 const toggleLike=(id:string)=>setLikedPosts(p=>({...p,[id]:!p[id]}));
 const sharePlace=(place:SharedPlace)=>setSharedPlaces(p=>p.some(x=>x.id===place.id)?p:[...p,place]);
 const sendGroupMessage=(text:string)=>{const value=text.trim();if(!value)return;setGroupMessages(prev=>[...prev,{id:crypto.randomUUID(),sender:'Bạn',text:value,sentAt:new Intl.DateTimeFormat('vi-VN',{hour:'2-digit',minute:'2-digit'}).format(new Date()),mine:true}]);};
 return {plan,setPlan,companion,syncError,expenses,setExpenses,completedActivities,toggleActivity,documents,setDocuments,localPosts,setLocalPosts,trips,tripStatuses,setTripStatuses,accessFor,accessLimit,selectAccess,consumeAI,memberships,setMemberships,groupMessages,sendGroupMessage,adaptive:currentAdaptive,triggerAdaptive,readAdaptive,dismissAdaptive,applyAdaptive,undoAdaptive,startAdaptiveDemo,photos,trashedPhotos,trashPhoto:(id:string)=>updatePhoto(id,{trashedAt:undefined}),restorePhoto:(id:string)=>updatePhoto(id,{trashedAt:undefined}),photoStorageStatus,addPhoto,updatePhoto,likedPosts,toggleLike,sharedPlaces,sharePlace};
}
const TravelContext=createContext<ReturnType<typeof useTravelValue>|null>(null);
export function TravelProvider({children}:{children:React.ReactNode}){const value=useTravelValue();return <TravelContext.Provider value={value}>{children}</TravelContext.Provider>;}
export function useTravel(){const value=useContext(TravelContext);if(!value)throw new Error('TravelProvider required');return value;}
