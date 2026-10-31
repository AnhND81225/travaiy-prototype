/**
 * Types cho Media & Albums khớp OpenAPI TravAIy Backend
 */

export interface Album {
  id: string;
  tripId: string;
  createdBy?: string;
  title: string;
  audience?: string;
  version: number;
  createdAt?: string;
}

export interface MediaItem {
  id: string;
  albumId?: string;
  createdBy?: string;
  title?: string;
  mime?: string;
  byteSize?: number;
  width?: number;
  height?: number;
  placeId?: string;
  lat?: number;
  lng?: number;
  capturedAt?: string;
  deleted?: boolean;
  version: number;
  createdAt?: string;
}

export interface MediaInput {
  title?: string;
  placeId?: string;
  lat?: number;
  lng?: number;
  capturedAt?: string;
}

export interface PageMedia {
  items: MediaItem[];
  page: number;
  size: number;
  total: number;
}
