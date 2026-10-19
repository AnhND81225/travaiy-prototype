import { useEffect, useState } from 'react';
import type { PhotoMoment } from './model';
import { SAMPLE_PHOTOS } from './fixtures';
export function usePhotoStore(){
 const [photos,setPhotos]=useState<PhotoMoment[]>(SAMPLE_PHOTOS);const [hydrated,setHydrated]=useState(false);const [status,setStatus]=useState('loading');
 useEffect(()=>{let active=true;const request=indexedDB.open('travaiy-reference-media',1);request.onupgradeneeded=()=>request.result.createObjectStore('album');request.onsuccess=()=>{const db=request.result;const tx=db.transaction('album','readonly');const get=tx.objectStore('album').get('photos');get.onsuccess=()=>{if(active){if(Array.isArray(get.result))setPhotos(prev=>{const merged=new Map<string,PhotoMoment>();[...SAMPLE_PHOTOS,...get.result,...prev.filter(p=>!p.isSample)].forEach(p=>merged.set(p.id,p));return [...merged.values()];});setHydrated(true);}};tx.oncomplete=()=>db.close();tx.onerror=()=>{if(active){setStatus('error');setHydrated(true);}db.close();};};request.onerror=()=>{if(active){setStatus('error');setHydrated(true);}};return()=>{active=false;};},[]);
 useEffect(()=>{if(!hydrated)return;let active=true;setStatus('saving');const request=indexedDB.open('travaiy-reference-media',1);request.onsuccess=()=>{const db=request.result;if(!db.objectStoreNames.contains('album')){if(active)setStatus('error');db.close();return;}const tx=db.transaction('album','readwrite');tx.objectStore('album').put(photos,'photos');tx.oncomplete=()=>{if(active)setStatus('saved');db.close();};tx.onerror=()=>{if(active)setStatus('error');db.close();};};request.onerror=()=>{if(active)setStatus('error');};return()=>{active=false;};},[photos,hydrated]);
 return {photos,setPhotos,photoStorageStatus:status};
}
