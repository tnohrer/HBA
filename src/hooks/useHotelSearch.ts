import { useState } from 'react';
import { SearchParams, SortOption } from '../types';
import { HotelService } from '../services/hotelService';
import { useBookingStore } from '../stores/bookingStore';

export const useHotelSearch = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { 
    setSearchResults, 
    setSearchParams, 
    sortOption,
    searchParams 
  } = useBookingStore();

  const searchHotels = async (params: SearchParams, sortBy?: SortOption) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use provided sort option or current store sort
      const currentSortOption = sortBy || sortOption;
      
      // Merge current filters with search params
      const currentFilters = searchParams?.filters || {};
      const searchParamsWithFilters = {
        ...params,
        filters: {
          ...currentFilters,
          ...params.filters
        }
      };
      
      const results = await HotelService.searchHotels(searchParamsWithFilters, currentSortOption);
      
      setSearchResults(results);
      setSearchParams(searchParamsWithFilters);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const searchWithCurrentFilters = async (baseParams: Omit<SearchParams, 'filters'>, sortBy?: SortOption) => {
    const currentFilters = searchParams?.filters || {};
    const fullParams: SearchParams = {
      ...baseParams,
      filters: currentFilters
    };
    return searchHotels(fullParams, sortBy);
  };

  return {
    searchHotels,
    searchWithCurrentFilters,
    isLoading,
    error,
  };
};
