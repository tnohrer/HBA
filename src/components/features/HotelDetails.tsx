import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Text, 
  Heading, 
  Image, 
  SimpleGrid, 
  Stack, 
  HStack, 
  Flex,
  Badge
} from '@chakra-ui/react';
import { Hotel } from '../../types';
import { formatPrice } from '../../utils';

interface HotelDetailsProps {
  hotel: Hotel;
  onBookNow: () => void;
}

export const HotelDetails: React.FC<HotelDetailsProps> = ({ hotel, onBookNow }) => {
  const [activeImageCategory, setActiveImageCategory] = useState<'lobby' | 'exterior' | 'rooms'>('exterior');
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = hotel.images[activeImageCategory];
  const currentImage = images[activeImageIndex];

  return (
    <Stack gap={6} w="100%">
      {/* Image Gallery Section */}
      <Box w="100%">
        <Box borderRadius="lg" overflow="hidden" mb={4}>
          <Image 
            src={currentImage} 
            alt={`${hotel.name} ${activeImageCategory}`}
            w="100%"
            h={{ base: "250px", md: "400px" }}
            objectFit="cover"
          />
        </Box>
        
        {/* Thumbnail Images */}
        <HStack 
          gap={2} 
          overflowX="auto" 
          pb={2}
          css={{
            '&::-webkit-scrollbar': { height: '4px' },
            '&::-webkit-scrollbar-track': { background: '#f1f1f1' },
            '&::-webkit-scrollbar-thumb': { background: '#888', borderRadius: '4px' }
          }}
        >
          {images.map((image, index) => (
            <Box
              key={index}
              borderRadius="md"
              overflow="hidden"
              cursor="pointer"
              opacity={index === activeImageIndex ? 1 : 0.7}
              border={index === activeImageIndex ? "2px solid" : "none"}
              borderColor="blue.500"
              transition="opacity 0.2s"
              onClick={() => setActiveImageIndex(index)}
              minW="80px"
              h="80px"
            >
              <Image 
                src={image} 
                alt={`${hotel.name} ${index + 1}`}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            </Box>
          ))}
        </HStack>

        {/* Category Buttons */}
        <HStack gap={3} mt={4} wrap="wrap">
          {(['exterior', 'lobby', 'rooms'] as const).map((category) => (
            <Button
              key={category}
              variant={activeImageCategory === category ? 'solid' : 'outline'}
              colorScheme="blue"
              size="sm"
              onClick={() => {
                setActiveImageCategory(category);
                setActiveImageIndex(0);
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </HStack>
      </Box>

      {/* Hotel Information Section */}
      <Stack gap={4} w="100%">
        {/* Header */}
        <Box>
          <Heading size="lg" color={{ base: "gray.800", _dark: "white" }} mb={2}>
            {hotel.name}
          </Heading>
          <Text color={{ base: "gray.600", _dark: "gray.400" }} mb={2}>
            {hotel.location}
          </Text>
          <HStack gap={1}>
            {[...Array(5)].map((_, index) => (
              <Text 
                key={index} 
                color={index < hotel.rating ? "yellow.400" : "gray.300"}
                fontSize="lg"
              >
                ★
              </Text>
            ))}
          </HStack>
        </Box>

        {/* Description */}
        <Box>
          <Heading size="md" mb={2} color={{ base: "gray.800", _dark: "white" }}>
            About this hotel
          </Heading>
          <Text color={{ base: "gray.700", _dark: "gray.300" }} lineHeight="1.6">
            {hotel.description}
          </Text>
        </Box>

        {/* Amenities */}
        <Box>
          <Heading size="md" mb={3} color={{ base: "gray.800", _dark: "white" }}>
            Amenities
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3 }} gap={2}>
            {hotel.amenities.map((amenity) => (
              <Badge 
                key={amenity} 
                variant="subtle"
                colorScheme="blue"
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="md"
              >
                • {amenity}
              </Badge>
            ))}
          </SimpleGrid>
        </Box>

        {/* Pricing */}
        <Flex 
          justify="space-between" 
          align={{ base: "flex-start", md: "center" }}
          direction={{ base: "column", md: "row" }}
          gap={4}
          p={4}
          bg={{ base: "gray.50", _dark: "gray.800" }}
          borderRadius="lg"
        >
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color={{ base: "gray.800", _dark: "white" }}>
              From {formatPrice(hotel.price)}
            </Text>
            <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }}>
              per night
            </Text>
          </Box>
          <Button 
            colorScheme="blue" 
            size="lg"
            onClick={onBookNow}
            w={{ base: "100%", md: "auto" }}
            px={8}
            minW="140px"
          >
            Book Now
          </Button>
        </Flex>
      </Stack>
    </Stack>
  );
};
