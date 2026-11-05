import { httpClient as http } from '../../api/core/httpClient';
import { TokenStorage } from '../../api/core/apiConfig';
import type { UserPreferences } from '../../types/travel';

export interface Place { id: string; name: string; category: string; indoor: boolean; location: {lat: number; lng: number} | null; estimatedCostVnd: number | null; durationMinutes: number; }
export interface Activity { id: string; placeId: string | null; kind: string; startTime: string; durationMinutes: number; locked: boolean; note: string; }
export interface Day { date: string; activities: Activity[]; }
export interface Wizard { destinationId: string; startDate: string; endDate: string; departureTime: string; returnTime: string; companionType: 'solo' | 'group'; companionCount: number; budgetVnd: number; categories: string[]; pace: 'relaxed' | 'balanced' | 'active'; transport: string; accommodation: string; notes: string; stay: null; }
export interface Trip { id: string; title: string; version: number; status: 'DRAFT' | 'PLANNED' | 'ACTIVE' | 'COMPLETED'; planMode: string; wizard: Wizard; selectedPlaces: Place[]; days: Day[]; completedActivityIds: string[]; warnings: string[]; }
export interface View { trip: Trip; role: string; }
export interface Event {type: 'rain' | 'rest' | 'delay'; date: string; startTime: string; endTime: string; delayMinutes: number | null; source: 'user'; observedAt: string; }
export interface Job {id: string; state: string; operation: string; errorCode: string | null; mode: string | null; baseVersion: number; appliedVersion: number | null; undoneVersion: number | null; dismissed: boolean; changes: {activityId: string; beforeDate: string; beforeTime: string; afterDate: string; afterTime: string}[]; proposal: {days: Day[]; warnings: {code: string; message: string}[]} | null; }
export interface Context { observedAt: string; weather: {status: string; hours?: {time: string; temperature: number | null; rainProbability: number | null}[]}; routing: {status: string; minutes?: Record<string, Record<string, number | null>>}; places: {provider?: string; placeId?: string; status: string; name?: string; rating?: number; userRatingCount?: number; googleMapsUri?: string; reviews?: {rating: number; text: string; author: string; authorUri?: string; googleMapsUri?: string}[]}[]; }
export interface LivePosition {lat:number;lng:number;accuracy:number;observedAt:string;}
export interface CompanionAdvice {key:string;message:string;event:Event|null;dayNumber:number;nextActivityId?:string;mode:string;observedAt:string;}
const options = {unwrapData: false};
export const aiApi = {
  async login(email: string, password: string) {
    const tokens = await http.post<{accessToken: string; refreshToken: string}>('/auth/login', {email,password}, {skipAuth: true, ...options});
    TokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
  },
  destinations: () => http.get<{items: {id: string; name: string}[]}>('/catalog/destinations', {size: 100}, options),
  async places(destinationId: string) {
    const first = await http.get<{items: Place[]; total: number}>('/catalog/places', {destinationId,size: 100,page: 0}, options);
    const pages = await Promise.all(Array.from({length: Math.min(9, Math.ceil(first.total / 100) - 1)}, (_, i) =>
      http.get<{items: Place[]}>('/catalog/places', {destinationId,size: 100,page: i+1}, options)));
    return {items: [...first.items, ...pages.flatMap(p => p.items)]};
  },
  trips: () => http.get<{items: {id: string; title: string; status: string}[]}>('/trips', {}, options),
  trip: (id: string) => http.get<View>(`/trips/${id}`, {}, options),
  create: (title: string) => http.post<View>('/trips', {title}, options),
  save: (trip: Trip, wizard: Wizard, selectedPlaceIds: string[]) => http.put<View>(`/trips/${trip.id}`, {expectedVersion: trip.version,title: trip.title,wizard,selectedPlaceIds,days: []}, options),
  submit: (trip: Trip, preferences: UserPreferences, key: string, event?: Event, autoSelect = false) => http.post<Job>(`/trips/${trip.id}/planning-jobs`, {expectedVersion: trip.version,operation: event ? 'ADAPT' : 'GENERATE',event: event || null,preferences,autoSelect}, {...options,headers: {'Idempotency-Key': key}}),
  job: (tripId: string, id: string) => http.get<Job>(`/trips/${tripId}/planning-jobs/${id}`, {}, options),
  action: (trip: Trip, job: Job, action: 'apply' | 'dismiss' | 'undo') => http.post<Job>(`/trips/${trip.id}/planning-jobs/${job.id}/${action}`, {expectedVersion: trip.version}, options),
  status: (trip: Trip, status: Trip['status']) => http.post<View>(`/trips/${trip.id}/status`, {expectedVersion: trip.version,status}, options),
  complete: (trip: Trip, activity: Activity, completed: boolean) => http.patch<View>(`/trips/${trip.id}/activities/${activity.id}/completion`, {expectedVersion: trip.version,completed}, options),
  assess: (tripId: string, position: LivePosition | null) => http.post<CompanionAdvice>(`/trips/${tripId}/companion-check`, {position}, {...options,timeoutMs:45000}),
  context: (tripId: string) => http.get<Context>(`/trips/${tripId}/travel-context`, {}, {...options,timeoutMs: 45000}),
};

export function paceFor(style: string): Wizard['pace'] {
  return /chậm|thư giãn|nghỉ/i.test(style) ? 'relaxed' : /năng động|khám phá|nhiều/i.test(style) ? 'active' : 'balanced';
}
