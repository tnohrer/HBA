import { Hotel, SearchParams, Booking, RoomReservation, SortOption, POPULAR_DESTINATIONS, DestinationSuggestion, RecentSearch } from '../types';

// In-memory store for active reservations (in production, this would be in a database)
let activeReservations: Map<string, RoomReservation> = new Map();

// Reservation configuration
const RESERVATION_DURATION_MINUTES = 10;
const CLEANUP_INTERVAL_MS = 60000; // Check for expired reservations every minute

// Cleanup expired reservations
const cleanupExpiredReservations = () => {
  const now = new Date();
  const expiredReservations: string[] = [];
  
  activeReservations.forEach((reservation, id) => {
    if (reservation.expiresAt < now) {
      expiredReservations.push(id);
    }
  });
  
  expiredReservations.forEach(id => {
    console.log('🕐 Reservation expired and released:', id);
    activeReservations.delete(id);
  });
  
  if (expiredReservations.length > 0) {
    console.log(`🧹 Cleaned up ${expiredReservations.length} expired reservations`);
  }
};

// Start cleanup interval
setInterval(cleanupExpiredReservations, CLEANUP_INTERVAL_MS);

// Generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);
const generateUserId = () => `user_${Math.random().toString(36).substr(2, 9)}`; // Mock user ID

// Mock hotel data using the actual images from your IMG folder
const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand City Hotel',
    description: 'A luxurious hotel in the heart of the city with stunning views and world-class amenities. Perfect for business travelers and tourists alike.',
    location: 'New York, New York',
    rating: 4.5,
    price: 199,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior.jpg', '/IMG/Hotel/HotelExterior2.jpg'],
      rooms: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg', '/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
    },
    amenities: ['Free WiFi', 'Pool', 'Gym', 'Restaurant', 'Bar', 'Spa', 'Room Service', 'Concierge'],
    roomTypes: [
      {
        id: 'basic-room-1',
        name: 'Standard Room',
        description: 'Comfortable room with city view, perfect for business travelers',
        price: 199,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
      },
      {
        id: 'luxury-room-1',
        name: 'Luxury Suite',
        description: 'Spacious suite with premium amenities and stunning city views',
        price: 399,
        capacity: 4,
        status: 'available',
        images: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-2',
    name: 'Seaside Resort & Spa',
    description: 'Escape to paradise at our beachfront resort featuring pristine beaches, world-class spa services, and exceptional dining experiences.',
    location: 'Miami, Florida',
    rating: 4.8,
    price: 299,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior3.jpg', '/IMG/Hotel/HotelExterior.jpg'],
      rooms: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif', '/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
    },
    amenities: ['Beachfront', 'Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Bar', 'Water Sports', 'Kids Club'],
    roomTypes: [
      {
        id: 'middle-room-1',
        name: 'Ocean View Room',
        description: 'Beautiful room with direct ocean views and modern amenities',
        price: 299,
        capacity: 3,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      },
      {
        id: 'luxury-room-2',
        name: 'Presidential Suite',
        description: 'Ultimate luxury with panoramic ocean views, private terrace, and butler service',
        price: 799,
        capacity: 6,
        status: 'available',
        images: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-3',
    name: 'Mountain Lodge Retreat',
    description: 'A cozy mountain retreat perfect for nature lovers, featuring rustic charm with modern comforts and breathtaking mountain views.',
    location: 'Aspen, Colorado',
    rating: 4.3,
    price: 249,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior2.jpg', '/IMG/Hotel/HotelExterior.jpg'],
      rooms: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
    },
    amenities: ['Mountain Views', 'Free WiFi', 'Fireplace', 'Restaurant', 'Ski Storage', 'Hot Tub', 'Hiking Trails'],
    roomTypes: [
      {
        id: 'basic-room-2',
        name: 'Mountain View Room',
        description: 'Cozy room with stunning mountain views and rustic decor',
        price: 249,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-4',
    name: 'Metropolitan Business Center',
    description: 'Modern business hotel in the financial district, featuring state-of-the-art meeting facilities and executive amenities.',
    location: 'Chicago, Illinois',
    rating: 4.2,
    price: 179,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior4.jpg', '/IMG/Hotel/HotelExterior2.jpg'],
      rooms: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg', '/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
    },
    amenities: ['Free WiFi', 'Business Center', 'Gym', 'Restaurant', 'Airport Shuttle', 'Meeting Rooms', 'Printer Access'],
    roomTypes: [
      {
        id: 'business-room-1',
        name: 'Executive Room',
        description: 'Spacious room designed for business travelers with work desk and city views',
        price: 179,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
      },
      {
        id: 'suite-room-1',
        name: 'Executive Suite',
        description: 'Premium suite with separate living area and panoramic city views',
        price: 329,
        capacity: 4,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      }
    ]
  },
  {
    id: 'hotel-5',
    name: 'Tropical Paradise Resort',
    description: 'Experience authentic Hawaiian hospitality at our luxury beachfront resort with volcanic mountain backdrops and pristine beaches.',
    location: 'Maui, Hawaii',
    rating: 4.7,
    price: 449,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior5.jpg', '/IMG/Hotel/HotelExterior3.jpg'],
      rooms: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg', '/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
    },
    amenities: ['Beachfront', 'Free WiFi', 'Multiple Pools', 'Spa', 'Luau', 'Snorkeling', 'Golf Course', 'Cultural Activities'],
    roomTypes: [
      {
        id: 'tropical-room-1',
        name: 'Garden View Room',
        description: 'Beautiful room overlooking tropical gardens with Hawaiian decor',
        price: 449,
        capacity: 3,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      },
      {
        id: 'oceanfront-suite-1',
        name: 'Oceanfront Villa',
        description: 'Exclusive villa with direct beach access and private lanai',
        price: 899,
        capacity: 6,
        status: 'available',
        images: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-6',
    name: 'Bay View Boutique Hotel',
    description: 'Charming boutique hotel in the heart of San Francisco with personalized service and unique artistic design.',
    location: 'San Francisco, California',
    rating: 4.1,
    price: 229,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior6.jpg', '/IMG/Hotel/HotelExterior4.jpg'],
      rooms: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif', '/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
    },
    amenities: ['Free WiFi', 'Rooftop Terrace', 'Restaurant', 'Art Gallery', 'Pet-Friendly', 'Bike Rental', 'Wine Bar'],
    roomTypes: [
      {
        id: 'boutique-room-1',
        name: 'Artist Room',
        description: 'Uniquely designed room featuring local artwork and bay views',
        price: 229,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      },
      {
        id: 'penthouse-1',
        name: 'Penthouse Suite',
        description: 'Stunning penthouse with panoramic bay and city views',
        price: 459,
        capacity: 4,
        status: 'available',
        images: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-7',
    name: 'Pacific Coastal Resort',
    description: 'Spectacular beachfront resort along the California coast featuring world-class surfing, fine dining, and luxury accommodations.',
    location: 'Malibu, California',
    rating: 4.6,
    price: 379,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior7.webp', '/IMG/Hotel/HotelExterior5.jpg'],
      rooms: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg', '/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
    },
    amenities: ['Beachfront', 'Free WiFi', 'Infinity Pool', 'Spa', 'Surfboard Rental', 'Fine Dining', 'Yoga Classes', 'Private Beach'],
    roomTypes: [
      {
        id: 'ocean-room-1',
        name: 'Ocean View Room',
        description: 'Elegant room with floor-to-ceiling windows overlooking the Pacific',
        price: 379,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      },
      {
        id: 'beachfront-suite-1',
        name: 'Beachfront Suite',
        description: 'Luxury suite with direct beach access and private patio',
        price: 679,
        capacity: 5,
        status: 'available',
        images: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-8',
    name: 'Vegas Strip Hotel & Casino',
    description: 'Experience the excitement of Las Vegas at our vibrant hotel featuring gaming, entertainment, and dining in the heart of the Strip.',
    location: 'Las Vegas, Nevada',
    rating: 3.9,
    price: 129,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior8.jpg', '/IMG/Hotel/HotelExterior6.jpg'],
      rooms: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg', '/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
    },
    amenities: ['Casino', 'Free WiFi', 'Pool', 'Multiple Restaurants', 'Entertainment Shows', 'Shopping', 'Parking'],
    roomTypes: [
      {
        id: 'vegas-room-1',
        name: 'Strip View Room',
        description: 'Modern room with exciting Las Vegas Strip views',
        price: 129,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
      },
      {
        id: 'vegas-suite-1',
        name: 'High Roller Suite',
        description: 'Luxurious suite with premium Strip views and VIP amenities',
        price: 299,
        capacity: 4,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      }
    ]
  },
  {
    id: 'hotel-9',
    name: 'Emerald Coast Luxury Resort',
    description: 'Ultimate luxury resort on Florida\'s Emerald Coast featuring championship golf, world-class spa, and pristine white sand beaches.',
    location: 'Destin, Florida',
    rating: 4.9,
    price: 549,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior9.jpg', '/IMG/Hotel/HotelExterior7.webp'],
      rooms: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
    },
    amenities: ['Beachfront', 'Championship Golf', 'Luxury Spa', 'Fine Dining', 'Private Beach', 'Butler Service', 'Helicopter Tours', 'Marina'],
    roomTypes: [
      {
        id: 'emerald-room-1',
        name: 'Gulf View Room',
        description: 'Luxurious room with stunning Gulf of Mexico views',
        price: 549,
        capacity: 3,
        status: 'available',
        images: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
      },
      {
        id: 'presidential-1',
        name: 'Presidential Villa',
        description: 'Ultimate luxury villa with private beach, pool, and dedicated staff',
        price: 1299,
        capacity: 8,
        status: 'available',
        images: ['/IMG/ROOMS/LuxuryRooms/LuxuryRoom.jpg']
      }
    ]
  },
  {
    id: 'hotel-10',
    name: 'Historic Harbor Hotel',
    description: 'Elegant historic hotel in Boston\'s waterfront district, combining timeless charm with modern luxury and harbor views.',
    location: 'Boston, Massachusetts',
    rating: 4.0,
    price: 219,
    images: {
      lobby: ['/IMG/Hotel/Lobby.jpg'],
      exterior: ['/IMG/Hotel/HotelExterior10.jpg', '/IMG/Hotel/HotelExterior8.jpg'],
      rooms: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg', '/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
    },
    amenities: ['Historic Charm', 'Free WiFi', 'Restaurant', 'Harbor Views', 'Fitness Center', 'Business Center', 'Valet Parking'],
    roomTypes: [
      {
        id: 'historic-room-1',
        name: 'Harbor View Room',
        description: 'Classic room with historic details and beautiful harbor views',
        price: 219,
        capacity: 2,
        status: 'available',
        images: ['/IMG/ROOMS/Basic Room/Basic_HotelRoom.jpg']
      },
      {
        id: 'historic-suite-1',
        name: 'Admiral Suite',
        description: 'Elegant suite with panoramic harbor views and period furnishings',
        price: 419,
        capacity: 4,
        status: 'available',
        images: ['/IMG/ROOMS/Middle Room/MiddleTierRoom.avif']
      }
    ]
  }
];

// Simulate API response delays and potential errors
const simulateAPICall = <T>(data: T, delay: number = 1000): Promise<T> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate occasional API errors (5% chance)
      if (Math.random() < 0.05) {
        reject(new Error('Network error: Unable to connect to hotel service'));
        return;
      }
      resolve(data);
    }, delay);
  });
};

// Check if a room is actually available (considering reservations)
const isRoomAvailable = (roomTypeId: string, hotelId: string): boolean => {
  // Clean up expired reservations first
  cleanupExpiredReservations();
  
  // Check if this specific room type is currently reserved
  const isReserved = Array.from(activeReservations.values()).some(
    reservation => reservation.roomTypeId === roomTypeId && reservation.hotelId === hotelId
  );
  
  return !isReserved;
};

// Enhanced sorting function
const sortHotels = (hotels: Hotel[], sortBy: SortOption): Hotel[] => {
  const sortedHotels = [...hotels];
  
  switch (sortBy) {
    case 'price-asc':
      return sortedHotels.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sortedHotels.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sortedHotels.sort((a, b) => b.rating - a.rating);
    case 'rating-asc':
      return sortedHotels.sort((a, b) => a.rating - b.rating);
    case 'name-asc':
      return sortedHotels.sort((a, b) => a.name.localeCompare(b.name));
    case 'popularity-desc':
      // Sort by rating * number of amenities as popularity score
      return sortedHotels.sort((a, b) => {
        const popularityA = a.rating * a.amenities.length;
        const popularityB = b.rating * b.amenities.length;
        return popularityB - popularityA;
      });
    default:
      return sortedHotels;
  }
};

// Enhanced filter hotels function
const filterHotels = (hotels: Hotel[], params: SearchParams): Hotel[] => {
  return hotels.filter(hotel => {
    // Enhanced location filtering
    if (params.location) {
      const searchTerm = params.location.toLowerCase().trim();
      const hotelLocation = hotel.location.toLowerCase();
      
      // Split hotel location (e.g., "Miami, Florida" -> ["miami", "florida"])
      const locationParts = hotelLocation.split(',').map(part => part.trim());
      
      // Check if search matches any part of the location
      const locationMatch = locationParts.some(part => 
        part.includes(searchTerm) || searchTerm.includes(part)
      ) || hotelLocation.includes(searchTerm);
      
      // Additional matching for common abbreviations and variations
      const stateAbbreviations: Record<string, string[]> = {
        'california': ['ca', 'calif'],
        'florida': ['fl', 'fla'],
        'new york': ['ny'],
        'nevada': ['nv', 'nev'],
        'massachusetts': ['ma', 'mass'],
        'illinois': ['il', 'ill'],
        'colorado': ['co', 'colo'],
        'hawaii': ['hi']
      };
      
      // Check for state abbreviation matches
      const abbreviationMatch = Object.entries(stateAbbreviations).some(([fullName, abbrevs]) => {
        const hasFullName = hotelLocation.includes(fullName);
        const hasAbbrev = abbrevs.some(abbrev => searchTerm === abbrev);
        const searchIsFullName = searchTerm === fullName;
        
        return (hasFullName && hasAbbrev) || (hasFullName && searchIsFullName);
      });
      
      if (!locationMatch && !abbreviationMatch) {
        return false;
      }
    }

    // Filter by guest count (check if any room can accommodate and is truly available)
    const hasAvailableRoom = hotel.roomTypes.some(room => 
      room.capacity >= params.guests && 
      room.status === 'available' && 
      isRoomAvailable(room.id, hotel.id)
    );
    if (!hasAvailableRoom) {
      return false;
    }

    // Filter by price range if provided
    if (params.filters.priceRange) {
      const [minPrice, maxPrice] = params.filters.priceRange;
      if (hotel.price < minPrice || hotel.price > maxPrice) {
        return false;
      }
    }

    // Filter by minimum rating if provided
    if (params.filters.rating && hotel.rating < params.filters.rating) {
      return false;
    }

    // Filter by amenities if provided (enhanced matching)
    if (params.filters.amenities && params.filters.amenities.length > 0) {
      const hasRequiredAmenities = params.filters.amenities.every(amenity =>
        hotel.amenities.some(hotelAmenity => 
          hotelAmenity.toLowerCase().includes(amenity.toLowerCase()) ||
          amenity.toLowerCase().includes(hotelAmenity.toLowerCase())
        )
      );
      if (!hasRequiredAmenities) {
        return false;
      }
    }

    return true;
  });
};

// Destination suggestion service
export const getDestinationSuggestions = async (query: string): Promise<DestinationSuggestion[]> => {
  if (!query || query.length < 1) return [];
  
  const filteredDestinations = POPULAR_DESTINATIONS.filter(dest =>
    dest.name.toLowerCase().includes(query.toLowerCase()) ||
    dest.country.toLowerCase().includes(query.toLowerCase())
  ).sort((a, b) => b.popularityScore - a.popularityScore);
  
  return simulateAPICall(filteredDestinations.slice(0, 5), 300);
};

// Recent searches management
const RECENT_SEARCHES_KEY = 'hba-recent-searches';
const MAX_RECENT_SEARCHES = 5;

export const saveRecentSearch = (searchParams: SearchParams): void => {
  try {
    const existing = getRecentSearches();
    const newSearch: RecentSearch = {
      id: generateId(),
      location: searchParams.location,
      checkIn: searchParams.checkIn,
      checkOut: searchParams.checkOut,
      guests: searchParams.guests,
      timestamp: Date.now()
    };
    
    // Remove any existing search with same parameters
    const filtered = existing.filter(search => 
      !(search.location === newSearch.location && 
        search.checkIn === newSearch.checkIn && 
        search.checkOut === newSearch.checkOut &&
        search.guests === newSearch.guests)
    );
    
    // Add new search at the beginning
    const updated = [newSearch, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
  } catch (error) {
    console.warn('Failed to save recent search:', error);
  }
};

export const getRecentSearches = (): RecentSearch[] => {
  try {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (!saved) return [];
    
    const searches: RecentSearch[] = JSON.parse(saved);
    
    // Filter out searches older than 30 days
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const filtered = searches.filter(search => search.timestamp > thirtyDaysAgo);
    
    // Save filtered list back to localStorage
    if (filtered.length !== searches.length) {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(filtered));
    }
    
    return filtered;
  } catch (error) {
    console.warn('Failed to load recent searches:', error);
    return [];
  }
};

export const clearRecentSearches = (): void => {
  try {
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  } catch (error) {
    console.warn('Failed to clear recent searches:', error);
  }
};

// Simulate price variations based on dates and demand
const adjustPricesForDates = (hotels: Hotel[], checkIn: string, _checkOut: string): Hotel[] => {
  const checkInDate = new Date(checkIn);
  const isWeekend = checkInDate.getDay() === 0 || checkInDate.getDay() === 6;
  const isPeakSeason = checkInDate.getMonth() >= 5 && checkInDate.getMonth() <= 8; // Summer months
  
  const priceMultiplier = (isWeekend ? 1.2 : 1) * (isPeakSeason ? 1.3 : 1);

  return hotels.map(hotel => ({
    ...hotel,
    price: Math.round(hotel.price * priceMultiplier),
    roomTypes: hotel.roomTypes.map(room => ({
      ...room,
      price: Math.round(room.price * priceMultiplier)
    }))
  }));
};

export const HotelService = {
  // Reservation management functions
  createReservation: async (
    hotelId: string, 
    roomTypeId: string, 
    checkIn: string, 
    checkOut: string, 
    guests: number, 
    totalPrice: number
  ): Promise<RoomReservation> => {
    console.log('🔒 Creating reservation for room:', roomTypeId, 'at hotel:', hotelId);
    
    // Check if room is still available
    if (!isRoomAvailable(roomTypeId, hotelId)) {
      throw new Error('Room is no longer available for reservation');
    }
    
    // Create reservation
    const reservationId = generateId();
    const expiresAt = new Date(Date.now() + RESERVATION_DURATION_MINUTES * 60 * 1000);
    
    const reservation: RoomReservation = {
      id: reservationId,
      roomTypeId,
      hotelId,
      userId: generateUserId(),
      expiresAt,
      checkIn,
      checkOut,
      guests,
      totalPrice
    };
    
    activeReservations.set(reservationId, reservation);
    
    console.log(`✅ Reservation created: ${reservationId}, expires at ${expiresAt.toLocaleTimeString()}`);
    
    // Simulate API processing time
    return simulateAPICall(reservation, 800);
  },

  extendReservation: async (reservationId: string, additionalMinutes: number = 5): Promise<RoomReservation> => {
    console.log('⏰ Extending reservation:', reservationId);
    
    const reservation = activeReservations.get(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found or has expired');
    }
    
    // Extend the expiration time
    reservation.expiresAt = new Date(reservation.expiresAt.getTime() + additionalMinutes * 60 * 1000);
    activeReservations.set(reservationId, reservation);
    
    console.log(`🔄 Reservation extended until ${reservation.expiresAt.toLocaleTimeString()}`);
    
    return simulateAPICall(reservation, 300);
  },

  releaseReservation: async (reservationId: string): Promise<void> => {
    console.log('🔓 Releasing reservation:', reservationId);
    
    const wasDeleted = activeReservations.delete(reservationId);
    if (!wasDeleted) {
      console.warn('⚠️ Attempted to release non-existent reservation:', reservationId);
    } else {
      console.log('✅ Reservation released successfully');
    }
    
    return simulateAPICall(undefined, 200);
  },

  getReservation: async (reservationId: string): Promise<RoomReservation | null> => {
    cleanupExpiredReservations(); // Clean up first
    const reservation = activeReservations.get(reservationId);
    return simulateAPICall(reservation || null, 200);
  },

  getRemainingReservationTime: (reservationId: string): number => {
    const reservation = activeReservations.get(reservationId);
    if (!reservation) return 0;
    
    const remaining = reservation.expiresAt.getTime() - Date.now();
    return Math.max(0, Math.floor(remaining / 1000)); // Return seconds remaining
  },

  searchHotels: async (params: SearchParams, sortBy: SortOption = 'rating-desc'): Promise<Hotel[]> => {
    console.log('🔍 Searching hotels with params:', params, 'sortBy:', sortBy);
    
    // Save search to recent searches
    saveRecentSearch(params);
    
    // Simulate API processing time
    const delay = Math.random() * 1500 + 500; // 500-2000ms delay
    
    let filteredHotels = filterHotels(MOCK_HOTELS, params);
    
    // Adjust prices based on dates
    if (params.checkIn && params.checkOut) {
      filteredHotels = adjustPricesForDates(filteredHotels, params.checkIn, params.checkOut);
    }

    // Apply sorting
    filteredHotels = sortHotels(filteredHotels, sortBy);

    return simulateAPICall(filteredHotels, delay);
  },

  getHotelDetails: async (id: string): Promise<Hotel> => {
    console.log('🏨 Fetching hotel details for ID:', id);
    
    const hotel = MOCK_HOTELS.find(h => h.id === id);
    if (!hotel) {
      throw new Error(`Hotel with ID ${id} not found`);
    }

    return simulateAPICall(hotel, 800);
  },

  createBooking: async (bookingData: Partial<Booking>): Promise<Booking> => {
    console.log('📋 Creating booking:', bookingData);
    
    // If there's a reservation, verify it's still valid
    if (bookingData.reservationId) {
      const reservation = activeReservations.get(bookingData.reservationId);
      if (!reservation) {
        throw new Error('Reservation has expired or is invalid. Please search for rooms again.');
      }
      
      // Verify the booking matches the reservation
      if (
        reservation.hotelId !== bookingData.hotelId ||
        reservation.roomTypeId !== bookingData.roomTypeId ||
        reservation.checkIn !== bookingData.checkIn ||
        reservation.checkOut !== bookingData.checkOut ||
        reservation.guests !== bookingData.guests
      ) {
        throw new Error('Booking details do not match the reservation');
      }
    }
    
    // Simulate booking creation processing
    const booking: Booking = {
      id: `booking-${Date.now()}`,
      hotelId: bookingData.hotelId!,
      roomTypeId: bookingData.roomTypeId!,
      checkIn: bookingData.checkIn!,
      checkOut: bookingData.checkOut!,
      guests: bookingData.guests!,
      totalPrice: bookingData.totalPrice!,
      status: 'confirmed',
      reservationId: bookingData.reservationId
    };

    // If booking is successful and there was a reservation, release it
    if (bookingData.reservationId) {
      activeReservations.delete(bookingData.reservationId);
      console.log('🎉 Booking confirmed! Reservation released:', bookingData.reservationId);
    }

    // Simulate booking processing time
    return simulateAPICall(booking, 2000);
  },

  // Get available cities for search suggestions
  getAvailableCities: async (): Promise<string[]> => {
    const cities = [...new Set(MOCK_HOTELS.map(hotel => hotel.location.split(',')[0]))];
    return simulateAPICall(cities, 300);
  },

  // Get popular hotels (for homepage/recommendations)
  getPopularHotels: async (limit: number = 3): Promise<Hotel[]> => {
    const popularHotels = MOCK_HOTELS
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    
    return simulateAPICall(popularHotels, 600);
  }
};
