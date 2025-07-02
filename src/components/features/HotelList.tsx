import React from 'react';
import { 
  Box, 
  Text, 
  Heading, 
  SimpleGrid, 
  Flex,
  HStack,
  Badge
} from '@chakra-ui/react';
import { Hotel } from '../../types';
import { HotelCard } from './HotelCard';
import { useBookingStore } from '../../stores/bookingStore';

interface HotelListProps {
  hotels: Hotel[];
}

export const HotelList: React.FC<HotelListProps> = ({ hotels }) => {
  const { setSelectedHotel, searchParams } = useBookingStore();

  if (hotels.length === 0) {
    return (
      <Box 
        textAlign="center" 
        py={12}
        bg={{ base: "gray.50", _dark: "gray.800" }}
        borderRadius="lg"
        border="1px"
        borderColor={{ base: "gray.200", _dark: "gray.600" }}
        className="slide-up"
      >
        <Heading size="md" mb={2} color={{ base: "gray.800", _dark: "white" }}>
          No hotels found
        </Heading>
        <Text color={{ base: "gray.600", _dark: "gray.400" }}>
          Try adjusting your search criteria
        </Text>
      </Box>
    );
  }

  // Calculate average price for comparison
  const avgPrice = hotels.reduce((sum, hotel) => sum + hotel.price, 0) / hotels.length;
  const sortedHotels = [...hotels]; // Already sorted by the service

  return (
    <Box pb={8} w="100%" className="fade-in">
      {/* Header Section */}
      <Box 
        mb={8}
        p={6}
        bg={{ base: "white", _dark: "gray.800" }}
        borderRadius="lg"
        border="1px"
        borderColor={{ base: "gray.200", _dark: "gray.600" }}
        boxShadow="sm"
        className="slide-up"
      >
        <Flex 
          justify="space-between" 
          align="center" 
          mb={4}
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
        >
          <Box>
            <Heading size="lg" color={{ base: "gray.800", _dark: "white" }} mb={2}>
              Available Hotels
            </Heading>
            {searchParams && (
              <Text color={{ base: "gray.600", _dark: "gray.400" }} fontSize="sm">
                {searchParams.location} • {searchParams.checkIn} to {searchParams.checkOut} • {searchParams.guests} guest{searchParams.guests > 1 ? 's' : ''}
              </Text>
            )}
          </Box>
          
          <HStack gap={4}>
            <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
              {hotels.length} properties found
            </Badge>
            <Badge colorScheme="green" fontSize="sm" px={3} py={1} borderRadius="full">
              Avg ${Math.round(avgPrice)}/night
            </Badge>
          </HStack>
        </Flex>
        
        {/* Custom divider */}
        <Box 
          borderTop="1px" 
          borderColor={{ base: "gray.200", _dark: "gray.600" }}
          my={4} 
        />
        
        <HStack gap={4} mt={4} wrap="wrap">
          <Text fontSize="sm" color={{ base: "gray.500", _dark: "gray.400" }}>
            💡 Tip: Click any hotel to view details and check room availability
          </Text>
        </HStack>
      </Box>
      
      {/* Hotels Grid with Stagger Animation */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
        {sortedHotels.map((hotel, index) => (
          <Box
            key={hotel.id}
            className="stagger-item"
            style={{ 
              animationDelay: `${index * 0.1}s`,
              animationFillMode: 'both'
            }}
          >
            <HotelCard
              hotel={hotel}
              onSelect={(hotel) => setSelectedHotel(hotel)}
            />
          </Box>
        ))}
      </SimpleGrid>
      
      {/* Bottom Summary */}
      {hotels.length > 6 && (
        <Box 
          mt={8}
          p={4}
          bg={{ base: "blue.50", _dark: "blue.900" }}
          borderRadius="lg"
          border="1px"
          borderColor={{ base: "blue.200", _dark: "blue.700" }}
          textAlign="center"
          className="fade-in"
        >
          <Text color={{ base: "blue.600", _dark: "blue.300" }} fontSize="sm">
            Showing all {hotels.length} available hotels. 
            Scroll up to refine your search with filters.
          </Text>
        </Box>
      )}
    </Box>
  );
};
