import React, { useState } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Input,
  Badge
} from '@chakra-ui/react';
import { 
  FiFilter, 
  FiX, 
  FiChevronDown, 
  FiChevronUp,
  FiDollarSign,
  FiStar,
  FiWifi,
  FiRefreshCw
} from 'react-icons/fi';
import { SearchFilters, COMMON_AMENITIES, SortOption } from '../../types';
import { useColorModeValue } from '../ui/color-mode';

interface SearchResultsFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onSortChange: (sort: SortOption) => void;
  sortOption: SortOption;
  resultCount: number;
  isVisible: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity-desc', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
  { value: 'name-asc', label: 'Name: A to Z' }
];

export const SearchResultsFilters: React.FC<SearchResultsFiltersProps> = ({
  filters,
  onFiltersChange,
  onSortChange,
  sortOption,
  resultCount,
  isVisible
}) => {
  // Expanded states for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    rating: true,
    amenities: true,
    sort: true
  });

  // Price range state
  const [priceRange, setPriceRange] = useState<[number, number]>(filters.priceRange || [0, 1000]);

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const headingColor = useColorModeValue('gray.900', 'white');
  const mutedTextColor = useColorModeValue('gray.500', 'gray.400');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Update price range
  const updatePriceRange = (newRange: [number, number]) => {
    setPriceRange(newRange);
    onFiltersChange({
      ...filters,
      priceRange: newRange
    });
  };

  // Update rating filter
  const updateRating = (rating: number) => {
    onFiltersChange({
      ...filters,
      rating: filters.rating === rating ? undefined : rating
    });
  };

  // Update amenities filter
  const updateAmenities = (amenityId: string) => {
    const currentAmenities = filters.amenities || [];
    const newAmenities = currentAmenities.includes(amenityId)
      ? currentAmenities.filter(id => id !== amenityId)
      : [...currentAmenities, amenityId];
    
    onFiltersChange({
      ...filters,
      amenities: newAmenities
    });
  };

  // Clear all filters
  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    onFiltersChange({
      priceRange: undefined,
      amenities: [],
      rating: undefined
    });
  };

  // Clear individual filter
  const clearFilter = (filterType: keyof SearchFilters) => {
    const newFilters = { ...filters };
    if (filterType === 'priceRange') {
      setPriceRange([0, 1000]);
      newFilters.priceRange = undefined;
    } else if (filterType === 'rating') {
      newFilters.rating = undefined;
    } else if (filterType === 'amenities') {
      newFilters.amenities = [];
    }
    onFiltersChange(newFilters);
  };

  // Count active filters
  const activeFilterCount = [
    filters.priceRange && (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000),
    filters.rating !== undefined,
    filters.amenities && filters.amenities.length > 0
  ].filter(Boolean).length;

  if (!isVisible) return null;

  return (
    <Box
      w={{ base: "100%", md: "320px" }}
      bg={{ base: "transparent", md: bgColor }}
      border={{ base: "none", md: "1px" }}
      borderColor={borderColor}
      borderRadius={{ base: "none", md: "lg" }}
      p={{ base: 0, md: 4 }}
      h="fit-content"
      position={{ base: "static", md: "sticky" }}
      top="20px"
      alignSelf="flex-start"
    >
      {/* Header */}
      <HStack justify="space-between" mb={4}>
        <HStack gap={2}>
          <FiFilter />
          <Text fontSize="lg" fontWeight="bold" color={headingColor}>
            Filters
          </Text>
          {activeFilterCount > 0 && (
            <Badge colorScheme="blue" borderRadius="full">
              {activeFilterCount}
            </Badge>
          )}
        </HStack>
        {activeFilterCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearAllFilters}
            color={mutedTextColor}
            _hover={{ color: textColor, bg: hoverBgColor }}
          >
            <HStack gap={1}>
              <FiRefreshCw />
              <Text>Clear All</Text>
            </HStack>
          </Button>
        )}
      </HStack>

      <VStack align="stretch" gap={4}>
        {/* Results Count */}
        <Box px={3} py={2} bg={hoverBgColor} borderRadius="md">
          <Text fontSize="sm" color={mutedTextColor} textAlign="center">
            {resultCount} hotels found
          </Text>
        </Box>

        {/* Sort Section */}
        <Box>
          <HStack 
            justify="space-between" 
            cursor="pointer" 
            onClick={() => toggleSection('sort')}
            mb={2}
          >
            <Text fontSize="md" fontWeight="semibold" color={headingColor}>
              Sort By
            </Text>
            {expandedSections.sort ? <FiChevronUp /> : <FiChevronDown />}
          </HStack>
          
          {expandedSections.sort && (
            <VStack align="stretch" gap={1}>
              {sortOptions.map((option) => (
                <Button
                  key={option.value}
                  size="sm"
                  variant={sortOption === option.value ? "solid" : "ghost"}
                  colorScheme={sortOption === option.value ? "blue" : "gray"}
                  justifyContent="flex-start"
                  onClick={() => onSortChange(option.value)}
                  _hover={{ bg: sortOption === option.value ? undefined : hoverBgColor }}
                >
                  {option.label}
                </Button>
              ))}
            </VStack>
          )}
        </Box>

        {/* Custom Divider */}
        <Box h="1px" bg={borderColor} />

        {/* Price Range Section */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <HStack 
              cursor="pointer" 
              onClick={() => toggleSection('price')}
              flex="1"
              gap={2}
            >
              <FiDollarSign />
              <Text fontSize="md" fontWeight="semibold" color={headingColor}>
                Price Range
              </Text>
              {expandedSections.price ? <FiChevronUp /> : <FiChevronDown />}
            </HStack>
            {filters.priceRange && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('priceRange')}
                color={mutedTextColor}
                _hover={{ color: textColor }}
              >
                <FiX />
              </Button>
            )}
          </HStack>

          {expandedSections.price && (
            <VStack align="stretch" gap={3}>
              <HStack gap={2}>
                <Input
                  type="number"
                  placeholder="Min"
                  value={priceRange[0]}
                  onChange={(e) => updatePriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                  size="sm"
                  bg={{ base: "white", _dark: "gray.700" }}
                  borderColor={{ base: "gray.300", _dark: "gray.600" }}
                  color={{ base: "gray.900", _dark: "white" }}
                  _placeholder={{ color: { base: "gray.500", _dark: "gray.400" } }}
                  _focus={{ 
                    borderColor: { base: "blue.500", _dark: "blue.300" },
                    boxShadow: { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                  }}
                />
                <Text color={mutedTextColor}>to</Text>
                <Input
                  type="number"
                  placeholder="Max"
                  value={priceRange[1]}
                  onChange={(e) => updatePriceRange([priceRange[0], parseInt(e.target.value) || 1000])}
                  size="sm"
                  bg={{ base: "white", _dark: "gray.700" }}
                  borderColor={{ base: "gray.300", _dark: "gray.600" }}
                  color={{ base: "gray.900", _dark: "white" }}
                  _placeholder={{ color: { base: "gray.500", _dark: "gray.400" } }}
                  _focus={{ 
                    borderColor: { base: "blue.500", _dark: "blue.300" },
                    boxShadow: { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                  }}
                />
              </HStack>
              <Text fontSize="xs" color={mutedTextColor} textAlign="center">
                ${priceRange[0]} - ${priceRange[1]} per night
              </Text>
              <HStack justify="space-around" gap={1}>
                <Button size="xs" variant="outline" onClick={() => updatePriceRange([0, 150])}>
                  Under $150
                </Button>
                <Button size="xs" variant="outline" onClick={() => updatePriceRange([150, 300])}>
                  $150-$300
                </Button>
                <Button size="xs" variant="outline" onClick={() => updatePriceRange([300, 1000])}>
                  $300+
                </Button>
              </HStack>
            </VStack>
          )}
        </Box>

        {/* Custom Divider */}
        <Box h="1px" bg={borderColor} />

        {/* Rating Section */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <HStack 
              cursor="pointer" 
              onClick={() => toggleSection('rating')}
              flex="1"
              gap={2}
            >
              <FiStar />
              <Text fontSize="md" fontWeight="semibold" color={headingColor}>
                Star Rating
              </Text>
              {expandedSections.rating ? <FiChevronUp /> : <FiChevronDown />}
            </HStack>
            {filters.rating !== undefined && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => clearFilter('rating')}
                color={mutedTextColor}
                _hover={{ color: textColor }}
              >
                <FiX />
              </Button>
            )}
          </HStack>

          {expandedSections.rating && (
            <VStack align="stretch" gap={2}>
              {[5, 4, 3, 2].map((rating) => (
                <Button
                  key={rating}
                  size="sm"
                  variant={filters.rating === rating ? "solid" : "ghost"}
                  colorScheme={filters.rating === rating ? "blue" : "gray"}
                  justifyContent="flex-start"
                  onClick={() => updateRating(rating)}
                  _hover={{ bg: filters.rating === rating ? undefined : hoverBgColor }}
                >
                  <HStack gap={2}>
                    <Text>{rating}+ Stars</Text>
                    <HStack gap={0}>
                      {Array.from({ length: rating }).map((_, i) => (
                        <Text key={i} color="yellow.400">★</Text>
                      ))}
                    </HStack>
                  </HStack>
                </Button>
              ))}
            </VStack>
          )}
        </Box>

        {/* Custom Divider */}
        <Box h="1px" bg={borderColor} />

        {/* Amenities Section */}
        <Box>
          <HStack justify="space-between" mb={2}>
            <HStack 
              cursor="pointer" 
              onClick={() => toggleSection('amenities')}
              flex="1"
              gap={2}
            >
              <FiWifi />
              <Text fontSize="md" fontWeight="semibold" color={headingColor}>
                Amenities
              </Text>
              {expandedSections.amenities ? <FiChevronUp /> : <FiChevronDown />}
            </HStack>
            {filters.amenities && filters.amenities.length > 0 && (
              <HStack gap={1}>
                <Badge colorScheme="blue" borderRadius="full" size="sm">
                  {filters.amenities.length}
                </Badge>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => clearFilter('amenities')}
                  color={mutedTextColor}
                  _hover={{ color: textColor }}
                >
                  <FiX />
                </Button>
              </HStack>
            )}
          </HStack>

          {expandedSections.amenities && (
            <VStack align="stretch" gap={2} maxH="200px" overflowY="auto">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = (filters.amenities || []).includes(amenity.id);
                return (
                  <Button
                    key={amenity.id}
                    size="sm"
                    variant={isSelected ? "solid" : "ghost"}
                    colorScheme={isSelected ? "blue" : "gray"}
                    justifyContent="flex-start"
                    onClick={() => updateAmenities(amenity.id)}
                    _hover={{ bg: isSelected ? undefined : hoverBgColor }}
                  >
                    <Text fontSize="sm" color={isSelected ? "white" : textColor}>
                      {amenity.label}
                    </Text>
                  </Button>
                );
              })}
            </VStack>
          )}
        </Box>
      </VStack>
    </Box>
  );
}; 