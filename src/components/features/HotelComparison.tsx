import React, { useState } from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Badge,
  Button,
  Image,
  SimpleGrid,
  Icon,
  CloseButton,
  Flex,
  useDisclosure
} from '@chakra-ui/react';
import {
  FiStar,
  FiMapPin,
  FiUsers,
  FiWifi,
  FiCamera,
  FiCheck,
  FiX,
  FiTrendingUp,
  FiDollarSign
} from 'react-icons/fi';
import { Hotel } from '../../types';
import { useColorModeValue } from '../ui/color-mode';
import { ImageLightbox } from '../ui/ImageLightbox';

interface HotelComparisonProps {
  hotels: Hotel[];
  onRemoveHotel: (hotelId: string) => void;
  onSelectHotel: (hotel: Hotel) => void;
  onClose: () => void;
}

export const HotelComparison: React.FC<HotelComparisonProps> = ({
  hotels,
  onRemoveHotel,
  onSelectHotel,
  onClose
}) => {
  const [selectedImageHotel, setSelectedImageHotel] = useState<Hotel | null>(null);
  const [hoveredHotelId, setHoveredHotelId] = useState<string | null>(null);
  const { open: isLightboxOpen, onOpen: openLightbox, onClose: closeLightbox } = useDisclosure();
  
  // Color mode values
  const bg = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const headingColor = useColorModeValue('gray.900', 'white');
  const headerBg = useColorModeValue('blue.50', 'blue.900');
  const headerTextColor = useColorModeValue('gray.800', 'blue.100');
  const priceColor = useColorModeValue('green.600', 'green.400');
  const ratingColor = useColorModeValue('yellow.500', 'yellow.400');
  const tableHeaderBg = useColorModeValue('blue.50', 'gray.700');
  const tableTextColor = useColorModeValue('gray.700', 'gray.200');
  const closeBtnBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(0, 0, 0, 0.7)');
  const closeBtnColor = useColorModeValue('gray.600', 'white');
  const iconBlueColor = useColorModeValue('blue.500', 'blue.400');
  const iconPurpleColor = useColorModeValue('purple.500', 'purple.400');
  const closeHoverBg = useColorModeValue('blue.100', 'blue.800');

  if (hotels.length === 0) {
    return (
      <Box
        bg={bg}
        p={8}
        borderRadius="lg"
        border="1px"
        borderColor={borderColor}
        textAlign="center"
      >
        <Text fontSize="lg" color={textColor}>
          No hotels selected for comparison
        </Text>
        <Text fontSize="sm" color={textColor} mt={2}>
          Add hotels to compare their features, prices, and amenities
        </Text>
        <Button mt={4} onClick={onClose}>
          Close
        </Button>
      </Box>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getCommonAmenities = () => {
    if (hotels.length === 0) return [];
    return hotels[0].amenities.filter(amenity =>
      hotels.every(hotel => hotel.amenities.includes(amenity))
    );
  };

  const getAllAmenities = () => {
    const allAmenities = new Set<string>();
    hotels.forEach(hotel => {
      hotel.amenities.forEach(amenity => allAmenities.add(amenity));
    });
    return Array.from(allAmenities).sort();
  };

  const getBestValue = () => {
    return hotels.reduce((best, hotel) => {
      const score = hotel.rating / (hotel.price / 100); // Rating per $100
      const bestScore = best.rating / (best.price / 100);
      return score > bestScore ? hotel : best;
    });
  };

  const handleImageClick = (hotel: Hotel) => {
    setSelectedImageHotel(hotel);
    openLightbox();
  };

  const commonAmenities = getCommonAmenities();
  const allAmenities = getAllAmenities();
  const bestValue = getBestValue();

  return (
    <Box
      bg={bg}
      borderRadius="xl"
      border="1px"
      borderColor={borderColor}
      overflow="hidden"
      className="fade-in"
    >
      {/* Header */}
      <Box
        bg={headerBg}
        p={4}
        borderBottom="1px"
        borderColor={borderColor}
      >
        <Flex justify="space-between" align="center">
          <VStack align="start" gap={1}>
            <Heading size="lg" color={headerTextColor}>Hotel Comparison</Heading>
            <Text fontSize="sm" color={headerTextColor}>
              Compare {hotels.length} selected hotels side by side
            </Text>
          </VStack>
          <CloseButton 
            onClick={onClose} 
            size="lg"
            color={headerTextColor}
            _hover={{ bg: closeHoverBg }}
          />
        </Flex>
      </Box>

      {/* Comparison Cards */}
      <Box p={6}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: Math.min(hotels.length, 3) }} gap={6}>
          {hotels.map((hotel) => {
            const isBestValue = hotel.id === bestValue.id;
            const isHovered = hoveredHotelId === hotel.id;
            const allHotelImages = [
              ...hotel.images.exterior,
              ...hotel.images.lobby,
              ...hotel.images.rooms
            ];

            return (
              <Box
                key={hotel.id}
                bg={cardBg}
                borderRadius="lg"
                overflow="hidden"
                border="2px"
                borderColor={isBestValue ? 'green.500' : borderColor}
                position="relative"
                className="hotel-comparison-card"
              >
                {/* Best Value Badge */}
                {isBestValue && (
                  <Box
                    position="absolute"
                    top={3}
                    right={3}
                    bg="green.500"
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="xs"
                    fontWeight="bold"
                    zIndex={2}
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FiTrendingUp} />
                    Best Value
                  </Box>
                )}

                {/* Remove Button */}
                <CloseButton
                  position="absolute"
                  top={2}
                  left={2}
                  size="sm"
                  bg={closeBtnBg}
                  color={closeBtnColor}
                  _hover={{ bg: 'red.500', color: 'white' }}
                  onClick={() => onRemoveHotel(hotel.id)}
                  zIndex={2}
                />

                {/* Hotel Image */}
                <Box
                  position="relative"
                  height="150px"
                  cursor="pointer"
                  onClick={() => handleImageClick(hotel)}
                  onMouseEnter={() => setHoveredHotelId(hotel.id)}
                  onMouseLeave={() => setHoveredHotelId(null)}
                >
                  <Image
                    src={hotel.images.exterior[0] || hotel.images.lobby[0]}
                    alt={hotel.name}
                    width="100%"
                    height="100%"
                    objectFit="cover"
                  />
                  
                  {/* Image overlay */}
                  <Box
                    position="absolute"
                    inset={0}
                    bg="rgba(0,0,0,0.5)"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    opacity={isHovered ? 1 : 0}
                    transition="all 0.3s ease"
                  >
                    <Icon as={FiCamera} color="white" boxSize={6} />
                  </Box>

                  {/* Rating overlay */}
                  <Box
                    position="absolute"
                    bottom={2}
                    right={2}
                    bg={ratingColor}
                    color="white"
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    fontWeight="bold"
                    display="flex"
                    alignItems="center"
                    gap={1}
                  >
                    <Icon as={FiStar} boxSize={3} />
                    {hotel.rating}
                  </Box>
                </Box>

                {/* Hotel Info */}
                <VStack align="stretch" p={4} gap={3}>
                  <VStack align="stretch" gap={1}>
                    <Heading size="md" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap" color={headingColor}>
                      {hotel.name}
                    </Heading>
                    <HStack color={textColor} fontSize="sm">
                      <Icon as={FiMapPin} />
                      <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                        {hotel.location}
                      </Text>
                    </HStack>
                  </VStack>

                  {/* Price */}
                  <Box textAlign="center" py={2}>
                    <Text fontSize="2xl" fontWeight="bold" color={priceColor}>
                      {formatPrice(hotel.price)}
                    </Text>
                    <Text fontSize="xs" color={textColor}>
                      per night
                    </Text>
                  </Box>

                  {/* Key Stats */}
                  <SimpleGrid columns={2} gap={2} fontSize="sm" color={tableTextColor}>
                    <HStack>
                      <Icon as={FiStar} color={ratingColor} />
                      <Text>{hotel.rating} Rating</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiUsers} color={iconBlueColor} />
                      <Text>{hotel.roomTypes[0]?.capacity || 2} Guests</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiCamera} color={iconPurpleColor} />
                      <Text>{allHotelImages.length} Photos</Text>
                    </HStack>
                    <HStack>
                      <Icon as={FiDollarSign} color={priceColor} />
                      <Text>{hotel.amenities.length} Amenities</Text>
                    </HStack>
                  </SimpleGrid>

                  {/* Select Button */}
                  <Button
                    colorScheme="blue"
                    size="sm"
                    onClick={() => onSelectHotel(hotel)}
                    _hover={{
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
                    }}
                    transition="all 0.2s ease"
                  >
                    Select This Hotel
                  </Button>
                </VStack>
              </Box>
            );
          })}
        </SimpleGrid>

        {/* Detailed Comparison Table */}
        <Box mt={8}>
          <Heading size="md" mb={4} color={headingColor}>Detailed Comparison</Heading>
          
          {/* Common Amenities */}
          {commonAmenities.length > 0 && (
            <Box mb={6}>
              <Text fontWeight="bold" mb={2} color="green.500">
                ✓ Common Amenities ({commonAmenities.length})
              </Text>
              <HStack wrap="wrap" gap={2}>
                {commonAmenities.map((amenity) => (
                  <Badge key={amenity} colorScheme="green" variant="subtle">
                    {amenity}
                  </Badge>
                ))}
              </HStack>
            </Box>
          )}

          {/* Simplified Comparison Grid */}
          <SimpleGrid columns={{ base: 1, md: hotels.length + 1 }} gap={4}>
            {/* Header row */}
            <Text fontWeight="bold" bg={tableHeaderBg} color={headerTextColor} p={3} borderRadius="md">
              Feature
            </Text>
            {hotels.map((hotel) => (
              <Text key={hotel.id} fontWeight="bold" textAlign="center" bg={tableHeaderBg} color={headerTextColor} p={3} borderRadius="md">
                {hotel.name}
              </Text>
            ))}
            
            {/* Price row */}
            <Text fontWeight="medium" p={2} color={tableTextColor}>Price per night</Text>
            {hotels.map((hotel) => (
              <Text
                key={hotel.id}
                textAlign="center"
                p={2}
                color={hotel.id === bestValue.id ? 'green.500' : priceColor}
                fontWeight={hotel.id === bestValue.id ? 'bold' : 'normal'}
              >
                {formatPrice(hotel.price)}
              </Text>
            ))}

            {/* Rating row */}
            <Text fontWeight="medium" p={2} color={tableTextColor}>Rating</Text>
            {hotels.map((hotel) => (
              <HStack key={hotel.id} justify="center" p={2}>
                <Icon as={FiStar} color={ratingColor} />
                <Text color={tableTextColor}>{hotel.rating}</Text>
              </HStack>
            ))}

            {/* Top amenities */}
            {allAmenities.slice(0, 6).map((amenity) => (
              <React.Fragment key={amenity}>
                <Text fontWeight="medium" p={2} color={tableTextColor}>{amenity}</Text>
                {hotels.map((hotel) => (
                  <Box key={hotel.id} textAlign="center" p={2}>
                    <Icon
                      as={hotel.amenities.includes(amenity) ? FiCheck : FiX}
                      color={hotel.amenities.includes(amenity) ? 'green.500' : 'red.500'}
                      boxSize={4}
                    />
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </SimpleGrid>
        </Box>
      </Box>

      {/* Image Lightbox */}
      {selectedImageHotel && (
        <ImageLightbox
          images={[
            ...selectedImageHotel.images.exterior,
            ...selectedImageHotel.images.lobby,
            ...selectedImageHotel.images.rooms
          ]}
          initialIndex={0}
          isOpen={isLightboxOpen}
          onClose={closeLightbox}
          alt={selectedImageHotel.name}
          category={selectedImageHotel.name}
        />
      )}
    </Box>
  );
}; 