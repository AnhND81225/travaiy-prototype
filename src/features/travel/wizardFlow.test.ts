import test from 'node:test';
import assert from 'node:assert/strict';
import {INITIAL_WIZARD_DATA} from '../../data/mockData';
import {requiredWizardStep,manualEditorRedirect,destinationAfterAccess} from './wizardFlow';
import {manualPlanFromWizard} from './manualPlan';
import {buildWizardPlan} from './wizardPlan';
const data={...INITIAL_WIZARD_DATA,destination:'TP.HCM',startDate:'2026-10-20',endDate:'2026-10-23',departureTime:'08:00',returnTime:'19:30',companionType:'group' as const,companionCount:4,stayId:'may-bien',planningMode:'manual' as const,mustVisitPlaces:['Công viên Tao Đàn','Công viên Tao Đàn'],stayDatesMode:'custom' as const,checkIn:'2026-10-21',checkOut:'2026-10-23'};
test('both methods require valid common trip information',()=>{
 for(const planningMode of ['ai','manual'] as const){
  assert.equal(requiredWizardStep({...data,destination:'TP.HCM',planningMode}),null);
  assert.equal(requiredWizardStep({...data,destination:'TP.HCM',planningMode,startDate:'20/10/2026',endDate:'23/10/2026'}),null);
  assert.equal(requiredWizardStep({...data,destination:'TP.HCM',planningMode,stayId:undefined}),null);
  assert.equal(requiredWizardStep({...data,destination:'TP.HCM',planningMode,startDate:'bad'}),'/wizard/dates');
  assert.equal(requiredWizardStep({...data,destination:'TP.HCM',planningMode,departureTime:''}),'/wizard/dates');
  assert.equal(requiredWizardStep({...data,destination:'TP.HCM',planningMode,companionCount:1}),'/wizard/companions');
 }
});
test('manual editor needs a compatible package confirmed for this exact trip',()=>{
 const access={tripId:'new-trip',mode:'manual' as const,tier:'group' as const};
 assert.equal(manualEditorRedirect({...data,destination:'TP.HCM'},'new-trip',null),'/wizard/subscription');
 assert.equal(manualEditorRedirect({...data,destination:'TP.HCM'},'new-trip',{...access,tripId:'old-trip'}),'/wizard/subscription');
 assert.equal(manualEditorRedirect({...data,destination:'TP.HCM'},'new-trip',{...access,tier:'solo'}),'/wizard/subscription');
 assert.equal(manualEditorRedirect({...data,destination:'TP.HCM'},'new-trip',access),null);
 assert.equal(manualEditorRedirect({...data,destination:'TP.HCM'},'new-trip',{...access,tier:'free'}),null);
});
test('package selection dispatches to the chosen method or package management',()=>{
 assert.equal(destinationAfterAccess('manual','create'),'/trip/manual/new?from=wizard&chosen=1');
 assert.equal(destinationAfterAccess('ai','create'),'/wizard/ai-generating');
 assert.equal(destinationAfterAccess('ai','upgrade'),'/subscription');
 assert.equal(destinationAfterAccess('manual','upgrade'),'/subscription');
});
test('manual conversion keeps package trip identity and common info with empty days',()=>{
 const hcm={...data,destination:'TP.HCM',stayId:undefined,checkIn:undefined,checkOut:undefined};
 const plan=manualPlanFromWizard(hcm,'chosen-package-trip');
 assert.equal(plan.id,'chosen-package-trip');assert.ok(plan.daysSchedule.every(day=>!day.items.length));
 assert.deepEqual(plan.placeSelection,['Công viên Tao Đàn']);
 for(const key of ['departureTime','returnTime','companionCount','budgetAmount','checkIn','checkOut'] as const)assert.equal(plan[key],hcm[key]);
 const ai=buildWizardPlan(data);assert.equal(ai.departureTime,data.departureTime);assert.equal(ai.companionCount,4);
 assert.deepEqual(data.mustVisitPlaces,['Công viên Tao Đàn','Công viên Tao Đàn']);
});

test('demo rejects scheduling outside HCM for both methods',()=>{for(const planningMode of ['ai','manual'] as const){assert.equal(requiredWizardStep({...data,planningMode,destination:'Hà Nội'}),'/wizard/destination');assert.equal(requiredWizardStep({...data,planningMode,destination:'TP.HCM'}),null);}});
