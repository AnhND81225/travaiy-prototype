import {aiApi, paceFor, type Trip, type Job, type Place} from '../ai/api';
import type {TripWizardData, UserPreferences} from '../../types/travel';
import type {ActivePlan} from './model';
import {isoDate} from './model';
import {httpClient} from '../../api/core/httpClient';
import type {TripPlan} from '../../types/travel';

export const normalizeName = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().trim();
export async function liveCatalog(city: string): Promise<{destinationId: string; places: Place[]}> {
  if(city!=='TP.HCM')throw new Error('Bản demo chỉ hỗ trợ lên lịch tại TP.HCM.');
  const destinations = await aiApi.destinations();
  const destination = destinations.items.find(d => normalizeName(d.name).replace(/\s*(?:\(.*\)|[—–-]\s*mvp)$/, '') === normalizeName(city));
  if (!destination) throw new Error('Điểm đến này chưa có dữ liệu AI. Danh mục TP.HCM chưa sẵn sàng.');
  return {destinationId: destination.id, places: (await aiApi.places(destination.id)).items.filter(p => p.category !== 'stay')};
}

export function liveError(error: unknown): string {
  const code = (error as {code?: string})?.code;
  const messages: Record<string, string> = {
    DESTINATION_NOT_SUPPORTED: 'Bản demo chỉ hỗ trợ TP.HCM.',
    INVALID_CREDENTIALS: 'Email hoặc mật khẩu chưa đúng.',
    EMAIL_NOT_VERIFIED: 'Bạn cần xác minh email trước khi đăng nhập.',
    AI_UNAVAILABLE: 'Chưa kết nối được Jev. Vui lòng thử lại sau.',
    AI_TIMEOUT: 'Jev phản hồi chậm. Bạn có thể thử lại.',
    QUOTA_EXHAUSTED: 'Chuyến đi đã hết lượt AI.',
    NO_FEASIBLE_PLAN: 'Không đủ thời gian cho các điểm đã chọn. Hãy giảm số điểm hoặc tăng thời gian chuyến đi.',
    PLAN_VERSION_CONFLICT: 'Lịch đã thay đổi. Tải lại chuyến đi trước khi tiếp tục.',
  };
  return messages[code || ''] || (error instanceof Error && !code ? error.message : 'Chưa hoàn tất yêu cầu. Vui lòng thử lại.');
}

export async function waitForJob(tripId: string, initial: Job): Promise<Job> {
  let job = initial;
  for (let i = 0; i < 180; i++) {
    if (job.state === 'FAILED') throw {code: job.errorCode};
    if (job.state === 'SUCCEEDED') return job;
    await new Promise(resolve => setTimeout(resolve, 1000));
    job = await aiApi.job(tripId, job.id);
  }
  throw new Error('AI vẫn đang xử lý. Bấm thử lại để kiểm tra yêu cầu hiện tại.');
}

export function toActivePlan(trip: Trip, base: ActivePlan): ActivePlan {
  const known = trip.selectedPlaces.filter(p => p.estimatedCostVnd !== null);
  return {...base, id: trip.id, backendTripId: trip.id, backendVersion: trip.version, backendMode: trip.planMode, backendStatus: trip.status,
    backendCompletedIds: trip.completedActivityIds, backendWarnings: trip.warnings,
    planningMode: 'ai', startDate: trip.wizard.startDate, endDate: trip.wizard.endDate,
    dates: `${trip.wizard.startDate} → ${trip.wizard.endDate}`, days: trip.days.length,
    estimatedCostPerPerson: known.length === trip.selectedPlaces.length && known.length
      ? `${new Intl.NumberFormat('vi-VN').format(known.reduce((sum, p) => sum + p.estimatedCostVnd!, 0))} ₫`
      : 'Chưa đủ giá tham khảo',
    daysSchedule: trip.days.map((day, index) => ({dayNumber: index + 1, title: `Khám phá ${base.destination}`,
      dateText: day.date, dayCost: 'Chưa đủ giá tham khảo', items: day.activities.map(a => {
        const place = trip.selectedPlaces.find(p => p.id === a.placeId);
        return {id: a.id, backendPlaceId: a.placeId, placeName: place?.name || (a.kind === 'rest' ? 'Nghỉ ngơi' : 'Hoạt động'),
          time: a.startTime, category: place?.category === 'food' ? 'Ăn uống' : 'Tham quan', note: a.note,
          cost: place?.estimatedCostVnd == null ? 'Chưa có giá' : `${place.estimatedCostVnd.toLocaleString('vi-VN')} ₫`,
          duration: `${a.durationMinutes} phút`, location: place?.location || undefined, locked: a.locked,
          image: base.coverImage};
      })})),
  };
}

export async function saveLiveEdits(updated: TripPlan, base: ActivePlan): Promise<ActivePlan> {
  const current = (await aiApi.trip(base.id)).trip;
  if (current.version !== base.backendVersion) throw {code: 'PLAN_VERSION_CONFLICT'};
  const originals = new Map(current.days.flatMap(day => day.activities).map(activity => [activity.id, activity]));
  const days = updated.daysSchedule.map((day, index) => ({date: current.days[index].date, activities: day.items.map(item => {
    const original = originals.get(item.id);
    if (!original) throw new Error('Điểm mới cần có trong danh mục máy chủ. Bản demo hiện hỗ trợ sửa giờ hoặc bỏ điểm đã có.');
    return {...original, startTime: item.time};
  })}));
  const result = await httpClient.put<{trip: Trip}>(`/trips/${base.id}`, {expectedVersion: current.version, title: current.title, wizard: current.wizard,
    selectedPlaceIds: current.selectedPlaces.map(p => p.id), days}, {unwrapData: false});
  return toActivePlan(result.trip, base);
}

const running = new Map<string, Promise<ActivePlan>>();
export function generateLivePlan(requestId: string, wizard: TripWizardData, preferences: UserPreferences, base: ActivePlan) {
  const existing = running.get(requestId);
  if (existing) return existing;
  const task = generate(requestId, wizard, preferences, base).finally(() => running.delete(requestId));
  running.set(requestId, task);
  return task;
}

async function generate(requestId: string, wizard: TripWizardData, preferences: UserPreferences, base: ActivePlan) {
  const storageKey = `travaiy-live-generation-${requestId}`;
  const saved = sessionStorage.getItem(storageKey);
  let pending: {tripId: string; saved?: boolean; jobId?: string; key: string; version?: number} = saved ? JSON.parse(saved) : {tripId: '', key: crypto.randomUUID()};
  const remember = () => sessionStorage.setItem(storageKey, JSON.stringify(pending));
  if (!pending.tripId) {
    const created = await aiApi.create(`Chuyến đi ${wizard.destination}`);
    pending.tripId = created.trip.id; remember();
  }
  let trip = (await aiApi.trip(pending.tripId)).trip;
  if (!pending.saved) {
    const catalog = await liveCatalog(wizard.destination);
    const chosen = catalog.places.filter(p => wizard.mustVisitPlaces.some(name => normalizeName(name) === normalizeName(p.name)));
    if (wizard.mustVisitPlaces.length && chosen.length !== wizard.mustVisitPlaces.length) throw new Error('Một số điểm chưa có dữ liệu máy chủ. Quay lại bước chọn địa điểm để chọn lại.');
    if (!catalog.places.length) throw new Error('Chưa có địa điểm để xếp lịch.');
    trip = (await aiApi.save(trip, {destinationId: catalog.destinationId, startDate: isoDate(wizard.startDate), endDate: isoDate(wizard.endDate),
      departureTime: wizard.departureTime, returnTime: wizard.returnTime, companionType: wizard.companionType,
      companionCount: wizard.companionType === 'solo' ? 1 : wizard.companionCount, budgetVnd: wizard.budgetAmount,
      categories: [...new Set(chosen.map(p => p.category))], pace: paceFor(preferences.travelStyle), transport: wizard.transport,
      accommodation: wizard.accommodation, notes: wizard.notes, stay: null}, chosen.map(p => p.id))).trip;
    pending.saved = true; pending.version = trip.version; remember();
  }
  const job = pending.jobId ? await aiApi.job(trip.id, pending.jobId)
    : await aiApi.submit({...trip, version: pending.version ?? trip.version}, {...preferences, interests: [...new Set([...preferences.interests, ...wizard.interests])]}, pending.key, undefined, true);
  pending.jobId = job.id; remember();
  try { await waitForJob(trip.id, job); }
  catch (error) {
    const latest = await aiApi.job(trip.id, job.id).catch(() => null);
    if (latest?.state === 'FAILED') { pending.jobId = undefined; pending.key = crypto.randomUUID(); pending.version = (await aiApi.trip(trip.id)).trip.version; remember(); }
    throw error;
  }
  return toActivePlan((await aiApi.trip(trip.id)).trip, base);
}
