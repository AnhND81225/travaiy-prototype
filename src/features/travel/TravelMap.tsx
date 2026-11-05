import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { GeoPoint } from './model';
export type MapPin={id:string;location:GeoPoint;label:string;kind:'place'|'stay'|'member'|'photo'|'shared';image?:string;count?:number;initials?:string;color?:string;onClick?:()=>void};
interface Props{center:GeoPoint;zoom:number;markers:MapPin[];route?:GeoPoint[];onZoom?:(zoom:number)=>void;viewRequest?:{center?:GeoPoint;zoom?:number;bounds?:[number,number][];key:number};onBounds?:(bounds:{south:number;north:number;east:number;west:number})=>void;}
export function TravelMap({center,zoom,markers,route=[],onZoom,viewRequest,onBounds}:Props){
 const host=useRef<HTMLDivElement>(null);const map=useRef<L.Map|null>(null);const group=useRef<L.LayerGroup|null>(null);const routeLayer=useRef<L.Polyline|null>(null);const callbacks=useRef({onZoom,onBounds});callbacks.current={onZoom,onBounds};const [failed,setFailed]=useState(false);const [retry,setRetry]=useState(0);const [ready,setReady]=useState(false);
 useEffect(()=>{if(!host.current)return;if(!import.meta.env.VITE_GEOAPIFY_API_KEY){setFailed(true);return;}const m=L.map(host.current,{center:[center.lat,center.lng],zoom,minZoom:4,maxZoom:18,zoomControl:false,attributionControl:true});map.current=m;
 const tiles=L.tileLayer(`https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${encodeURIComponent(import.meta.env.VITE_GEOAPIFY_API_KEY||'')}`,{maxZoom:19,attribution:'Powered by <a href="https://www.geoapify.com/">Geoapify</a> | &copy; OpenMapTiles | © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).addTo(m);
 let errors=0;tiles.on('tileerror',()=>{if(++errors>=3)setFailed(true);});tiles.on('load',()=>{if(errors===0)setFailed(false);});
 L.control.zoom({position:'topright'}).addTo(m);group.current=L.layerGroup().addTo(m);setReady(true);
 const report=()=>{const b=m.getBounds();callbacks.current.onBounds?.({south:b.getSouth(),north:b.getNorth(),east:b.getEast(),west:b.getWest()});callbacks.current.onZoom?.(m.getZoom());};m.on('moveend zoomend',report);
 const observer=new ResizeObserver(()=>m.invalidateSize({pan:false}));observer.observe(host.current);report();return()=>{observer.disconnect();m.remove();map.current=null;group.current=null;setReady(false);};
 },[retry]);
 useEffect(()=>{const g=group.current;if(!g)return;g.clearLayers();markers.forEach(pin=>{const button=document.createElement('button');button.type='button';button.className=`travel-map-pin pin-${pin.kind}`;button.setAttribute('aria-label',pin.label);button.title=pin.label;
 if(pin.image){const image=document.createElement('img');image.src=pin.image;image.alt='';image.onerror=()=>{image.src='/images/vietnam-hero.png';image.onerror=null;};button.appendChild(image);}
 else{const text=document.createElement('span');text.textContent=pin.initials||(pin.kind==='stay'?'⌂':pin.kind==='shared'?'+':'•');if(pin.color)button.style.setProperty('--pin-color',pin.color);button.appendChild(text);}
 if(pin.count&&pin.count>1){const count=document.createElement('b');count.textContent=String(pin.count);button.appendChild(count);}
 const marker=L.marker([pin.location.lat,pin.location.lng],{icon:L.divIcon({html:button,className:'travel-marker-container',iconSize:pin.kind==='photo'?[58,66]:[40,44],iconAnchor:pin.kind==='photo'?[29,58]:[20,40]}),keyboard:false}).addTo(g);if(pin.onClick)button.addEventListener('click',e=>{e.stopPropagation();pin.onClick?.();});else marker.bindPopup(()=>{const div=document.createElement('div');div.textContent=pin.label;return div;});
 });},[markers,ready]);
 useEffect(()=>{if(!map.current)return;if(routeLayer.current)routeLayer.current.remove();routeLayer.current=route.length>1?L.polyline(route.map(p=>[p.lat,p.lng] as L.LatLngTuple),{color:'#243b9e',weight:3,dashArray:'5 9',opacity:0.7}).addTo(map.current):null;},[route,ready]);
 useEffect(()=>{if(!map.current||!viewRequest)return;if(viewRequest.bounds?.length)map.current.fitBounds(viewRequest.bounds as L.LatLngTuple[],{padding:[40,70],maxZoom:viewRequest.zoom||15});else if(viewRequest.center)map.current.setView([viewRequest.center.lat,viewRequest.center.lng],viewRequest.zoom||13,{animate:false});},[viewRequest,ready]);
 return <div className="travel-map-shell"><div ref={host} className="travel-map-canvas" aria-label="Bản đồ địa lý tương tác"/>{failed&&<div className="travel-map-error">Một số ô bản đồ chưa tải. <button onClick={()=>{setFailed(false);setRetry(n=>n+1);}}>Thử lại</button></div>}<a className="travel-map-credit" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">Dữ liệu © OpenStreetMap</a></div>;
}
