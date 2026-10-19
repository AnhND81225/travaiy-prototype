import React from 'react';
import { DetailedMapScreen } from '../../features/travel/MapScreens';
export function GroupLocationScreen({onBack}:{onBack:()=>void}){return <DetailedMapScreen groupMode onBack={onBack}/>;}
