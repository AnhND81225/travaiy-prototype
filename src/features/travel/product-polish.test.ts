import test from 'node:test';
import assert from 'node:assert/strict';
import {splitEqually,expenseBalances,type Expense} from './expenseModel';
import {createManualPlan} from './manualPlan';
import {manualPlacesFor} from './manualPlaces';
import {wizardNeedsStay} from './wizardPlan';
import {INITIAL_WIZARD_DATA} from '../../data/mockData';
test('equal split allocates every dong exactly once to selected people',()=>{
 const shares=splitEqually(100001,['you','minhanh','linhchi']);
 assert.deepEqual(shares,{you:33334,minhanh:33334,linhchi:33333});
 assert.equal(Object.values(shares).reduce((n,v)=>n+v,0),100001);
 assert.deepEqual(splitEqually(5,['you','you','linhchi']),{you:3,linhchi:2});
 assert.throws(()=>splitEqually(10,[]));assert.throws(()=>splitEqually(-1,['you']));assert.throws(()=>splitEqually(1.5,['you']));
});
test('group balances include payer outside the split and conserve money',()=>{
 const base={tripId:'trip',scope:'group',category:'Ăn uống',createdAt:'2026-10-18'} as const;
 const entries:Expense[]=[{...base,id:'a',title:'Bữa tối',amount:900,payerId:'you',participantIds:['you','a','b']},{...base,id:'b',title:'Taxi',amount:100,payerId:'a',participantIds:['b']}];
 assert.deepEqual(expenseBalances(entries),{you:600,a:-200,b:-400});
 assert.equal(Object.values(expenseBalances(entries)).reduce((n,v)=>n+v,0),0);
});
test('manual plan starts with empty days across year boundary and requires accommodation overnight',()=>{
 assert.equal(createManualPlan('TP.HCM','2026-12-30','2027-01-02').days,4);
 const plan=createManualPlan('TP.HCM','2026-12-30','2027-01-02','may-bien');
 assert.equal(plan.days,4);assert.equal(plan.planningMode,'manual');assert.equal(plan.stayId,'may-bien');assert.ok(plan.daysSchedule.every(d=>!d.items.length));assert.equal(plan.daysSchedule[3].dateText,'02/01');
 assert.equal(createManualPlan('Đà Lạt','2026-10-18','2026-10-18').days,1);
 assert.throws(()=>createManualPlan('Đà Lạt','bad','bad'));assert.throws(()=>createManualPlan('Đà Lạt','2026-10-19','2026-10-18'));assert.throws(()=>createManualPlan('Đà Lạt','2026-10-18','2026-10-19','may-bien'));
});
test('every supported destination has sample places to select manually',()=>{
 for(const city of ['TP.HCM'])assert.ok(manualPlacesFor(city).length>=3,city);
});
test('AI wizard requires a hotel for the current city only on overnight trips',()=>{
 assert.equal(wizardNeedsStay({...INITIAL_WIZARD_DATA,stayId:undefined}),false);
 assert.equal(wizardNeedsStay({...INITIAL_WIZARD_DATA,stayId:'may-bien'}),false);
 assert.equal(wizardNeedsStay({...INITIAL_WIZARD_DATA,destination:'Đà Lạt',stayId:'may-bien'}),true);
 assert.equal(wizardNeedsStay({...INITIAL_WIZARD_DATA,endDate:INITIAL_WIZARD_DATA.startDate,stayId:undefined}),false);
});
test('AI places every selected stop once across days, with its coordinates and image',async()=>{
 const {buildWizardPlan}=await import('./wizardPlan');
 const chosen=manualPlacesFor('TP.HCM').slice(0,2).map(p=>p.name);
 const data={...INITIAL_WIZARD_DATA,destination:'TP.HCM',mustVisitPlaces:[...chosen,chosen[0]],stayId:'may-bien'};
 const source=JSON.stringify(data);const plan=buildWizardPlan(data);const items=plan.daysSchedule.flatMap(d=>d.items);
 assert.equal(items.length,2);assert.deepEqual(items.map(i=>i.placeName).sort(),chosen.sort());assert.ok(items.every(i=>i.location&&i.image));assert.equal(JSON.stringify(data),source);
});
test('a custom selected place is retained even without coordinates',async()=>{
 const {buildWizardPlan}=await import('./wizardPlan');
 const plan=buildWizardPlan({...INITIAL_WIZARD_DATA,mustVisitPlaces:['Điểm hẹn riêng của nhóm']});
 const items=plan.daysSchedule.flatMap(d=>d.items);assert.equal(items.length,1);assert.equal(items[0].placeName,'Điểm hẹn riêng của nhóm');assert.equal(items[0].location,undefined);
});
test('changing the selected pool removes only deselected pool activities, preserving custom additions',async()=>{
 const {updateManualSelection}=await import('./manualPlan');
 const plan=createManualPlan('TP.HCM','2026-10-20','2026-10-20');plan.placeSelection=['Công viên Tao Đàn','Thảo Cầm Viên'];
 const item={time:'09:00',category:'Tham quan',duration:'60 phút',cost:'Chưa dự tính',note:''};
 plan.daysSchedule[0].items=[{...item,id:'1',placeName:'Công viên Tao Đàn'},{...item,id:'2',placeName:'Thảo Cầm Viên'},{...item,id:'3',placeName:'Gặp bạn cũ'}];
 const result=updateManualSelection(plan,['Công viên Tao Đàn','Công viên Tao Đàn']);assert.deepEqual(result.placeSelection,['Công viên Tao Đàn']);assert.deepEqual(result.daysSchedule[0].items.map(i=>i.id),['1','3']);assert.equal(plan.daysSchedule[0].items.length,3);
});
