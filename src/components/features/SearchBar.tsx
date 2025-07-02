import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Stack,
  Flex,
  Text,
  HStack,
  IconButton
} from '@chakra-ui/react';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { SearchParams } from '../../types';
import { useColorModeValue } from '../ui/color-mode';

interface SearchBarProps {
  onSearch: (params: SearchParams) => void;
  onReset?: () => void;
  hasSearched?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset, hasSearched = false }) => {
  // Get today's date and tomorrow's date for defaults and validation
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const maxDate = new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 2 years from now

  // Basic search state with smart defaults
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: tomorrow, // Default to tomorrow for better UX
    checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Day after tomorrow
    guests: 1
  });

  // Validation state
  const [dateErrors, setDateErrors] = useState({
    checkIn: '',
    checkOut: ''
  });

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');  
  const textColor = useColorModeValue('gray.700', 'gray.300');
  const errorColor = useColorModeValue('red.500', 'red.400');

  // Validate dates
  const validateDates = (checkIn: string, checkOut: string) => {
    const errors = { checkIn: '', checkOut: '' };
    
    if (checkIn && checkIn < today) {
      errors.checkIn = 'Check-in date cannot be in the past';
    }
    
    if (checkOut && checkOut < today) {
      errors.checkOut = 'Check-out date cannot be in the past';
    }
    
    if (checkIn && checkOut && checkOut <= checkIn) {
      errors.checkOut = 'Check-out must be at least 1 day after check-in';
    }
    
    setDateErrors(errors);
    return Object.values(errors).every(error => !error);
  };

  // Handle check-in date change
  const handleCheckInChange = (checkIn: string) => {
    const newParams = { ...searchParams, checkIn };
    
    // Auto-adjust check-out if it's not valid
    if (checkIn && (!searchParams.checkOut || searchParams.checkOut <= checkIn)) {
      const nextDay = new Date(checkIn);
      nextDay.setDate(nextDay.getDate() + 1);
      newParams.checkOut = nextDay.toISOString().split('T')[0];
    }
    
    setSearchParams(newParams);
    validateDates(newParams.checkIn, newParams.checkOut);
  };

  // Handle check-out date change
  const handleCheckOutChange = (checkOut: string) => {
    const newParams = { ...searchParams, checkOut };
    setSearchParams(newParams);
    validateDates(newParams.checkIn, newParams.checkOut);
  };

  // Validate dates whenever they change
  useEffect(() => {
    validateDates(searchParams.checkIn, searchParams.checkOut);
  }, [searchParams.checkIn, searchParams.checkOut, today]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final validation before submission
    if (!validateDates(searchParams.checkIn, searchParams.checkOut)) {
      return;
    }
    
    const fullParams: SearchParams = {
      ...searchParams,
      filters: {}
    };
    onSearch(fullParams);
  };

  // Handle reset
  const handleReset = () => {
    setSearchParams({
      location: '',
      checkIn: tomorrow,
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      guests: 1,
    });
    setDateErrors({ checkIn: '', checkOut: '' });
    if (onReset) {
      onReset();
    }
  };

  // Handle guest counter
  const incrementGuests = () => {
    if (searchParams.guests < 10) {
      setSearchParams({ ...searchParams, guests: searchParams.guests + 1 });
    }
  };

  const decrementGuests = () => {
    if (searchParams.guests > 1) {
      setSearchParams({ ...searchParams, guests: searchParams.guests - 1 });
    }
  };

  // Check if form is valid
  const isFormValid = !dateErrors.checkIn && !dateErrors.checkOut && searchParams.location.trim() && searchParams.checkIn && searchParams.checkOut;

  return (
    <Box>
      {/* Main Search Form */}
      <Box 
        as="form" 
        onSubmit={handleSubmit} 
        p={6} 
        bg={bgColor}
        borderRadius="lg" 
        boxShadow={{ base: "md", _dark: "dark-lg" }}
        border="1px"
        borderColor={borderColor}
      >
        <Stack gap={4} align="center">
          {/* Basic Search Fields */}
          <Flex gap={4} wrap="wrap" justify="center" w="100%">
            {/* Location */}
            <Box minW="200px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
                Destination
              </Text>
              <Input
                type="text"
                placeholder="Where are you going?"
                value={searchParams.location}
                onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                required
                pl={4}
                bg={{ base: "white", _dark: "gray.700" }}
                borderColor={{ base: "gray.300", _dark: "gray.600" }}
                color={{ base: "gray.900", _dark: "white" }}
                _placeholder={{ color: { base: "gray.500", _dark: "gray.400" } }}
                _focus={{ 
                  borderColor: { base: "blue.500", _dark: "blue.300" },
                  boxShadow: { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                }}
              />
            </Box>

            {/* Check-In */}
            <Box minW="150px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
                Check-In
              </Text>
              <Input
                type="date"
                value={searchParams.checkIn}
                onChange={(e) => handleCheckInChange(e.target.value)}
                min={today}
                max={maxDate}
                required
                pl={4}
                bg={{ base: "white", _dark: "gray.700" }}
                borderColor={dateErrors.checkIn ? errorColor : { base: "gray.300", _dark: "gray.600" }}
                color={{ base: "gray.900", _dark: "white" }}
                _focus={{ 
                  borderColor: dateErrors.checkIn ? errorColor : { base: "blue.500", _dark: "blue.300" },
                  boxShadow: dateErrors.checkIn ? `0 0 0 1px ${errorColor}` : { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                }}
              />
              {dateErrors.checkIn && (
                <Text fontSize="xs" color={errorColor} mt={1}>
                  {dateErrors.checkIn}
                </Text>
              )}
            </Box>

            {/* Check-Out */}
            <Box minW="150px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
                Check-Out
              </Text>
              <Input
                type="date"
                value={searchParams.checkOut}
                onChange={(e) => handleCheckOutChange(e.target.value)}
                min={searchParams.checkIn ? new Date(new Date(searchParams.checkIn).getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] : today}
                max={maxDate}
                required
                pl={4}
                bg={{ base: "white", _dark: "gray.700" }}
                borderColor={dateErrors.checkOut ? errorColor : { base: "gray.300", _dark: "gray.600" }}
                color={{ base: "gray.900", _dark: "white" }}
                _focus={{ 
                  borderColor: dateErrors.checkOut ? errorColor : { base: "blue.500", _dark: "blue.300" },
                  boxShadow: dateErrors.checkOut ? `0 0 0 1px ${errorColor}` : { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                }}
              />
              {dateErrors.checkOut && (
                <Text fontSize="xs" color={errorColor} mt={1}>
                  {dateErrors.checkOut}
                </Text>
              )}
            </Box>

            {/* Guests */}
            <Box minW="150px">
              <Text fontSize="sm" fontWeight="medium" mb={2} color={textColor}>
                Number of Guests
              </Text>
              <HStack gap={0} bg={{ base: "white", _dark: "gray.700" }} borderRadius="md" border="1px" borderColor={{ base: "gray.300", _dark: "gray.600" }}>
                <IconButton
                  aria-label="Decrease guests"
                  size="sm"
                  variant="ghost"
                  onClick={decrementGuests}
                  disabled={searchParams.guests <= 1}
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  _hover={{ bg: { base: "gray.100", _dark: "gray.600" } }}
                  _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                  borderRadius="md"
                >
                  <FiMinus />
                </IconButton>
                <Input
                  type="number"
                  min={1}
                  max={10}
                  value={searchParams.guests}
                  onChange={(e) => setSearchParams({ ...searchParams, guests: parseInt(e.target.value) || 1 })}
                  required
                  textAlign="center"
                  border="none"
                  outline="none"
                  _focus={{ boxShadow: "none" }}
                  bg="transparent"
                  color={{ base: "gray.900", _dark: "white" }}
                  flex="1"
                />
                <IconButton
                  aria-label="Increase guests"
                  size="sm"
                  variant="ghost"
                  onClick={incrementGuests}
                  disabled={searchParams.guests >= 10}
                  color={{ base: "gray.600", _dark: "gray.400" }}
                  _hover={{ bg: { base: "gray.100", _dark: "gray.600" } }}
                  _disabled={{ opacity: 0.4, cursor: "not-allowed" }}
                  borderRadius="md"
                >
                  <FiPlus />
                </IconButton>
              </HStack>
            </Box>
          </Flex>

          {/* Search Actions */}
          <HStack gap={3} pt={2}>
            <Button 
              type="submit" 
              colorScheme="blue" 
              size="lg"
              px={8}
              disabled={!isFormValid}
              _hover={{
                transform: isFormValid ? "translateY(-2px)" : "none",
                boxShadow: isFormValid ? "0 4px 12px rgba(66, 153, 225, 0.3)" : "none"
              }}
              transition="all 0.2s ease"
            >
              🔍 Search Hotels
            </Button>
            
            {hasSearched && (
              <Button 
                onClick={handleReset}
                variant="outline" 
                size="lg"
                px={6}
                _hover={{
                  bg: { base: "gray.50", _dark: "gray.700" }
                }}
                transition="all 0.2s ease"
              >
                Reset
              </Button>
            )}
          </HStack>
        </Stack>
      </Box>
    </Box>
  );
};
