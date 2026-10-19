import React from 'react';
import { DetailedMapScreen } from '../../features/travel/MapScreens';
import { NavTab } from '../../types/travel';
export function MapViewScreen(props:{onNavigateTab:(tab:NavTab)=>void;onOpenPlaceDetail:(id:string)=>void;onBack:()=>void;onOpenFilter:()=>void}){return <DetailedMapScreen onBack={props.onBack} onNavigateTab={props.onNavigateTab}/>;}
