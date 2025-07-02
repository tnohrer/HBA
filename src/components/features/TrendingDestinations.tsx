import React from 'react';
import { Box, Heading, Text, Grid } from '@chakra-ui/react';

interface Destination {
  id: string;
  name: string;
  country: string;
  flag: string;
  image: string;
  description: string;
}

interface TrendingDestinationsProps {
  onDestinationClick?: (destination: string) => void;
}

const TRENDING_DESTINATIONS: Destination[] = [
  {
    id: 'new-york',
    name: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    image: '/Hotel/NewYorkHotelTrending.jpg',
    description: 'The city that never sleeps'
  },
  {
    id: 'miami',
    name: 'Miami',
    country: 'United States', 
    flag: '🇺🇸',
    image: '/Hotel/HotelExterior3.jpg',
    description: 'Beautiful beaches and vibrant nightlife'
  },
  {
    id: 'aspen',
    name: 'Aspen',
    country: 'United States',
    flag: '🇺🇸', 
    image: '/Hotel/AspenHotelExterior.jpg',
    description: 'Mountain paradise for outdoor enthusiasts'
  }
];

export const TrendingDestinations: React.FC<TrendingDestinationsProps> = ({ 
  onDestinationClick 
}) => {
  const handleDestinationClick = (destination: Destination) => {
    if (onDestinationClick) {
      onDestinationClick(destination.name);
    }
  };

  return (
    <Box mt={12} mb={8}>
      <Box mb={6}>
        <Heading size="lg" color={{ base: "gray.800", _dark: "white" }} mb={2}>
          Trending destinations
        </Heading>
        <Text color={{ base: "gray.600", _dark: "gray.300" }} fontSize="md">
          Travelers searching for hotels also booked these popular destinations
        </Text>
      </Box>

      <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} gap={4}>
        {TRENDING_DESTINATIONS.map((destination) => (
          <Box
            key={destination.id}
            bg={{ base: "white", _dark: "gray.800" }}
            borderRadius="lg"
            overflow="hidden"
            cursor="pointer"
            transition="all 0.3s ease"
            _hover={{
              transform: "translateY(-4px)",
              shadow: "lg",
            }}
            onClick={() => handleDestinationClick(destination)}
            position="relative"
            minH="240px"
            shadow="md"
          >
            {/* Background Image */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              backgroundImage={`url(${destination.image})`}
              backgroundSize="cover"
              backgroundPosition="center"
              backgroundRepeat="no-repeat"
            />
            
            {/* Overlay */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.400"
              background="linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)"
            />

            {/* Content */}
            <Box
              position="relative"
              zIndex={1}
              display="flex"
              flexDirection="column"
              justifyContent="flex-end"
              p={6}
              color="white"
              h="100%"
            >
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb={1}>
                  {destination.name} {destination.flag}
                </Text>
                <Text fontSize="sm" opacity={0.9}>
                  {destination.description}
                </Text>
              </Box>
            </Box>
          </Box>
        ))}
      </Grid>
    </Box>
  );
}; 