/**
 * Types cho Trips & Itinerary khớp với OpenAPI TravAIy Backend
 */
import type { BackendPlace, Coordinate } from '../places/places.types';

export interface Activity {
  id: string;
  kind?: string;
  placeId?: string;
  startTime?: string;
  durationMinutes?: number;
  locked?: boolean;
  note?: string;
  place?: BackendPlace;
}

export interface DaySchedule {
  date: string;
  activities: Activity[];
}

export interface StayConfig {
  placeId?: string;
  checkInDate?: string;
  checkOutDate?: string;
}

export interface WizardData {
  destinationId?: string;
  startDate?: string;
  endDate?: string;
  departureTime?: string;
  returnTime?: string;
  companionType?: string;
  companionCount?: number;
  budgetVnd?: number;
  categories?: string[];
  pace?: string;
  transport?: string;
  accommodation?: string;
  notes?: string;
  stay?: StayConfig;
}

export interface Trip {
  id: string;
  ownerId?: string;
  title: string;
  status: 'DRAFT' | 'PLANNING' | 'READY' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | string;
  version: number;
  timezone?: string;
  wizard?: WizardData;
  selectedPlaces?: BackendPlace[];
  stayPlace?: BackendPlace;
  days?: DaySchedule[];
  warnings?: string[];
  updatedAt?: string;
  planMode?: string;
  completedActivityIds?: string[];
}

export interface TripSummary {
  id: string;
  title: string;
  status: string;
  version: number;
  role: string;
  updatedAt: string;
}

export interface PageSummary {
  items: TripSummary[];
  page: number;
  size: number;
  total: number;
}

export interface TripDetailView {
  trip: Trip;
  role: string;
}

export interface CreateTripRequest {
  title: string;
}

export interface SaveTripRequest {
  expectedVersion: number;
  title?: string;
  wizard?: WizardData;
  selectedPlaceIds?: string[];
  days?: DaySchedule[];
}

export interface PlanningJobSubmit {
  expectedVersion: number;
  operation: string; // e.g. "GENERATE_PLAN", "OPTIMIZE", "ADAPT"
  event?: Record<string, unknown>;
}

export interface JobView {
  id: string;
  operation: string;
  state: 'QUEUED' | 'RUNNING' | 'SUCCEEDED' | 'FAILED' | string;
  baseVersion: number;
  proposal?: Record<string, unknown>;
  errorCode?: string;
  appliedVersion?: number;
  undoneVersion?: number;
  dismissed?: boolean;
  mode?: string;
  changes?: Array<{
    activityId?: string;
    beforeDate?: string;
    beforeTime?: string;
    afterDate?: string;
    afterTime?: string;
  }>;
}

export interface QuotaInfo {
  packageName?: string;
  limit?: number;
  used?: number;
  reserved?: number;
  available?: number;
}
