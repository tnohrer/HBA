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
    currentSort,
    currentFilters 
  } = useBookingStore();

  const searchHotels = async (params: SearchParams, sortBy?: SortOption) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use provided sort option or current store sort
      const sortOption = sortBy || currentSort;
      
      // Merge current filters with search params
      const searchParamsWithFilters = {
        ...params,
        filters: {
          ...currentFilters,
          ...params.filters
        }
      };
      
      const results = await HotelService.searchHotels(searchParamsWithFilters, sortOption);
      
      setSearchResults(results);
      setSearchParams(searchParamsWithFilters);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const searchWithCurrentFilters = async (baseParams: Omit<SearchParams, 'filters'>, sortBy?: SortOption) => {
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
