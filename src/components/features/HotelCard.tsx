import React, { useState } from 'react';
import { 
  Box, 
  Image, 
  Text, 
  Heading, 
  VStack, 
  HStack, 
  Badge,
  Button,
  Flex,
  Icon,
  Tooltip
} from '@chakra-ui/react';
import { FiStar, FiMapPin, FiCamera, FiEye, FiPlus, FiCheck } from 'react-icons/fi';
import { Hotel } from '../../types';
import { useColorModeValue } from '../ui/color-mode';
import { ImageLightbox } from '../ui/ImageLightbox';
import { useBookingStore } from '../../stores/bookingStore';

interface HotelCardProps {
  hotel: Hotel;
  onSelect: (hotel: Hotel) => void;
}

export const HotelCard: React.FC<HotelCardProps> = ({ hotel, onSelect }) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxInitialIndex, setLightboxInitialIndex] = useState(0);
  const [isImageHovered, setIsImageHovered] = useState(false);
  
  // Get comparison state from store
  const { comparisonHotels, addToComparison, removeFromComparison } = useBookingStore();
  const isInComparison = comparisonHotels.some(h => h.id === hotel.id);
  const canAddToComparison = comparisonHotels.length < 3;
  
  // Debug logging (can be removed once comparison is working)
  // console.log(`🔍 Hotel ${hotel.name} comparison state:`, {
  //   hotelId: hotel.id,
  //   comparisonHotelsLength: comparisonHotels.length,
  //   isInComparison,
  //   canAddToComparison,
  //   buttonDisabled: !isInComparison && !canAddToComparison
  // });
  
  // Color mode values
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const priceColor = useColorModeValue('green.600', 'green.400');
  const ratingBg = useColorModeValue('yellow.400', 'yellow.500');
  
  // Collect all hotel images for the lightbox
  const allImages = [
    ...hotel.images.exterior,
    ...hotel.images.lobby,
    ...hotel.images.rooms
  ];
  
  const totalImages = allImages.length;
  const mainImage = hotel.images.exterior[0] || hotel.images.lobby[0] || hotel.images.rooms[0];
  
  const handleImageClick = (imageIndex: number = 0) => {
    setLightboxInitialIndex(imageIndex);
    setIsLightboxOpen(true);
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInComparison) {
      removeFromComparison(hotel.id);
    } else if (canAddToComparison) {
      addToComparison(hotel);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <>
      <Box
        bg={cardBg}
        border="1px"
        borderColor={borderColor}
        borderRadius="xl"
        overflow="hidden"
        cursor="pointer"
        transition="all 0.3s ease"
        _hover={{
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          borderColor: 'blue.300'
        }}
        className="hotel-card"
        position="relative"
      >
        {/* Image Container */}
        <Box 
          position="relative" 
          overflow="hidden"
          height="200px"
          onClick={(e) => {
            e.stopPropagation();
            handleImageClick(0);
          }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <Image
            src={mainImage}
            alt={hotel.name}
            width="100%"
            height="100%"
            objectFit="cover"
            transform={isImageHovered ? 'scale(1.05)' : 'scale(1)'}
            transition="transform 0.3s ease"
          />
          
          {/* Image overlay with camera icon and count */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0,0,0,0.4)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            opacity={isImageHovered ? 1 : 0}
            transition="all 0.3s ease"
            flexDirection="column"
            gap={2}
          >
            <Icon as={FiCamera} boxSize={8} color="white" />
            <Text color="white" fontSize="sm" fontWeight="bold">
              View {totalImages} Photos
            </Text>
          </Box>
          
          {/* Rating overlay */}
          <Box
            position="absolute"
            top={3}
            right={3}
            bg={ratingBg}
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            display="flex"
            alignItems="center"
            gap={1}
            fontWeight="bold"
            fontSize="sm"
          >
            <Icon as={FiStar} boxSize={3} />
            {hotel.rating}
          </Box>
          
          {/* Photo count badge */}
          <Box
            position="absolute"
            bottom={3}
            right={3}
            bg="rgba(0,0,0,0.7)"
            color="white"
            px={2}
            py={1}
            borderRadius="md"
            display="flex"
            alignItems="center"
            gap={1}
            fontSize="xs"
          >
            <Icon as={FiCamera} boxSize={3} />
            {totalImages}
          </Box>

          {/* Comparison button */}
          <Box
            position="absolute"
            top={3}
            left={3}
            zIndex={10}
          >
            <Button
              size="sm"
              variant="solid"
              colorScheme={isInComparison ? "green" : "blue"}
              onClick={handleComparisonToggle}
              disabled={!isInComparison && !canAddToComparison}
              opacity={0.9}
              _hover={{ opacity: 1 }}
              cursor="pointer"
              pointerEvents="auto"
              title="Compare Hotels"
            >
              <Icon as={isInComparison ? FiCheck : FiPlus} />
            </Button>
          </Box>
        </Box>

        {/* Content */}
        <VStack align="stretch" p={4} gap={3}>
          {/* Header */}
          <VStack align="stretch" gap={2}>
            <Heading 
              size="md" 
              overflow="hidden" 
              textOverflow="ellipsis" 
              whiteSpace="nowrap"
              color={{ base: "gray.800", _dark: "white" }}
            >
              {hotel.name}
            </Heading>
            
            <HStack justify="space-between" align="center">
              <HStack color={textColor} fontSize="sm">
                <Icon as={FiMapPin} />
                <Text overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">{hotel.location}</Text>
              </HStack>
            </HStack>
          </VStack>

          {/* Description */}
          <Text 
            color={textColor} 
            fontSize="sm" 
            lineHeight="1.4"
            display="-webkit-box"
            style={{
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {hotel.description}
          </Text>

          {/* Amenities */}
          <HStack wrap="wrap" gap={1}>
            {hotel.amenities.slice(0, 3).map((amenity) => (
              <Badge 
                key={amenity} 
                size="sm" 
                colorScheme="blue" 
                variant="subtle"
                fontSize="xs"
              >
                {amenity}
              </Badge>
            ))}
            {hotel.amenities.length > 3 && (
              <Badge 
                size="sm" 
                colorScheme="gray" 
                variant="subtle"
                fontSize="xs"
              >
                +{hotel.amenities.length - 3} more
              </Badge>
            )}
          </HStack>

          {/* Price and CTA */}
          <Flex justify="space-between" align="center" pt={2}>
            <VStack align="start" gap={0}>
              <Text fontSize="xl" fontWeight="bold" color={priceColor}>
                {formatPrice(hotel.price)}
              </Text>
              <Text fontSize="xs" color={textColor}>
                per night
              </Text>
            </VStack>
            
            <Button
              colorScheme="blue"
              size="sm"
              px={6}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(hotel);
              }}
              _hover={{
                transform: 'scale(1.05)',
                boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
              }}
              transition="all 0.2s ease"
            >
              <Icon as={FiEye} mr={2} />
              View Details
            </Button>
          </Flex>
        </VStack>
        
        {/* Hover hint */}
        <Box
          position="absolute"
          top={3}
          left={3}
          bg="rgba(0,0,0,0.7)"
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          opacity={0}
          transition="all 0.3s ease"
          className="hover-hint"
        >
          Click image to view gallery
        </Box>
      </Box>
      
      {/* Image Lightbox */}
      <ImageLightbox
        images={allImages}
        initialIndex={lightboxInitialIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        alt={hotel.name}
        category={hotel.name}
      />
    </>
  );
};
