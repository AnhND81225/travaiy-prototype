import type { BackendPlace } from '../places/places.types';

export interface PublicOffer {
  id: string;
  placeId: string;
  title: string;
  description?: string;
  priceVnd: number;
  startsOn?: string;
  endsOn?: string;
}

export interface StayQueryParams {
  destinationId?: string;
  q?: string;
  minCostVnd?: number;
  maxCostVnd?: number;
  page?: number;
  size?: number;
}

export interface StayDetail extends BackendPlace {
  offers?: PublicOffer[];
}
