import create from 'zustand';
import { Hotel, SearchParams, Booking, RoomReservation, SearchFilters, SortOption, RecentSearch } from '../types';
import { devtools } from 'zustand/middleware';

interface BookingState {
  searchParams: SearchParams | null;
  searchResults: Hotel[];
  selectedHotel: Hotel | null;
  isLoading: boolean;
  error: string | null;
  recentSearches: RecentSearch[];
  sortOption: SortOption;
  comparisonHotels: Hotel[];
  currentReservation: RoomReservation | null;
  reservationTimeRemaining: number;
  
  // Search actions
  setSearchParams: (params: SearchParams) => void;
  setSearchResults: (results: Hotel[]) => void;
  setSelectedHotel: (hotel: Hotel | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearSearchResults: () => void;
  
  // Filter actions
  updateFilters: (filters: Partial<SearchFilters>) => void;
  setSortOption: (option: SortOption) => void;
  
  // Recent searches
  addRecentSearch: (search: RecentSearch) => void;
  clearRecentSearches: () => void;
  
  // Comparison actions
  addToComparison: (hotel: Hotel) => void;
  removeFromComparison: (hotelId: string) => void;
  clearComparison: () => void;
  
  // Reservation actions
  setCurrentReservation: (reservation: RoomReservation | null) => void;
  setReservationTimeRemaining: (time: number) => void;
  clearReservation: () => void;
}

const defaultFilters: SearchFilters = {
  priceRange: undefined,
  amenities: [],
  rating: undefined,
};

export const useBookingStore = create<BookingState>()(
  devtools(
    (set, get) => ({
      searchParams: null,
      searchResults: [],
      selectedHotel: null,
      isLoading: false,
      error: null,
      recentSearches: [],
      sortOption: 'popularity-desc',
      comparisonHotels: [],
      currentReservation: null,
      reservationTimeRemaining: 0,
      
      setSearchParams: (params) => {
        set({ searchParams: params }, false, 'setSearchParams');
      },
      
      setSearchResults: (results) => {
        set({ searchResults: results }, false, 'setSearchResults');
      },
      
      setSelectedHotel: (hotel) => {
        set({ selectedHotel: hotel }, false, 'setSelectedHotel');
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading }, false, 'setLoading');
      },
      
      setError: (error) => {
        set({ error }, false, 'setError');
      },
      
      clearSearchResults: () => {
        set({ 
          searchResults: [], 
          selectedHotel: null, 
          error: null 
        }, false, 'clearSearchResults');
      },
      
      updateFilters: (newFilters) => {
        const currentParams = get().searchParams;
        if (currentParams) {
          set({
            searchParams: {
              ...currentParams,
              filters: { ...currentParams.filters, ...newFilters }
            }
          }, false, 'updateFilters');
        }
      },
      
      setSortOption: (option) => {
        set({ sortOption: option }, false, 'setSortOption');
      },
      
      addRecentSearch: (search) => {
        const currentSearches = get().recentSearches;
        const filteredSearches = currentSearches.filter(
          s => !(s.location === search.location && 
                s.checkIn === search.checkIn && 
                s.checkOut === search.checkOut)
        );
        const newSearches = [search, ...filteredSearches].slice(0, 5);
        set({ recentSearches: newSearches }, false, 'addRecentSearch');
      },
      
      clearRecentSearches: () => {
        set({ recentSearches: [] }, false, 'clearRecentSearches');
      },
      
      addToComparison: (hotel) => {
        const currentComparison = get().comparisonHotels;
        if (currentComparison.length >= 3) {
          // Replace the oldest hotel if we're at the maximum
          set({ 
            comparisonHotels: [...currentComparison.slice(1), hotel] 
          }, false, 'addToComparison');
        } else if (!currentComparison.find(h => h.id === hotel.id)) {
          // Only add if not already in comparison
          set({ 
            comparisonHotels: [...currentComparison, hotel] 
          }, false, 'addToComparison');
        }
      },
      
      removeFromComparison: (hotelId) => {
        const currentComparison = get().comparisonHotels;
        set({ 
          comparisonHotels: currentComparison.filter(h => h.id !== hotelId) 
        }, false, 'removeFromComparison');
      },
      
      clearComparison: () => {
        set({ comparisonHotels: [] }, false, 'clearComparison');
      },
      
      setCurrentReservation: (reservation) => {
        set({ currentReservation: reservation }, false, 'setCurrentReservation');
      },
      
      setReservationTimeRemaining: (time) => {
        set({ reservationTimeRemaining: time }, false, 'setReservationTimeRemaining');
      },
      
      clearReservation: () => {
        set({ 
          currentReservation: null, 
          reservationTimeRemaining: 0 
        }, false, 'clearReservation');
      }
    }),
    {
      name: 'booking-store',
    }
  )
);
