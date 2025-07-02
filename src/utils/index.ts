export const getImagePath = (category: 'lobby' | 'exterior' | 'rooms', filename: string) => {
  return `/IMG/${category}/${filename}`;
};

export const loadImage = (path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(path);
    img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    img.src = path;
  });
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Phone number formatting and validation
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (cleaned.length >= 10) {
    const formatted = cleaned.slice(0, 10);
    return `(${formatted.slice(0, 3)}) ${formatted.slice(3, 6)}-${formatted.slice(6)}`;
  } else if (cleaned.length >= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length >= 3) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return cleaned;
  }
};

export const validatePhoneNumber = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10;
};

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize email (basic)
export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

// Date formatting utilities
export const formatDate = (date: string): string => {
  // Parse the date string in local timezone to avoid timezone issues
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day); // month is 0-indexed
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const calculateNights = (checkIn: string, checkOut: string): number => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
