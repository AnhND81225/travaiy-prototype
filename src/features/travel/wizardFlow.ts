import type {TripWizardData} from '../../types/travel';
import {isoDate} from './model';
import {wizardDateError,wizardNeedsStay} from './wizardPlan';
export type PlanningMode='ai'|'manual';
export type AccessPurpose='create'|'upgrade';
export type ConfirmedWizardAccess={tripId:string;mode:PlanningMode;tier:'free'|'solo'|'group'};
export function requiredWizardStep(data:TripWizardData):string|null{
 if(data.destination!=='TP.HCM')return '/wizard/destination';
 if(!Number.isFinite(Date.parse(isoDate(data.startDate)))||!Number.isFinite(Date.parse(isoDate(data.endDate)))||wizardDateError(data)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.departureTime)||!/^([01]\d|2[0-3]):[0-5]\d$/.test(data.returnTime))return '/wizard/dates';
 if(!['solo','group'].includes(data.companionType)||(data.companionType==='group'&&data.companionCount<2))return '/wizard/companions';
 if(!Number.isFinite(data.budgetAmount)||data.budgetAmount<=0)return '/wizard/budget';
 if(wizardNeedsStay(data))return '/wizard/stay';
 return null;
}
export function destinationAfterAccess(mode:PlanningMode,purpose:AccessPurpose){
 return purpose==='upgrade'?'/subscription':mode==='manual'?'/trip/manual/new?from=wizard&chosen=1':'/wizard/ai-generating';
}
export function manualEditorRedirect(data:TripWizardData,tripId:string,confirmed:ConfirmedWizardAccess|null){
 const required=requiredWizardStep(data);if(required)return required;
 if(data.planningMode!=='manual')return '/wizard/summary';
 if(!confirmed||confirmed.tripId!==tripId||confirmed.mode!=='manual'||(confirmed.tier!=='free'&&confirmed.tier!==data.companionType))return '/wizard/subscription';
 return null;
}
