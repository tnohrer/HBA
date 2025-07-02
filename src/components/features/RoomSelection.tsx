import React from 'react';
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
import { RoomType } from '../../types';
import { formatPrice } from '../../utils';

interface RoomSelectionProps {
  rooms: RoomType[];
  selectedRoomId?: string;
  onSelectRoom: (room: RoomType) => void;
}

export const RoomSelection: React.FC<RoomSelectionProps> = ({
  rooms,
  selectedRoomId,
  onSelectRoom,
}) => {
  return (
    <Box py={8} w="100%">
      <Heading size="lg" mb={6} color={{ base: "gray.800", _dark: "white" }}>
        Select Your Room
      </Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={6}>
        {rooms.map((room) => (
          <Box
            key={room.id}
            borderRadius="lg"
            overflow="hidden"
            bg={{ base: "white", _dark: "gray.800" }}
            border="2px solid"
            borderColor={selectedRoomId === room.id ? "blue.500" : { base: "gray.200", _dark: "gray.600" }}
            opacity={room.status !== 'available' ? 0.7 : 1}
            transition="all 0.2s"
            _hover={{
              transform: room.status === 'available' ? "translateY(-2px)" : "none",
              boxShadow: room.status === 'available' ? "lg" : "none"
            }}
          >
            <Box position="relative" h="200px">
              <Image 
                src={room.images[0]} 
                alt={room.name}
                w="100%"
                h="100%"
                objectFit="cover"
              />
              {room.status !== 'available' && (
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  colorScheme="red"
                  fontSize="xs"
                  px={2}
                  py={1}
                  textTransform="uppercase"
                >
                  {room.status}
                </Badge>
              )}
            </Box>
            
            <Box p={4}>
              <Stack gap={3}>
                <Heading size="md" color={{ base: "gray.800", _dark: "white" }}>
                  {room.name}
                </Heading>
                
                <Text 
                  color={{ base: "gray.600", _dark: "gray.400" }} 
                  fontSize="sm"
                >
                  {room.description}
                </Text>
                
                <HStack justify="space-between" align="flex-start">
                  <Flex align="center" gap={2}>
                    <Text fontSize="lg">👥</Text>
                    <Text 
                      fontSize="sm" 
                      color={{ base: "gray.700", _dark: "gray.300" }}
                    >
                      Up to {room.capacity} guests
                    </Text>
                  </Flex>
                  
                  <Box textAlign="right">
                    <Text 
                      fontSize="lg" 
                      fontWeight="bold"
                      color={{ base: "gray.800", _dark: "white" }}
                    >
                      {formatPrice(room.price)}
                    </Text>
                    <Text 
                      fontSize="xs" 
                      color={{ base: "gray.500", _dark: "gray.400" }}
                    >
                      per night
                    </Text>
                  </Box>
                </HStack>
                
                <Button
                  onClick={() => onSelectRoom(room)}
                  disabled={room.status !== 'available'}
                  variant={selectedRoomId === room.id ? 'solid' : 'outline'}
                  colorScheme="blue"
                  size="md"
                  w="100%"
                  _disabled={{
                    opacity: 0.4,
                    cursor: 'not-allowed'
                  }}
                >
                  {selectedRoomId === room.id ? 'Selected' : 'Select Room'}
                </Button>
              </Stack>
            </Box>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};
