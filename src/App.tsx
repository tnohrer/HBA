import React, { useState } from 'react';
import { ChakraUIProvider } from './components/providers/ChakraProvider';
import { MainLayout } from './components/layouts/MainLayout';
import { SearchBar } from './components/features/SearchBar';
import { HotelList } from './components/features/HotelList';
import { HotelDetails } from './components/features/HotelDetails';
import { RoomSelection } from './components/features/RoomSelection';
import { BookingForm } from './components/features/BookingForm';
import { HotelComparison } from './components/features/HotelComparison';
import { TrendingDestinations } from './components/features/TrendingDestinations';
import { SearchResultsFilters } from './components/features/SearchResultsFilters';
import { SearchResultsSkeleton } from './components/ui/LoadingSkeletons';
import { useHotelSearch } from './hooks/useHotelSearch';
import { useBookingStore } from './stores/bookingStore';
import { HotelService } from './services/hotelService';
import { SearchParams, RoomType, Booking, SearchFilters, SortOption } from './types';
import { Box, Text, Stack, Button, HStack, Icon, Badge, Flex } from '@chakra-ui/react';
import { FiArrowLeft, FiClock, FiBarChart2, FiFilter } from 'react-icons/fi';

type AppView = 'search' | 'hotel-details' | 'room-selection' | 'booking-form' | 'booking-success' | 'comparison';

function App() {
  const { 
    searchHotels, 
    isLoading, 
    error 
  } = useHotelSearch();
  
  const { 
    searchParams,
    searchResults,
    selectedHotel,
    setSelectedHotel,
    setSearchResults,
    setSearchParams,
    setError,
    currentReservation,
    reservationTimeRemaining,
    clearReservation,
    comparisonHotels,
    removeFromComparison,
    clearComparison,
    updateFilters,
    setSortOption,
    sortOption
  } = useBookingStore();
  
  const [hasSearched, setHasSearched] = useState(false);
  const [currentView, setCurrentView] = useState<AppView>('search');
  const [selectedRoom, setSelectedRoom] = useState<RoomType | null>(null);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const handleSearch = async (params: SearchParams) => {
    setHasSearched(true);
    setCurrentView('search');
    setSelectedHotel(null);
    await searchHotels(params);
  };

  const handleReset = () => {
    setHasSearched(false);
    setCurrentView('search');
    setSelectedHotel(null);
    setSelectedRoom(null);
    clearReservation();
  };

  const handleDestinationClick = (destination: string) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const searchParams: SearchParams = {
      location: destination,
      checkIn: today.toISOString().split('T')[0],
      checkOut: tomorrow.toISOString().split('T')[0],
      guests: 2,
      filters: {}
    };
    
    handleSearch(searchParams);
  };

  const handleViewHotelDetails = () => {
    if (selectedHotel) {
      setCurrentView('hotel-details');
    }
  };

  const handleBookNow = () => {
    if (selectedHotel) {
      setCurrentView('room-selection');
    }
  };

  const handleRoomSelect = (room: RoomType) => {
    setSelectedRoom(room);
    setCurrentView('booking-form');
  };

  const handleBookingSubmit = (booking: Partial<Booking>) => {
    // Handle successful booking
    setCurrentView('booking-success');
  };

  const handleBackToSearch = () => {
    setCurrentView('search');
    setSelectedHotel(null);
    setSelectedRoom(null);
  };

  const handleBackToHotelDetails = () => {
    setCurrentView('hotel-details');
    setSelectedRoom(null);
  };

  const handleBackToRoomSelection = () => {
    setCurrentView('room-selection');
  };

  const handleShowComparison = () => {
    setCurrentView('comparison');
  };

  const handleCloseComparison = () => {
    setCurrentView('search');
  };

  const handleFiltersChange = async (filters: SearchFilters) => {
    updateFilters(filters);
    // Re-search with updated filters WITHOUT showing full loading state
    if (searchParams) {
      try {
        const updatedParams = {
          ...searchParams,
          filters
        };
        const results = await HotelService.searchHotels(updatedParams, sortOption);
        setSearchResults(results);
        setSearchParams(updatedParams);
              } catch (err) {
          setError(err instanceof Error ? err.message : 'Filter update failed');
        }
    }
  };

  const handleSortChange = async (sort: SortOption) => {
    setSortOption(sort);
    // Re-search with new sort option WITHOUT showing full loading state
    if (searchParams) {
      try {
        const results = await HotelService.searchHotels(searchParams, sort);
        setSearchResults(results);
              } catch (err) {
          setError(err instanceof Error ? err.message : 'Sort update failed');
        }
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Auto-navigate to hotel details when a hotel is selected
  React.useEffect(() => {
    if (selectedHotel && currentView === 'search') {
      setCurrentView('hotel-details');
    }
  }, [selectedHotel, currentView]);

  const showNoResults = hasSearched && !isLoading && !error && searchResults.length === 0;

  // Render different views based on current state
  const renderCurrentView = () => {
    switch (currentView) {
      case 'hotel-details':
        if (!selectedHotel) return null;
        return (
          <Box w="100%" maxW="1000px" className="fade-in">
            <HStack mb={6}>
              <Button
                variant="outline"
                onClick={handleBackToSearch}
                size="sm"
              >
                <Icon as={FiArrowLeft} mr={2} />
                Back to Results
              </Button>
              {currentReservation && reservationTimeRemaining > 0 && (
                <Box
                  bg="orange.100"
                  color="orange.800"
                  px={3}
                  py={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <Icon as={FiClock} />
                  Reservation expires in: {formatTime(reservationTimeRemaining)}
                </Box>
              )}
            </HStack>
            <HotelDetails hotel={selectedHotel} onBookNow={handleBookNow} />
          </Box>
        );

      case 'room-selection':
        if (!selectedHotel) return null;
        return (
          <Box w="100%" maxW="1000px" className="fade-in">
            <HStack mb={6}>
              <Button
                variant="outline"
                onClick={handleBackToHotelDetails}
                size="sm"
              >
                <Icon as={FiArrowLeft} mr={2} />
                Back to Hotel Details
              </Button>
              {currentReservation && reservationTimeRemaining > 0 && (
                <Box
                  bg="orange.100"
                  color="orange.800"
                  px={3}
                  py={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <Icon as={FiClock} />
                  Reservation expires in: {formatTime(reservationTimeRemaining)}
                </Box>
              )}
            </HStack>
            <RoomSelection 
              rooms={selectedHotel.roomTypes} 
              onSelectRoom={handleRoomSelect} 
            />
          </Box>
        );

      case 'booking-form':
        if (!selectedHotel || !selectedRoom) return null;
        return (
          <Box w="100%" maxW="800px" className="fade-in">
            <HStack mb={6}>
              <Button
                variant="outline"
                onClick={handleBackToRoomSelection}
                size="sm"
              >
                <Icon as={FiArrowLeft} mr={2} />
                Back to Room Selection
              </Button>
              {currentReservation && reservationTimeRemaining > 0 && (
                <Box
                  bg="orange.100"
                  color="orange.800"
                  px={3}
                  py={2}
                  borderRadius="md"
                  display="flex"
                  alignItems="center"
                  gap={2}
                  fontSize="sm"
                  fontWeight="medium"
                >
                  <Icon as={FiClock} />
                  Reservation expires in: {formatTime(reservationTimeRemaining)}
                </Box>
              )}
            </HStack>
            <BookingForm 
              hotel={selectedHotel} 
              selectedRoom={selectedRoom}
              onSubmit={handleBookingSubmit}
              onChangeDates={() => setCurrentView('search')}
            />
          </Box>
        );

      case 'booking-success':
        return (
          <Box w="100%" maxW="600px" textAlign="center" className="fade-in">
            <Box
              bg={{ base: "green.50", _dark: "green.900" }}
              border="1px"
              borderColor={{ base: "green.200", _dark: "green.700" }}
              borderRadius="lg"
              p={8}
            >
              <Text fontSize="4xl" mb={4}>🎉</Text>
              <Text fontSize="2xl" fontWeight="bold" mb={4} color={{ base: "green.600", _dark: "green.300" }}>
                Booking Confirmed!
              </Text>
              <Text color={{ base: "gray.600", _dark: "gray.400" }} mb={6}>
                Your reservation has been confirmed. You should receive an email confirmation shortly.
              </Text>
              <Button colorScheme="blue" onClick={handleBackToSearch}>
                Search for More Hotels
              </Button>
            </Box>
          </Box>
        );

      case 'comparison':
        return (
          <Box w="100%" maxW="1200px" className="fade-in">
            <HotelComparison
              hotels={comparisonHotels}
              onRemoveHotel={removeFromComparison}
              onSelectHotel={(hotel) => {
                setSelectedHotel(hotel);
                setCurrentView('hotel-details');
              }}
              onClose={handleCloseComparison}
            />
          </Box>
        );

      default:
        return (
          <>
            <Box textAlign="center" py={8} w="100%" maxW="800px" className="fade-in">
              <Text as="h1" fontSize="3xl" fontWeight="bold" mb={2} color={{ base: "gray.800", _dark: "white" }}>
                Find your perfect stay
              </Text>
              <Text fontSize="lg" color={{ base: "gray.600", _dark: "gray.400" }}>
                Discover amazing hotels at the best prices
              </Text>
            </Box>

            <Box w="100%" maxW="800px" className="slide-up">
              <SearchBar 
                onSearch={handleSearch} 
                onReset={handleReset}
                hasSearched={hasSearched}
              />
            </Box>

            {!hasSearched && !isLoading && !error && (
              <Box w="100%" className="fade-in">
                <TrendingDestinations onDestinationClick={handleDestinationClick} />
              </Box>
            )}

            {isLoading && !hasSearched && (
              <Box w="100%" className="fade-in">
                <SearchResultsSkeleton />
              </Box>
            )}

            {error && !hasSearched && (
              <Box 
                textAlign="center" 
                py={8}
                w="100%"
                maxW="800px"
                bg={{ base: "red.50", _dark: "red.900" }}
                borderRadius="lg"
                border="1px"
                borderColor={{ base: "red.200", _dark: "red.700" }}
                className="slide-up"
              >
                <Text fontSize="lg" color={{ base: "red.500", _dark: "red.300" }} p={4} borderRadius="md">
                  ❌ {error.message}
                </Text>
              </Box>
            )}

            {isLoading && hasSearched && (
              <Box w="100%" maxW="1200px" className="fade-in">
                <Flex gap={6} align="flex-start" justify="flex-start">
                  {/* Sidebar Filters - Hidden during loading and on mobile */}
                  <Box w="320px" flexShrink={0} display={{ base: "none", md: "block" }} />
                  
                  {/* Loading Results - Full width on mobile */}
                  <Box flex="1" minW="0" w={{ base: "100%", md: "auto" }}>
                    <SearchResultsSkeleton />
                  </Box>
                </Flex>
              </Box>
            )}

            {error && hasSearched && (
              <Box w="100%" maxW="1200px" className="slide-up">
                <Flex gap={6} align="flex-start" justify="flex-start">
                  {/* Sidebar space - Hidden on mobile */}
                  <Box w="320px" flexShrink={0} display={{ base: "none", md: "block" }} />
                  
                  {/* Error Message - Full width on mobile */}
                  <Box flex="1" minW="0" w={{ base: "100%", md: "auto" }}>
                    <Box 
                      textAlign="center" 
                      py={8}
                      bg={{ base: "red.50", _dark: "red.900" }}
                      borderRadius="lg"
                      border="1px"
                      borderColor={{ base: "red.200", _dark: "red.700" }}
                    >
                      <Text fontSize="lg" color={{ base: "red.500", _dark: "red.300" }} p={4} borderRadius="md">
                        ❌ {typeof error === 'string' ? error : error?.message || 'An error occurred'}
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            )}

            {showNoResults && (
              <Box w="100%" maxW="1200px" className="slide-up">
                <Flex gap={6} align="flex-start" justify="flex-start">
                  {/* Show filters even with no results so users can adjust them - Hidden on mobile */}
                  <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                    <SearchResultsFilters
                      filters={searchParams?.filters || { amenities: [] }}
                      onFiltersChange={handleFiltersChange}
                      onSortChange={handleSortChange}
                      sortOption={sortOption}
                      resultCount={0}
                      isVisible={true}
                    />
                  </Box>
                  
                  {/* No Results Message - Full width on mobile */}
                  <Box flex="1" minW="0" w={{ base: "100%", md: "auto" }}>
                    <Box 
                      textAlign="center" 
                      py={12}
                      bg={{ base: "gray.50", _dark: "gray.800" }}
                      borderRadius="lg"
                      border="1px"
                      borderColor={{ base: "gray.200", _dark: "gray.600" }}
                    >
                      <Text fontSize="xl" color={{ base: "gray.600", _dark: "gray.400" }} mb={2}>
                        😔 No hotels found
                      </Text>
                      <Text color={{ base: "gray.500", _dark: "gray.500" }}>
                        Try adjusting your search criteria or exploring different destinations
                      </Text>
                    </Box>
                  </Box>
                </Flex>
              </Box>
            )}

            {searchResults.length > 0 && (
              <Box w="100%" maxW="1200px" className="fade-in">
                <Flex gap={6} align="flex-start" justify="flex-start">
                  {/* Sidebar Filters - Hidden on mobile */}
                  <Box flexShrink={0} display={{ base: "none", md: "block" }}>
                    <SearchResultsFilters
                      filters={searchParams?.filters || { amenities: [] }}
                      onFiltersChange={handleFiltersChange}
                      onSortChange={handleSortChange}
                      sortOption={sortOption}
                      resultCount={searchResults.length}
                      isVisible={true}
                    />
                  </Box>
                  
                  {/* Search Results - Full width on mobile */}
                  <Box flex="1" minW="0" w={{ base: "100%", md: "auto" }}>
                    <HotelList hotels={searchResults} />
                  </Box>
                </Flex>
              </Box>
            )}
          </>
        );
    }
  };

  return (
    <ChakraUIProvider>
      <MainLayout>
        <Stack gap={8} align="center" w="100%">
          {renderCurrentView()}
        </Stack>

        {/* Mobile Filter Button - Only visible on mobile when there are search results */}
        {hasSearched && currentView === 'search' && (
          <Box
            position="fixed"
            bottom={6}
            left={6}
            bg={{ base: "gray.700", _dark: "gray.600" }}
            color="white"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            zIndex={1000}
            cursor="pointer"
            onClick={() => setIsMobileFiltersOpen(true)}
            _hover={{
              bg: { base: "gray.800", _dark: "gray.700" },
              transform: "translateY(-2px)",
              boxShadow: "xl"
            }}
            transition="all 0.2s ease"
            className="fade-in"
            display={{ base: "block", md: "none" }}
          >
            <Flex align="center" gap={3}>
              <Icon as={FiFilter} boxSize={5} />
              <Box>
                <Text fontWeight="bold" fontSize="sm">
                  Filters
                </Text>
                <Text fontSize="xs" opacity={0.9}>
                  {searchResults.length} result{searchResults.length > 1 ? 's' : ''}
                </Text>
              </Box>
              {(() => {
                const activeFilterCount = [
                  searchParams?.filters.priceRange && (searchParams.filters.priceRange[0] > 0 || searchParams.filters.priceRange[1] < 1000),
                  searchParams?.filters.rating !== undefined,
                  searchParams?.filters.amenities && searchParams.filters.amenities.length > 0
                ].filter(Boolean).length;
                
                return activeFilterCount > 0 ? (
                  <Badge colorScheme="blue" borderRadius="full">
                    {activeFilterCount}
                  </Badge>
                ) : null;
              })()}
            </Flex>
          </Box>
        )}

        {/* Floating Comparison Panel */}
        {comparisonHotels.length > 0 && currentView !== 'comparison' && (
          <Box
            position="fixed"
            bottom={6}
            right={6}
            bg={{ base: "blue.500", _dark: "blue.600" }}
            color="white"
            p={4}
            borderRadius="lg"
            boxShadow="lg"
            zIndex={1000}
            cursor="pointer"
            onClick={handleShowComparison}
            _hover={{
              bg: { base: "blue.600", _dark: "blue.700" },
              transform: "translateY(-2px)",
              boxShadow: "xl"
            }}
            transition="all 0.2s ease"
            className="fade-in"
          >
            <Flex align="center" gap={3}>
              <Icon as={FiBarChart2} boxSize={5} />
              <Box>
                <Text fontWeight="bold" fontSize="sm">
                  Compare Hotels
                </Text>
                <Text fontSize="xs" opacity={0.9}>
                  {comparisonHotels.length} hotel{comparisonHotels.length > 1 ? 's' : ''} selected
                </Text>
              </Box>
              <Badge colorScheme="orange" borderRadius="full">
                {comparisonHotels.length}
              </Badge>
            </Flex>
          </Box>
        )}

        {/* Mobile Filter Modal */}
        {isMobileFiltersOpen && (
          <>
            {/* Backdrop */}
            <Box
              position="fixed"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              zIndex={1500}
              onClick={() => setIsMobileFiltersOpen(false)}
              className="fade-in"
            />
            
            {/* Modal Content */}
            <Box
              position="fixed"
              bottom={0}
              left={0}
              right={0}
              bg={{ base: "white", _dark: "gray.800" }}
              borderTopRadius="xl"
              zIndex={1600}
              maxH="90vh"
              overflowY="auto"
              className="slide-up"
              boxShadow="0 -4px 20px rgba(0, 0, 0, 0.15)"
            >
              {/* Modal Header */}
              <HStack justify="space-between" p={4} borderBottom="1px" borderColor={{ base: "gray.200", _dark: "gray.600" }}>
                <Text fontSize="lg" fontWeight="bold" color={{ base: "gray.800", _dark: "white" }}>
                  Filter Hotels
                </Text>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  color={{ base: "gray.600", _dark: "gray.400" }}
                >
                  ✕
                </Button>
              </HStack>

              {/* Filter Content */}
              <Box p={4}>
                <SearchResultsFilters
                  filters={searchParams?.filters || { amenities: [] }}
                  onFiltersChange={(filters) => {
                    handleFiltersChange(filters);
                  }}
                  onSortChange={handleSortChange}
                  sortOption={sortOption}
                  resultCount={searchResults.length}
                  isVisible={true}
                />
              </Box>

              {/* Modal Footer */}
              <Box p={4} borderTop="1px" borderColor={{ base: "gray.200", _dark: "gray.600" }} bg={{ base: "gray.50", _dark: "gray.700" }}>
                <HStack gap={3}>
                  <Button
                    flex="1"
                    colorScheme="blue"
                    onClick={() => setIsMobileFiltersOpen(false)}
                    size="lg"
                  >
                    Apply Filters ({searchResults.length} result{searchResults.length > 1 ? 's' : ''})
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const newFilters = { priceRange: undefined, amenities: [], rating: undefined };
                      handleFiltersChange(newFilters);
                      setIsMobileFiltersOpen(false);
                    }}
                    size="lg"
                  >
                    Clear All
                  </Button>
                </HStack>
              </Box>
            </Box>
          </>
        )}
      </MainLayout>
    </ChakraUIProvider>
  );
}

export default App;
