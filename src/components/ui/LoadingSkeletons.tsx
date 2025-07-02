import React from 'react';
import { Box, Grid, GridItem, Stack, HStack, VStack } from '@chakra-ui/react';
import { useColorModeValue } from './color-mode';

// Base skeleton component
const SkeletonBox: React.FC<{
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
}> = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  const bgColor = useColorModeValue('gray.200', 'gray.700');
  
  return (
    <Box
      width={width}
      height={height}
      bg={bgColor}
      borderRadius={borderRadius}
      className={`skeleton-pulse ${className}`}
      position="relative"
      overflow="hidden"
      _before={{
        content: '""',
        position: 'absolute',
        top: 0,
        left: '-100%',
        width: '100%',
        height: '100%',
        background: `linear-gradient(90deg, transparent, ${useColorModeValue('rgba(255,255,255,0.6)', 'rgba(255,255,255,0.1)')}, transparent)`,
        animation: 'skeleton-shimmer 1.5s infinite'
      }}
    />
  );
};

// Hotel card skeleton
export const HotelCardSkeleton: React.FC = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="md"
    >
      {/* Image skeleton */}
      <SkeletonBox height="200px" borderRadius="0" />
      
      <Stack p={4} gap={3}>
        {/* Hotel name */}
        <SkeletonBox height="24px" width="70%" />
        
        {/* Location */}
        <SkeletonBox height="16px" width="50%" />
        
        {/* Rating and price row */}
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <SkeletonBox height="16px" width="80px" />
            <SkeletonBox height="16px" width="60px" />
          </HStack>
          <SkeletonBox height="20px" width="80px" />
        </HStack>
        
        {/* Amenities */}
        <HStack gap={2} wrap="wrap">
          <SkeletonBox height="20px" width="60px" borderRadius="full" />
          <SkeletonBox height="20px" width="45px" borderRadius="full" />
          <SkeletonBox height="20px" width="70px" borderRadius="full" />
          <SkeletonBox height="20px" width="55px" borderRadius="full" />
        </HStack>
        
        {/* Button */}
        <SkeletonBox height="40px" width="100%" borderRadius="md" />
      </Stack>
    </Box>
  );
};

// Hotel list skeleton
export const HotelListSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <Box w="100%">
      <Stack gap={4} mb={6}>
        {/* Results header skeleton */}
        <HStack justify="space-between" align="center">
          <SkeletonBox height="24px" width="200px" />
          <SkeletonBox height="20px" width="100px" />
        </HStack>
      </Stack>
      
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)"
        }}
        gap={6}
      >
        {Array.from({ length: count }).map((_, index) => (
          <GridItem key={index}>
            <HotelCardSkeleton />
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
};

// Hotel details skeleton
export const HotelDetailsSkeleton: React.FC = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box
      border="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      boxShadow="lg"
    >
      <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={0}>
        {/* Image gallery skeleton */}
        <GridItem>
          <SkeletonBox height="400px" borderRadius="0" />
        </GridItem>
        
        {/* Details skeleton */}
        <GridItem>
          <Stack p={6} gap={4} h="100%">
            {/* Header */}
            <Stack gap={2}>
              <SkeletonBox height="32px" width="80%" />
              <SkeletonBox height="18px" width="60%" />
              <HStack gap={2} align="center">
                <SkeletonBox height="20px" width="100px" />
                <SkeletonBox height="16px" width="80px" />
              </HStack>
            </Stack>
            
            {/* Description */}
            <Stack gap={2}>
              <SkeletonBox height="16px" width="100%" />
              <SkeletonBox height="16px" width="95%" />
              <SkeletonBox height="16px" width="87%" />
            </Stack>
            
            {/* Amenities */}
            <Box>
              <Box mb={3}>
                <SkeletonBox height="20px" width="80px" />
              </Box>
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <SkeletonBox key={index} height="16px" width="90%" />
                ))}
              </Grid>
            </Box>
            
            {/* Pricing */}
            <Stack gap={2} mt="auto">
              <SkeletonBox height="16px" width="60%" />
              <SkeletonBox height="32px" width="40%" />
              <SkeletonBox height="48px" width="100%" borderRadius="md" />
            </Stack>
          </Stack>
        </GridItem>
      </Grid>
    </Box>
  );
};

// Room selection skeleton
export const RoomSelectionSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const bgColor = useColorModeValue('white', 'gray.800');

  return (
    <Box w="100%">
      {/* Header */}
      <Stack gap={2} mb={6}>
        <SkeletonBox height="28px" width="200px" />
        <SkeletonBox height="16px" width="300px" />
      </Stack>
      
      <Stack gap={4}>
        {Array.from({ length: count }).map((_, index) => (
          <Box
            key={index}
            border="1px"
            borderColor={borderColor}
            borderRadius="lg"
            bg={bgColor}
            p={4}
          >
            <Grid templateColumns={{ base: "1fr", md: "200px 1fr auto" }} gap={4} alignItems="center">
              {/* Room image */}
              <GridItem>
                <SkeletonBox height="120px" width="100%" borderRadius="md" />
              </GridItem>
              
              {/* Room details */}
              <GridItem>
                <Stack gap={2}>
                  <SkeletonBox height="20px" width="70%" />
                  <SkeletonBox height="14px" width="90%" />
                  <SkeletonBox height="14px" width="60%" />
                  <HStack gap={2} mt={2}>
                    <SkeletonBox height="16px" width="50px" />
                    <SkeletonBox height="16px" width="70px" />
                  </HStack>
                </Stack>
              </GridItem>
              
              {/* Price and button */}
              <GridItem>
                <VStack align="center" gap={3}>
                  <Stack align="center" gap={1}>
                    <SkeletonBox height="24px" width="80px" />
                    <SkeletonBox height="14px" width="60px" />
                  </Stack>
                  <SkeletonBox height="40px" width="120px" borderRadius="md" />
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

// Search results skeleton
export const SearchResultsSkeleton: React.FC = () => {
  return (
    <VStack gap={8} w="100%">
      {/* Search summary skeleton */}
      <Box
        w="100%"
        maxW="800px"
        textAlign="center"
        py={6}
      >
        <Box mb={2} display="flex" justifyContent="center">
          <SkeletonBox height="24px" width="300px" />
        </Box>
        <Box display="flex" justifyContent="center">
          <SkeletonBox height="16px" width="200px" />
        </Box>
      </Box>
      
      <HotelListSkeleton count={6} />
    </VStack>
  );
}; 