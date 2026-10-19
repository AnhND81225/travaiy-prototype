import React from 'react';
import { ArrowLeft, ArrowUpRight, MapPin } from 'lucide-react';
import { IOSStatusBar } from '../../components/common/IOSStatusBar';
export function TravelHeader({title,subtitle,onBack,action,dark=false}:{title:string;subtitle?:string;onBack:()=>void;action?:React.ReactNode;dark?:boolean}){return <header className={`travel-header ${dark?'is-dark':''}`}><IOSStatusBar light={dark}/><div className="travel-heading-row"><button className="travel-icon" aria-label="Quay lại" onClick={onBack}><ArrowLeft size={20}/></button><div className="min-w-0 flex-1"><h1>{title}</h1>{subtitle&&<p>{subtitle}</p>}</div>{action}</div></header>;}
export function Pill({children,onClick,secondary=false,disabled=false}:{children:React.ReactNode;onClick?:()=>void;secondary?:boolean;disabled?:boolean}){return <button type="button" className={`travel-pill ${secondary?'secondary':''}`} onClick={onClick} disabled={disabled}>{children}</button>;}
export function Eyebrow({children}:{children:React.ReactNode}){return <span className="travel-eyebrow">{children}</span>;}
export function Image({src,alt,className=''}:{src:string;alt:string;className?:string}){return <img src={src} alt={alt} className={className} onError={e=>{const im=e.currentTarget;if(!im.dataset.failed){im.dataset.failed='true';im.src='/images/vietnam-hero.png';}}}/>;}
export function LocationText({children}:{children:React.ReactNode}){return <span className="travel-location"><MapPin size={13}/>{children}</span>;}
export function TrailingArrow(){return <span className="travel-arrow"><ArrowUpRight size={17}/></span>;}
