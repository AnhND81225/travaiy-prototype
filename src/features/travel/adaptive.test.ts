import test from 'node:test';
import assert from 'node:assert/strict';
import type { ActivePlan } from './model';
import { INITIAL_PLAN } from './fixtures';
import { createAdaptiveSuggestion, protectedItem } from './adaptive';
for (const scenario of ['delay','rain','rest'] as const) {
 test(`${scenario}: proposal preserves locked activities, meal times, other days and source`,()=>{
  const source=JSON.stringify(INITIAL_PLAN);const suggestion=createAdaptiveSuggestion(INITIAL_PLAN,scenario,'test');assert.ok(suggestion);assert.equal(JSON.stringify(INITIAL_PLAN),source);
  for(const before of INITIAL_PLAN.daysSchedule){const after:ActivePlan['daysSchedule'][number]=suggestion.after.daysSchedule.find(d=>d.dayNumber===before.dayNumber)!;if(before.dayNumber!==suggestion.dayNumber)assert.deepEqual(after,before);for(const item of before.items.filter(protectedItem))assert.deepEqual(after.items.find(i=>i.id===item.id),item);}
  assert.equal(suggestion.changes.length,1);assert.notDeepEqual(suggestion.after,suggestion.before);
 });
}
test('empty or entirely locked plan has no proposal',()=>{
 const empty={...INITIAL_PLAN,daysSchedule:INITIAL_PLAN.daysSchedule.map(d=>({...d,items:[]}))};assert.equal(createAdaptiveSuggestion(empty,'delay','empty'),null);
 const locked={...INITIAL_PLAN,daysSchedule:INITIAL_PLAN.daysSchedule.map(d=>({...d,items:d.items.map(i=>({...i,locked:true}))}))};assert.equal(createAdaptiveSuggestion(locked,'rain','locked'),null);
});
test('rain proposal keeps a mappable indoor replacement',()=>{
 const suggestion=createAdaptiveSuggestion(INITIAL_PLAN,'rain','rain-map');assert.ok(suggestion);
 const change=suggestion.changes[0];assert.ok(change.after?.location);
 assert.equal(change.after?.placeName,'Bảo tàng Thành phố Hồ Chí Minh (gợi ý mẫu)');
});
