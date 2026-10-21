import type { ActivePlan, LocatedItem } from './model';
export type AdaptiveScenario = 'delay' | 'rain' | 'rest';
export const SCENARIOS = {
  delay: { title: 'Khởi hành trễ 60 phút', message: 'Giảm một điểm ghé để dành thêm thời gian di chuyển, giữ nguyên giờ ăn và các điểm đã khóa.', icon: '⏱' },
  rain: { title: 'Chiều nay có mưa', message: 'Thay một hoạt động ngoài trời bằng điểm trong nhà, giữ nguyên các lịch hẹn đã khóa.', icon: '🌧' },
  rest: { title: 'Nhóm muốn nghỉ ngơi', message: 'Thêm một khoảng nghỉ thay cho một điểm tham quan, giữ nguyên các mốc quan trọng.', icon: '☕' },
};
export type AdaptiveChange = { before: LocatedItem; after?: LocatedItem; reason: string };
export type AdaptiveSuggestion = { id: string; tripId: string; scenario: AdaptiveScenario; dayNumber: number; before: ActivePlan; after: ActivePlan; changes: AdaptiveChange[]; status: 'pending' | 'applied' | 'dismissed' | 'undone'; unread: boolean };
export function protectedItem(item: LocatedItem) { return !!item.locked || /Ăn|Buffet|Cao Lầu|bữa|check.?in|check.?out/i.test(item.placeName); }
export function createAdaptiveSuggestion(plan: ActivePlan, scenario: AdaptiveScenario, id: string): AdaptiveSuggestion | null {
  const days = [...plan.daysSchedule].sort((a,b) => Number(b.dayNumber === 2)-Number(a.dayNumber === 2));
  const isAfternoonOutdoor=(i:LocatedItem)=>!protectedItem(i)&&Number(i.time.slice(0,2))>=12&&!/Bảo tàng|Cà phê|trong nhà/i.test(i.placeName);
  const day = (scenario==='rain'?days.find(d=>d.items.some(isAfternoonOutdoor)):undefined)||days.find(d => d.items.some(i => !protectedItem(i)));
  if (!day) return null;
  const candidates = day.items.filter(i => !protectedItem(i));
  const target = scenario === 'rain' ? candidates.find(i => Number(i.time.slice(0,2)) >= 12 && !/Bảo tàng|Cà phê|trong nhà/i.test(i.placeName)) || candidates[0] : candidates[0];
  let replacement: LocatedItem | undefined;
  if (scenario === 'rain') replacement = { ...target, id: `${id}-indoor`, placeName: plan.destination === 'Đà Nẵng' ? 'Bảo tàng Điêu khắc Chăm (gợi ý mẫu)' : `Tham quan trong nhà tại ${plan.destination} (gợi ý mẫu)`, category: 'Trong nhà', note: 'Phương án mô phỏng để tránh mưa. Chưa kiểm tra giờ mở cửa.', image: undefined, location: plan.destination === 'Đà Nẵng' ? {lat:16.0618,lng:108.2235} : target.location, address: plan.destination === 'Đà Nẵng' ? '02 Đ. 2 Tháng 9, Hải Châu, Đà Nẵng' : target.address };
  if (scenario === 'rest') replacement = { ...target, id: `${id}-rest`, placeName: 'Nghỉ ngơi cùng nhóm', category: 'Nghỉ ngơi', note: 'Giữ trống khung giờ này để nghỉ và nạp năng lượng.', cost: '0đ', image: undefined, location: undefined, address: undefined };
  const after: ActivePlan = { ...plan, daysSchedule: plan.daysSchedule.map(d => d.dayNumber !== day.dayNumber ? d : { ...d, items: d.items.flatMap(i => i.id !== target.id ? [i] : replacement ? [replacement] : []) }) };
  return { id, tripId: plan.id, scenario, dayNumber: day.dayNumber, before: plan, after, changes: [{ before: target, after: replacement, reason: SCENARIOS[scenario].message }], status: 'pending', unread: true };
}
export function matchesPlan(a: ActivePlan, b: ActivePlan) { return JSON.stringify(a) === JSON.stringify(b); }
