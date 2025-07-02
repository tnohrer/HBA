import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  IconButton,
  Text,
  HStack,
  VStack,
  Portal,
  CloseButton
} from '@chakra-ui/react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiMaximize2,
  FiMinimize2,
  FiDownload
} from 'react-icons/fi';
import { useColorModeValue } from './color-mode';

interface ImageLightboxProps {
  images: string[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
  alt?: string;
  category?: string;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  alt = 'Hotel image',
  category = 'Gallery'
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoom, setZoom] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Color mode values
  const overlayBg = useColorModeValue('rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0.9)');
  const controlsBg = useColorModeValue('rgba(255, 255, 255, 0.9)', 'rgba(0, 0, 0, 0.8)');
  const textColor = useColorModeValue('gray.800', 'gray.100');

  // Reset state when opening lightbox
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoom(1);
      setImagePosition({ x: 0, y: 0 });
      setIsFullscreen(false);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          handlePrevious();
          break;
        case 'ArrowRight':
          handleNext();
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case 'f':
        case 'F':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, zoom]);

  // Navigation functions
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    resetImageTransform();
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    resetImageTransform();
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev * 1.5, 4));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev / 1.5, 0.5));
  };

  const resetImageTransform = () => {
    setZoom(1);
    setImagePosition({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  // Mouse drag functions for panning zoomed images
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoom > 1 && e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - imagePosition.x, y: touch.clientY - imagePosition.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isDragging && zoom > 1 && e.touches.length === 1) {
      const touch = e.touches[0];
      setImagePosition({
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <Portal>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg={overlayBg}
        zIndex={9999}
        display="flex"
        alignItems="center"
        justifyContent="center"
        onClick={onClose}
        className="fade-in"
      >
        {/* Main content container */}
        <Box
          position="relative"
          width="100%"
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image container */}
          <Box
            position="relative"
            maxWidth={isFullscreen ? "100%" : "90%"}
            maxHeight={isFullscreen ? "100%" : "90%"}
            overflow="hidden"
            borderRadius={isFullscreen ? "0" : "lg"}
            cursor={zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={currentImage}
              alt={`${alt} ${currentIndex + 1}`}
              maxWidth="100%"
              maxHeight="100%"
              objectFit="contain"
              transform={`scale(${zoom}) translate(${imagePosition.x / zoom}px, ${imagePosition.y / zoom}px)`}
              transition={isDragging ? 'none' : 'transform 0.3s ease'}
              userSelect="none"
              draggable={false}
            />
          </Box>

          {/* Close button */}
          <CloseButton
            position="absolute"
            top={4}
            right={4}
            size="lg"
            bg={controlsBg}
            color={textColor}
            _hover={{ bg: 'red.500', color: 'white' }}
            onClick={onClose}
            zIndex={10}
          />

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <IconButton
                position="absolute"
                left={4}
                top="50%"
                transform="translateY(-50%)"
                aria-label="Previous image"
                size="lg"
                bg={controlsBg}
                color={textColor}
                _hover={{ bg: 'blue.500', color: 'white' }}
                onClick={handlePrevious}
                zIndex={10}
              >
                <FiChevronLeft size={24} />
              </IconButton>
              <IconButton
                position="absolute"
                right={4}
                top="50%"
                transform="translateY(-50%)"
                aria-label="Next image"
                size="lg"
                bg={controlsBg}
                color={textColor}
                _hover={{ bg: 'blue.500', color: 'white' }}
                onClick={handleNext}
                zIndex={10}
              >
                <FiChevronRight size={24} />
              </IconButton>
            </>
          )}

          {/* Bottom controls */}
          <Box
            position="absolute"
            bottom={4}
            left="50%"
            transform="translateX(-50%)"
            bg={controlsBg}
            borderRadius="full"
            px={4}
            py={2}
            zIndex={10}
          >
            <HStack gap={3} align="center">
              {/* Zoom controls */}
              <HStack gap={1}>
                <IconButton
                  aria-label="Zoom out"
                  size="sm"
                  variant="ghost"
                  color={textColor}
                  onClick={handleZoomOut}
                  disabled={zoom <= 0.5}
                >
                  <FiZoomOut />
                </IconButton>
                <Text fontSize="sm" minW="60px" textAlign="center" color={textColor}>
                  {Math.round(zoom * 100)}%
                </Text>
                <IconButton
                  aria-label="Zoom in"
                  size="sm"
                  variant="ghost"
                  color={textColor}
                  onClick={handleZoomIn}
                  disabled={zoom >= 4}
                >
                  <FiZoomIn />
                </IconButton>
              </HStack>

              {/* Reset zoom */}
              <IconButton
                aria-label="Reset zoom"
                size="sm"
                variant="ghost"
                color={textColor}
                onClick={resetImageTransform}
                disabled={zoom === 1 && imagePosition.x === 0 && imagePosition.y === 0}
              >
                <FiMaximize2 />
              </IconButton>

              {/* Fullscreen toggle */}
              <IconButton
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                size="sm"
                variant="ghost"
                color={textColor}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <FiMinimize2 /> : <FiMaximize2 />}
              </IconButton>
            </HStack>
          </Box>

          {/* Image info */}
          <Box
            position="absolute"
            top={4}
            left={4}
            bg={controlsBg}
            borderRadius="md"
            px={3}
            py={2}
            zIndex={10}
          >
            <VStack gap={1} align="start">
              <Text fontSize="sm" fontWeight="bold" color={textColor}>
                {category}
              </Text>
              <Text fontSize="xs" color={textColor} opacity={0.8}>
                {currentIndex + 1} of {images.length}
              </Text>
            </VStack>
          </Box>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <Box
              position="absolute"
              top={4}
              left="50%"
              transform="translateX(-50%)"
              bg={controlsBg}
              borderRadius="md"
              p={2}
              zIndex={10}
              maxWidth="60%"
              overflowX="auto"
            >
              <HStack gap={2}>
                {images.map((image, index) => (
                  <Box
                    key={index}
                    cursor="pointer"
                    onClick={() => {
                      setCurrentIndex(index);
                      resetImageTransform();
                    }}
                    border="2px"
                    borderColor={index === currentIndex ? 'blue.500' : 'transparent'}
                    borderRadius="sm"
                    overflow="hidden"
                    flexShrink={0}
                    transition="all 0.2s ease"
                    _hover={{
                      borderColor: 'blue.300',
                      transform: 'scale(1.05)'
                    }}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width="40px"
                      height="30px"
                      objectFit="cover"
                    />
                  </Box>
                ))}
              </HStack>
            </Box>
          )}
        </Box>
      </Box>
    </Portal>
  );
}; 