import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { IOSStatusBar } from '../../components/common/IOSStatusBar';
export function WizardHeader({step,title,subtitle,onBack}:{step:number;title:string;subtitle:string;onBack:()=>void}){
 return <header className="wizard-header"><IOSStatusBar/><div className="wizard-top"><button className="travel-icon" onClick={onBack} aria-label="Quay lại"><ArrowLeft size={21}/></button><b className="plan-header-title">Bước {step}/8</b><span className="wizard-step-label">{step===6?'KHÁCH SẠN':'THỜI GIAN'}</span></div><div className="wizard-progress" role="progressbar" aria-label="Tiến trình tạo chuyến đi" aria-valuenow={step} aria-valuemin={1} aria-valuemax={8}><span style={{transform:`scaleX(${step/8})`}}/></div><h1 className="plan-content-title">{title}</h1><p>{subtitle}</p></header>;
}
