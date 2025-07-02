export interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  rating: number;
  images: {
    lobby: string[];
    exterior: string[];
    rooms: string[];
  };
  amenities: string[];
  roomTypes: RoomType[];
}

export interface RoomType {
  id: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
  status: 'available' | 'booked' | 'maintenance' | 'reserved';
  images: string[];
}

export interface RoomReservation {
  id: string;
  roomTypeId: string;
  hotelId: string;
  userId: string; // In a real app, this would be the authenticated user ID
  expiresAt: Date;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
}

export interface Booking {
  id: string;
  hotelId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  reservationId?: string; // Link to the original reservation
}

// Enhanced search and filter types
export interface SearchFilters {
  priceRange?: [number, number];
  amenities?: string[];
  rating?: number;
}

export interface SearchParams {
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  filters: SearchFilters;
}

export interface RecentSearch {
  id: string;
  location: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  timestamp: number;
}

export interface DestinationSuggestion {
  id: string;
  name: string;
  country: string;
  popularityScore: number;
}

export type SortOption = 'price-asc' | 'price-desc' | 'rating-desc' | 'rating-asc' | 'name-asc' | 'popularity-desc';

export interface SortOptionConfig {
  value: SortOption;
  label: string;
  icon?: string;
}

// Common amenities list for filtering
export const COMMON_AMENITIES = [
  { id: 'wifi', label: 'Free WiFi', icon: 'wifi' },
  { id: 'pool', label: 'Swimming Pool', icon: 'waves' },
  { id: 'gym', label: 'Fitness Center', icon: 'activity' },
  { id: 'spa', label: 'Spa & Wellness', icon: 'heart' },
  { id: 'restaurant', label: 'Restaurant', icon: 'utensils' },
  { id: 'bar', label: 'Bar/Lounge', icon: 'coffee' },
  { id: 'parking', label: 'Free Parking', icon: 'car' },
  { id: 'pet', label: 'Pet Friendly', icon: 'pet' },
  { id: 'business', label: 'Business Center', icon: 'briefcase' },
  { id: 'room-service', label: 'Room Service', icon: 'room-service' },
  { id: 'concierge', label: 'Concierge', icon: 'user-check' },
  { id: 'laundry', label: 'Laundry Service', icon: 'shirt' }
] as const;

// Popular destinations for autocomplete
export const POPULAR_DESTINATIONS: DestinationSuggestion[] = [
  // Major Cities
  { id: 'new-york', name: 'New York', country: 'United States', popularityScore: 95 },
  { id: 'miami', name: 'Miami', country: 'United States', popularityScore: 88 },
  { id: 'las-vegas', name: 'Las Vegas', country: 'United States', popularityScore: 92 },
  { id: 'los-angeles', name: 'Los Angeles', country: 'United States', popularityScore: 90 },
  { id: 'chicago', name: 'Chicago', country: 'United States', popularityScore: 85 },
  { id: 'san-francisco', name: 'San Francisco', country: 'United States', popularityScore: 87 },
  { id: 'boston', name: 'Boston', country: 'United States', popularityScore: 83 },
  { id: 'seattle', name: 'Seattle', country: 'United States', popularityScore: 80 },
  { id: 'washington', name: 'Washington DC', country: 'United States', popularityScore: 86 },
  
  // Resort/Vacation Cities
  { id: 'aspen', name: 'Aspen', country: 'United States', popularityScore: 82 },
  { id: 'malibu', name: 'Malibu', country: 'United States', popularityScore: 78 },
  { id: 'destin', name: 'Destin', country: 'United States', popularityScore: 75 },
  { id: 'maui', name: 'Maui', country: 'United States', popularityScore: 89 },
  
  // States
  { id: 'california', name: 'California', country: 'United States', popularityScore: 94 },
  { id: 'florida', name: 'Florida', country: 'United States', popularityScore: 91 },
  { id: 'new-york-state', name: 'New York State', country: 'United States', popularityScore: 88 },
  { id: 'nevada', name: 'Nevada', country: 'United States', popularityScore: 84 },
  { id: 'hawaii', name: 'Hawaii', country: 'United States', popularityScore: 93 },
  { id: 'colorado', name: 'Colorado', country: 'United States', popularityScore: 79 },
  { id: 'massachusetts', name: 'Massachusetts', country: 'United States', popularityScore: 76 },
  { id: 'illinois', name: 'Illinois', country: 'United States', popularityScore: 77 }
];
