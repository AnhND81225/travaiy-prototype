/**
 * Types cho Catalog, Places & Destinations khớp OpenAPI TravAIy Backend
 */

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface BackendPlace {
  id: string;
  destinationId: string;
  category: string;
  name: string;
  description?: string;
  address?: string;
  indoor?: boolean;
  location?: Coordinate;
  durationMinutes?: number;
  estimatedCostVnd?: number;
  openingHoursKnown?: boolean;
  stayCheckIn?: string;
  stayCheckOut?: string;
  averageRating?: number;
  reviewCount?: number;
  isFavorite?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  description?: string;
  timezone?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface PagePlace {
  items: BackendPlace[];
  page: number;
  size: number;
  total: number;
}

export interface PageDestination {
  items: Destination[];
  page: number;
  size: number;
  total: number;
}

export interface PlaceFilterParams {
  destinationId?: string;
  category?: string;
  q?: string;
  minCostVnd?: number;
  maxCostVnd?: number;
  indoor?: boolean;
  page?: number;
  size?: number;
}

export interface PlaceReview {
  id: string;
  placeId: string;
  rating: number;
  body?: string;
  status?: string;
  updatedAt?: string;
  version?: number;
}
