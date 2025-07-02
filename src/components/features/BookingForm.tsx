import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  Textarea,
  Text,
  Flex,
  Stack,
  HStack,
} from '@chakra-ui/react';
import { Booking, Hotel, RoomType } from '../../types';
import { useBookingStore } from '../../stores/bookingStore';
import { HotelService } from '../../services/hotelService';
import { EmailService, BookingEmailData } from '../../services/emailService';
import { 
  formatPrice, 
  formatPhoneNumber, 
  validatePhoneNumber, 
  validateEmail, 
  sanitizeEmail,
  formatDate,
  calculateNights
} from '../../utils';

interface BookingFormProps {
  hotel: Hotel;
  selectedRoom: RoomType;
  onSubmit: (booking: Partial<Booking>) => void;
  onChangeDates?: () => void;
}

interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests?: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  hotel,
  selectedRoom,
  onSubmit,
  onChangeDates,
}) => {
  const {
    searchParams,
    currentReservation,
    reservationTimeRemaining,
    setCurrentReservation,
    setReservationTimeRemaining,
    clearReservation,
  } = useBookingStore();

  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const [isCreatingReservation, setIsCreatingReservation] = useState(false);
  const [isCompletingBooking, setIsCompletingBooking] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Get dates and guests from search parameters
  const dates = {
    checkIn: searchParams?.checkIn || '',
    checkOut: searchParams?.checkOut || '',
  };
  const guests = searchParams?.guests || 1;

  // Countdown timer effect
  useEffect(() => {
    if (!currentReservation) return;

    const interval = setInterval(() => {
      const remaining = HotelService.getRemainingReservationTime(currentReservation.id);
      setReservationTimeRemaining(remaining);

      if (remaining <= 0) {
        clearReservation();
        setError('Your reservation has expired. Please reserve the room again.');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentReservation, setReservationTimeRemaining, clearReservation]);

  const calculateTotalPrice = () => {
    if (!dates.checkIn || !dates.checkOut) return selectedRoom.price;
    const nights = calculateNights(dates.checkIn, dates.checkOut);
    return selectedRoom.price * nights;
  };

  const validateForm = (): boolean => {
    const errors: ValidationErrors = {};

    if (!guestInfo.firstName.trim()) {
      errors.firstName = 'First name is required';
    }

    if (!guestInfo.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }

    if (!guestInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(guestInfo.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!guestInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!validatePhoneNumber(guestInfo.phone)) {
      errors.phone = 'Please enter a valid 10-digit phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePhoneChange = (value: string) => {
    const formatted = formatPhoneNumber(value);
    setGuestInfo({ ...guestInfo, phone: formatted });
    
    // Clear phone validation error when user starts typing
    if (validationErrors.phone) {
      setValidationErrors({ ...validationErrors, phone: undefined });
    }
  };

  const handleEmailChange = (value: string) => {
    const sanitized = sanitizeEmail(value);
    setGuestInfo({ ...guestInfo, email: sanitized });
    
    // Clear email validation error when user starts typing
    if (validationErrors.email) {
      setValidationErrors({ ...validationErrors, email: undefined });
    }
  };

  const handleReserveRoom = async () => {
    if (!dates.checkIn || !dates.checkOut) {
      setError('Missing check-in or check-out dates. Please search again.');
      return;
    }

    if (!validateForm()) {
      setError('Please correct the highlighted fields');
      return;
    }

    setIsCreatingReservation(true);
    setError(null);

    try {
      const reservation = await HotelService.createReservation(
        hotel.id,
        selectedRoom.id,
        dates.checkIn,
        dates.checkOut,
        guests,
        calculateTotalPrice()
      );

      setCurrentReservation(reservation);
      const remaining = HotelService.getRemainingReservationTime(reservation.id);
      setReservationTimeRemaining(remaining);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reserve room');
    } finally {
      setIsCreatingReservation(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!currentReservation) return;

    setIsCompletingBooking(true);
    setError(null);

    const booking: Partial<Booking> = {
      hotelId: hotel.id,
      roomTypeId: selectedRoom.id,
      checkIn: dates.checkIn,
      checkOut: dates.checkOut,
      guests,
      totalPrice: calculateTotalPrice(),
      status: 'confirmed',
      reservationId: currentReservation.id,
    };

    try {
      // Complete the booking first
      const confirmedBooking = await onSubmit(booking);
      
      // Send confirmation email
      setIsSendingEmail(true);
      const emailData: BookingEmailData = {
        booking: booking as Booking,
        hotel,
        room: selectedRoom,
        guestName: `${guestInfo.firstName} ${guestInfo.lastName}`,
        guestEmail: guestInfo.email,
        guestPhone: guestInfo.phone,
        specialRequests: guestInfo.specialRequests,
      };

      const emailSent = await EmailService.sendBookingConfirmation(emailData);
      
      if (!emailSent) {
        setError('Booking confirmed but failed to send confirmation email. Please check your email or contact support.');
      }

      setBookingComplete(true);
      clearReservation();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete booking');
    } finally {
      setIsCompletingBooking(false);
      setIsSendingEmail(false);
    }
  };

  const handleExtendReservation = async () => {
    if (!currentReservation) return;

    try {
      const extended = await HotelService.extendReservation(currentReservation.id);
      setCurrentReservation(extended);
      const remaining = HotelService.getRemainingReservationTime(extended.id);
      setReservationTimeRemaining(remaining);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to extend reservation');
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = currentReservation 
    ? (reservationTimeRemaining / (10 * 60)) * 100 
    : 0;

  // If booking is complete, show success message
  if (bookingComplete) {
    return (
      <Box
        bg={{ base: "green.50", _dark: "green.900" }}
        borderWidth="1px"
        borderColor={{ base: "green.200", _dark: "green.700" }}
        borderRadius="lg"
        p={8}
        textAlign="center"
        boxShadow={{ base: "md", _dark: "dark-lg" }}
      >
        <Text fontSize="3xl" mb={4}>🎉</Text>
        <Text fontSize="xl" fontWeight="bold" color={{ base: "green.800", _dark: "green.200" }} mb={2}>
          Booking Confirmed!
        </Text>
        <Text color={{ base: "green.700", _dark: "green.300" }} mb={4}>
          Your reservation at {hotel.name} has been confirmed.
        </Text>
        <Text fontSize="sm" color={{ base: "green.600", _dark: "green.400" }}>
          📧 A confirmation email has been sent to {guestInfo.email}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={{ base: "white", _dark: "gray.800" }}
      borderWidth="1px"
      borderColor={{ base: "gray.200", _dark: "gray.600" }}
      borderRadius="lg"
      p={6}
      boxShadow={{ base: "md", _dark: "dark-lg" }}
    >
      <Stack gap={6} align="stretch">
        {/* Booking Summary */}
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={4} color={{ base: "gray.900", _dark: "white" }}>
            Booking Summary
          </Text>
          <Stack gap={2} align="stretch">
            <HStack justify="space-between">
              <Text color={{ base: "gray.700", _dark: "gray.300" }}>Hotel:</Text>
              <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>{hotel.name}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color={{ base: "gray.700", _dark: "gray.300" }}>Room Type:</Text>
              <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>{selectedRoom.name}</Text>
            </HStack>
            <HStack justify="space-between">
              <Text color={{ base: "gray.700", _dark: "gray.300" }}>Price per night:</Text>
              <Text fontWeight="medium" color={{ base: "gray.900", _dark: "white" }}>{formatPrice(selectedRoom.price)}</Text>
            </HStack>
          </Stack>
        </Box>

        {/* Separator */}
        <Box height="1px" bg={{ base: "gray.200", _dark: "gray.600" }} />

        {/* Reservation Status */}
        {currentReservation && (
          <Box
            bg={{ base: "green.50", _dark: "green.900" }}
            borderWidth="1px"
            borderColor={{ base: "green.200", _dark: "green.700" }}
            borderRadius="md"
            p={4}
          >
            <Text fontWeight="bold" color={{ base: "green.800", _dark: "green.200" }} mb={2}>
              🎉 Room Reserved!
            </Text>
            <Text color={{ base: "green.700", _dark: "green.300" }} mb={3}>
              You have {formatTime(reservationTimeRemaining)} remaining to complete your booking.
            </Text>
            <Box 
              bg={{ base: "green.200", _dark: "green.700" }} 
              borderRadius="full" 
              height="4px" 
              mb={3}
            >
              <Box
                bg={{ base: "green.500", _dark: "green.400" }}
                height="100%"
                borderRadius="full"
                width={`${progressPercentage}%`}
                transition="width 1s ease"
              />
            </Box>
            <Button
              size="sm"
              variant="outline"
              colorScheme="green"
              onClick={handleExtendReservation}
            >
              Extend (+5 min)
            </Button>
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Box
            bg={{ base: "red.50", _dark: "red.900" }}
            borderWidth="1px"
            borderColor={{ base: "red.200", _dark: "red.700" }}
            borderRadius="md"
            p={4}
          >
            <Text color={{ base: "red.800", _dark: "red.200" }} fontWeight="medium">
              ⚠️ {error}
            </Text>
          </Box>
        )}

        {/* Dates Display (Locked) */}
        <Box>
          <HStack justify="space-between" align="center" mb={3}>
            <Text fontSize="lg" fontWeight="semibold" color={{ base: "gray.900", _dark: "white" }}>
              Stay Dates
            </Text>
            {onChangeDates && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="blue"
                onClick={onChangeDates}
                disabled={!!currentReservation}
              >
                Change Dates
              </Button>
            )}
          </HStack>
          <Stack gap={3}>
            <HStack gap={4}>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Check-in
                </Text>
                <Box
                  p={3}
                  bg={{ base: "gray.50", _dark: "gray.700" }}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.600" }}
                >
                  <Text color={{ base: "gray.900", _dark: "white" }}>
                    {dates.checkIn ? formatDate(dates.checkIn) : 'Not selected'}
                  </Text>
                </Box>
              </Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Check-out
                </Text>
                <Box
                  p={3}
                  bg={{ base: "gray.50", _dark: "gray.700" }}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.600" }}
                >
                  <Text color={{ base: "gray.900", _dark: "white" }}>
                    {dates.checkOut ? formatDate(dates.checkOut) : 'Not selected'}
                  </Text>
                </Box>
              </Box>
            </HStack>
            <HStack gap={4}>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Nights
                </Text>
                <Box
                  p={3}
                  bg={{ base: "gray.50", _dark: "gray.700" }}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.600" }}
                >
                  <Text color={{ base: "gray.900", _dark: "white" }}>
                    {dates.checkIn && dates.checkOut ? calculateNights(dates.checkIn, dates.checkOut) : 0} nights
                  </Text>
                </Box>
              </Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Guests
                </Text>
                <Box
                  p={3}
                  bg={{ base: "gray.50", _dark: "gray.700" }}
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor={{ base: "gray.200", _dark: "gray.600" }}
                >
                  <Text color={{ base: "gray.900", _dark: "white" }}>
                    {guests} {guests === 1 ? 'guest' : 'guests'}
                  </Text>
                </Box>
              </Box>
            </HStack>
          </Stack>
        </Box>

        {/* Separator */}
        <Box height="1px" bg={{ base: "gray.200", _dark: "gray.600" }} />

        {/* Guest Information */}
        <Box>
          <Text fontSize="lg" fontWeight="semibold" mb={3} color={{ base: "gray.900", _dark: "white" }}>
            Guest Information
          </Text>
          <Stack gap={4}>
            <HStack gap={4} width="100%">
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  First Name *
                </Text>
                <Input
                  value={guestInfo.firstName}
                  onChange={(e) => {
                    setGuestInfo({ ...guestInfo, firstName: e.target.value });
                    if (validationErrors.firstName) {
                      setValidationErrors({ ...validationErrors, firstName: undefined });
                    }
                  }}
                  disabled={!!currentReservation}
                  pl={4}
                  bg={{ base: "white", _dark: "gray.700" }}
                  borderColor={validationErrors.firstName ? "red.300" : { base: "gray.300", _dark: "gray.600" }}
                  color={{ base: "gray.900", _dark: "white" }}
                  _focus={{ 
                    borderColor: validationErrors.firstName ? "red.500" : { base: "blue.500", _dark: "blue.300" },
                    boxShadow: validationErrors.firstName ? "0 0 0 1px #e53e3e" : { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                  }}
                />
                {validationErrors.firstName && (
                  <Text fontSize="sm" color="red.500" mt={1}>{validationErrors.firstName}</Text>
                )}
              </Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Last Name *
                </Text>
                <Input
                  value={guestInfo.lastName}
                  onChange={(e) => {
                    setGuestInfo({ ...guestInfo, lastName: e.target.value });
                    if (validationErrors.lastName) {
                      setValidationErrors({ ...validationErrors, lastName: undefined });
                    }
                  }}
                  disabled={!!currentReservation}
                  pl={4}
                  bg={{ base: "white", _dark: "gray.700" }}
                  borderColor={validationErrors.lastName ? "red.300" : { base: "gray.300", _dark: "gray.600" }}
                  color={{ base: "gray.900", _dark: "white" }}
                  _focus={{ 
                    borderColor: validationErrors.lastName ? "red.500" : { base: "blue.500", _dark: "blue.300" },
                    boxShadow: validationErrors.lastName ? "0 0 0 1px #e53e3e" : { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                  }}
                />
                {validationErrors.lastName && (
                  <Text fontSize="sm" color="red.500" mt={1}>{validationErrors.lastName}</Text>
                )}
              </Box>
            </HStack>
            <HStack gap={4} width="100%">
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Email *
                </Text>
                <Input
                  type="email"
                  value={guestInfo.email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  disabled={!!currentReservation}
                  pl={4}
                  bg={{ base: "white", _dark: "gray.700" }}
                  borderColor={validationErrors.email ? "red.300" : { base: "gray.300", _dark: "gray.600" }}
                  color={{ base: "gray.900", _dark: "white" }}
                  _focus={{ 
                    borderColor: validationErrors.email ? "red.500" : { base: "blue.500", _dark: "blue.300" },
                    boxShadow: validationErrors.email ? "0 0 0 1px #e53e3e" : { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                  }}
                />
                {validationErrors.email && (
                  <Text fontSize="sm" color="red.500" mt={1}>{validationErrors.email}</Text>
                )}
              </Box>
              <Box flex="1">
                <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                  Phone *
                </Text>
                <Input
                  type="tel"
                  value={guestInfo.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  disabled={!!currentReservation}
                  placeholder="(555) 123-4567"
                  pl={4}
                  bg={{ base: "white", _dark: "gray.700" }}
                  borderColor={validationErrors.phone ? "red.300" : { base: "gray.300", _dark: "gray.600" }}
                  color={{ base: "gray.900", _dark: "white" }}
                  _focus={{ 
                    borderColor: validationErrors.phone ? "red.500" : { base: "blue.500", _dark: "blue.300" },
                    boxShadow: validationErrors.phone ? "0 0 0 1px #e53e3e" : { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                  }}
                />
                {validationErrors.phone && (
                  <Text fontSize="sm" color="red.500" mt={1}>{validationErrors.phone}</Text>
                )}
              </Box>
            </HStack>
            <Box>
              <Text fontSize="sm" fontWeight="medium" mb={2} color={{ base: "gray.700", _dark: "gray.300" }}>
                Special Requests
              </Text>
              <Textarea
                value={guestInfo.specialRequests || ''}
                onChange={(e) =>
                  setGuestInfo({ ...guestInfo, specialRequests: e.target.value })
                }
                disabled={!!currentReservation}
                placeholder="Any special requests or notes..."
                pl={4}
                bg={{ base: "white", _dark: "gray.700" }}
                borderColor={{ base: "gray.300", _dark: "gray.600" }}
                color={{ base: "gray.900", _dark: "white" }}
                _focus={{ 
                  borderColor: { base: "blue.500", _dark: "blue.300" },
                  boxShadow: { base: "0 0 0 1px #3182ce", _dark: "0 0 0 1px #63b3ed" }
                }}
              />
            </Box>
          </Stack>
        </Box>

        {/* Separator */}
        <Box height="1px" bg={{ base: "gray.200", _dark: "gray.600" }} />

        {/* Total Price */}
        <Box>
          <HStack justify="space-between" align="center">
            <Text fontSize="lg" fontWeight="semibold" color={{ base: "gray.900", _dark: "white" }}>
              Total Price:
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color={{ base: "blue.600", _dark: "blue.400" }}>
              {formatPrice(calculateTotalPrice())}
            </Text>
          </HStack>
          {dates.checkIn && dates.checkOut && (
            <Text fontSize="sm" color={{ base: "gray.600", _dark: "gray.400" }} textAlign="right">
              {formatPrice(selectedRoom.price)} × {calculateNights(dates.checkIn, dates.checkOut)} nights
            </Text>
          )}
        </Box>

        {/* Action Buttons */}
        {!currentReservation ? (
          <Flex justify="center">
            <Button
              colorScheme="blue"
              size="lg"
              onClick={handleReserveRoom}
              loading={isCreatingReservation}
              loadingText="Reserving Room..."
              px={8}
              minW="200px"
              disabled={!dates.checkIn || !dates.checkOut}
            >
              Reserve Room (10 min hold)
            </Button>
          </Flex>
        ) : (
          <Stack gap={3} align="center">
            <Button
              colorScheme="green"
              size="lg"
              onClick={handleCompleteBooking}
              loading={isCompletingBooking || isSendingEmail}
              loadingText={isSendingEmail ? "Sending Confirmation..." : "Completing Booking..."}
              px={8}
              minW="200px"
            >
              Complete Booking
            </Button>
            <Button
              variant="outline"
              colorScheme="gray"
              onClick={clearReservation}
              size="sm"
              disabled={isCompletingBooking || isSendingEmail}
            >
              Cancel Reservation
            </Button>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};
