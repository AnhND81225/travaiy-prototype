import { test } from 'node:test';
import assert from 'node:assert/strict';
import { optimizePlan, routeDistance, clusterPhotos, type ActivePlan, type Stay, type LocatedItem, type PhotoMoment } from './model';
const point=(lng:number)=>({lat:16,lng});
const item=(id:string,lng?:number,locked=false):LocatedItem=>({id,placeName:id,time:id,category:'Tham quan',duration:'1 giờ',cost:'0',note:'',location:lng===undefined?undefined:point(lng),locked});
const stay={id:'test-stay',location:point(108)} as Stay;
const plan=(items:LocatedItem[])=>({id:'test',days:1,daysSchedule:[{dayNumber:1,items}]} as ActivePlan);
test('optimization preserves activities, slots, locked boundaries and original input',()=>{
 const input=plan([item('a',108.08),item('b',108.02),item('meal',108.04,true),item('c',108.09),item('d',108.06)]);
 const before=JSON.stringify(input);const result=optimizePlan(input,stay);
 assert.equal(JSON.stringify(input),before);assert.equal(result.stayId,stay.id);
 const rows=result.daysSchedule[0].items;assert.deepEqual(rows.map(i=>i.id).sort(),input.daysSchedule[0].items.map(i=>i.id).sort());
 assert.deepEqual(rows.map(i=>i.time),input.daysSchedule[0].items.map(i=>i.time));assert.equal(rows[2].id,'meal');
 assert.ok(routeDistance(rows,stay.location)<=routeDistance(input.daysSchedule[0].items,stay.location)+1e-8);
});
test('a point without coordinates remains fixed and is never dropped',()=>{
 const input=plan([item('a',108.06),item('unknown'),item('b',108.01)]);const result=optimizePlan(input,stay);
 assert.equal(result.daysSchedule[0].items[1].id,'unknown');assert.equal(result.daysSchedule[0].items.length,3);
 assert.ok(Number.isFinite(routeDistance(result.daysSchedule[0].items,stay.location)));
});
test('all clustered photos appear exactly once and close zoom reveals nearby points',()=>{
 const photos=[{id:'a',location:point(108.22)},{id:'b',location:point(108.24)},{id:'c',location:{lat:21,lng:107}},{id:'unlocated'}] as PhotoMoment[];
 const overview=clusterPhotos(photos,5),detail=clusterPhotos(photos,16);
 assert.equal(overview.length,2);assert.ok(detail.length>overview.length);
 for(const clusters of [overview,detail])assert.deepEqual(clusters.flatMap(c=>c.items.map(p=>p.id)).sort(),['a','b','c']);
});

test('trip dates span months and years without a fixed calendar month',async()=>{
 const {dayCount,isoDate}=await import('./model');
 assert.equal(isoDate('17/10/2026'),'2026-10-17');assert.equal(dayCount('2026-12-30','2027-01-02'),4);
 assert.equal(dayCount('2028-02-28','2028-03-01'),3);
});
test('stay dates are constrained to the trip and require at least one night',async()=>{
 const {lodgingError}=await import('./model');
 assert.equal(lodgingError('2026-10-17','2026-10-21','2026-10-18','2026-10-20'),'');
 assert.notEqual(lodgingError('2026-10-17','2026-10-21','2026-10-16','2026-10-20'),'');
 assert.notEqual(lodgingError('2026-10-17','2026-10-21','2026-10-18','2026-10-22'),'');
 assert.notEqual(lodgingError('2026-10-17','2026-10-21','2026-10-18','2026-10-18'),'');
});
test('wizard produces a separate draft using destination, date range and compatible hotel',async()=>{
 const {buildWizardPlan}=await import('./wizardPlan');const {INITIAL_WIZARD_DATA}=await import('../../data/mockData');const {INITIAL_PLAN}=await import('./fixtures');
 const initial=JSON.stringify(INITIAL_PLAN);const data={...INITIAL_WIZARD_DATA,startDate:'2026-12-30',endDate:'2027-01-02',stayId:'may-bien'};
 const draft=buildWizardPlan(data);assert.equal(draft.days,4);assert.equal(draft.stayId,'may-bien');assert.equal(draft.checkIn,'2026-12-30');assert.equal(draft.checkOut,'2027-01-02');assert.equal(draft.daysSchedule[3].dateText,'2/1');assert.equal(JSON.stringify(INITIAL_PLAN),initial);
 const other=buildWizardPlan({...data,destination:'Hội An',mustVisitPlaces:[]});assert.equal(other.stayId,undefined);assert.ok(other.daysSchedule.every(d=>d.items.length>=3));assert.ok(other.daysSchedule.some(d=>d.items.some(i=>i.placeName.includes('Hội An'))));
});
test('a hotel is not applied to days outside its custom lodging period',async()=>{
 const {buildWizardPlan}=await import('./wizardPlan');const {INITIAL_WIZARD_DATA}=await import('../../data/mockData');const {stayAppliesOnDay}=await import('./model');
 const draft=buildWizardPlan({...INITIAL_WIZARD_DATA,startDate:'2026-10-17',endDate:'2026-10-21',stayId:'may-bien',stayDatesMode:'custom',checkIn:'2026-10-18',checkOut:'2026-10-19'});
 assert.equal(stayAppliesOnDay(draft,1),false);assert.equal(stayAppliesOnDay(draft,2),true);assert.equal(stayAppliesOnDay(draft,3),true);assert.equal(stayAppliesOnDay(draft,4),false);
});

test('hotel ranking puts affordable stays first and respects explicit room-night budget',async()=>{
 const {rankStays,lodgingBudget}=await import('./wizardPlan');const {INITIAL_WIZARD_DATA}=await import('../../data/mockData');const {STAYS}=await import('./fixtures');
 const data={...INITIAL_WIZARD_DATA,hotelBudgetPerNight:800000,stayRoomCount:2};const ranked=rankStays(STAYS,data);
 assert.equal(ranked[0].stay.id,'nha-ben-song');assert.equal(ranked[0].withinBudget,true);assert.equal(ranked[0].estimatedTotal,720000*2*2);assert.equal(ranked[1].withinBudget,false);assert.equal(ranked[1].over,450000);
 assert.equal(lodgingBudget(data).nightly,800000);assert.ok(rankStays(STAYS,{...data,destination:'Huế'}).length>0);
 assert.equal(rankStays(STAYS,{...data,endDate:data.startDate}).length,0);
 const higher=rankStays(STAYS,{...data,hotelBudgetPerNight:2500000});assert.ok(higher.every(r=>r.withinBudget));assert.equal(higher[0].stay.id,'son-tra-garden');
});

test('wizard includes selected must-visit places without changing city',async()=>{const {buildWizardPlan}=await import('./wizardPlan');const {INITIAL_WIZARD_DATA}=await import('../../data/mockData');const draft=buildWizardPlan({...INITIAL_WIZARD_DATA,destination:'Đà Lạt',mustVisitPlaces:['Tiệm cà phê Tú Lưng']});assert.ok(draft.daysSchedule.some(d=>d.items.some(i=>i.placeName==='Tiệm cà phê Tú Lưng')));assert.equal(draft.destination,'Đà Lạt');});
