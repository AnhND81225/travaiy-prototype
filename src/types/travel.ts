export type ScreenId =
  | 'stays'
  | 'stay-detail'
  | 'memory-map'
  | 'welcome'
  | 'onboarding-1'
  | 'onboarding-2'
  | 'onboarding-3'
  | 'onboarding-4'
  | 'onboarding-complete'
  | 'home'
  | 'explore'
  | 'map'
  | 'search'
  | 'place-detail'
  | 'wishlist'
  | 'wizard-destination'
  | 'wizard-stay'
  | 'wizard-places'
  | 'wizard-dates'
  | 'wizard-companions'
  | 'wizard-budget'
  | 'wizard-preferences'
  | 'wizard-summary'
  | 'ai-generating'
  | 'trip-overview'
  | 'day-itinerary'
  | 'itinerary-edit'
  | 'trip-preparation'
  | 'packing-list'
  | 'today-schedule'
  | 'adaptive-schedule'
  | 'group-space'
  | 'group-poll'
  | 'group-location'
  | 'group-expense-split'
  | 'trip-expenses'
  | 'photobooth'
  | 'create-recap'
  | 'trip-recap-final'
  | 'journal-album'
  | 'community-feed'
  | 'create-post'
  | 'saved-items'
  | 'travel-wallet'
  | 'add-travel-document'
  | 'travel-document-detail'
  | 'trip-subscription'
  | 'ai-itinerary-proposal'
  | 'adaptive-preview-skip'
  | 'profile';

export type NavTab = 'home' | 'create-trip' | 'explore' | 'trips' | 'profile';

export interface UserPreferences {
  interests: string[];
  travelStyle: string;
  priorities: string[];
  timeOfDay: string[];
}

export interface TripWizardData {
  planningMode?: 'ai' | 'manual';
  stayId?: string;
  hotelBudgetPerNight?: number;
  stayRoomCount?: number;
  stayDatesMode?: 'trip' | 'custom';
  checkIn?: string;
  checkOut?: string;
  destination: string;
  destinationTagline?: string;
  destinationImage?: string;
  startDate: string;
  endDate: string;
  durationText: string;
  departureTime: string;
  returnTime: string;
  companionType: 'solo' | 'group';
  companionCount: number;
  inviteCode: string;
  budgetTier: 'Tiết kiệm' | 'Vừa túi tiền' | 'Thoải mái' | 'Tùy chỉnh';
  budgetAmount: number;
  interests: string[];
  transport: string;
  accommodation: string;
  mustVisitPlaces: string[];
  notes: string;
}

export interface Place {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  openHours: string;
  priceRange: string;
  city: string;
  address: string;
  distance: string;
  isSaved?: boolean;
  images: string[];
  tags: string[];
  description: string;
  coordinates?: { x: number; y: number; lat?: number; lng?: number };
}

export interface Destination {
  id: string;
  title: string;
  location: string;
  region: string;
  tagline: string;
  rating: number;
  duration?: string;
  image: string;
  badge?: string;
  placesCount?: number;
}

export interface Collection {
  id: string;
  title: string;
  updatedTime: string;
  tags: string;
  placesCount: number;
  image: string;
  isDefault?: boolean;
}

export interface TripDayItem {
  id: string;
  time: string;
  placeName: string;
  category: string;
  note: string;
  cost: string;
  duration: string;
  image?: string;
  rating?: number;
  reviewsCount?: number;
  address?: string;
}

export interface TripPlan {
  id: string;
  destination: string;
  title: string;
  days: number;
  dates: string;
  coverImage: string;
  estimatedCostPerPerson: string;
  daysSchedule: {
    dayNumber: number;
    title: string;
    dateText: string;
    dayCost: string;
    items: TripDayItem[];
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type: 'weather' | 'reminder' | 'social';
  isRead: boolean;
}

export interface PackingItem {
  id: string;
  name: string;
  categoryId: string;
  isChecked: boolean;
  quantity?: number;
}
