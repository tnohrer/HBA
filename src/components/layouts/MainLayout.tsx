import React from 'react';
import { Box, Container, Flex, Heading, Text, HStack, Icon, Link } from '@chakra-ui/react';
import { FiGlobe, FiFileText, FiGithub } from 'react-icons/fi';
import { FaLinkedin } from 'react-icons/fa';
import { ColorModeButton } from '../ui/color-mode';
import { HBALogo } from '../ui/HBALogo';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <Box minH="100vh" bg={{ base: "gray.50", _dark: "gray.900" }} display="flex" flexDirection="column">
      <Box as="header" bg={{ base: "white", _dark: "gray.800" }} borderBottom="1px" borderColor={{ base: "gray.200", _dark: "gray.700" }} py={2} display="flex" justifyContent="center">
        <Box w="100%" maxW="1200px" px={4}>
          <Flex justify="space-between" align="center">
            <Flex align="center" gap={3}>
              <HBALogo size={104} />
              <Heading size="lg" color={{ base: "gray.800", _dark: "white" }}>
                Hotel Booking App
              </Heading>
            </Flex>
            <ColorModeButton />
          </Flex>
        </Box>
      </Box>
      
      <Box as="main" flex="1" py={8} display="flex" justifyContent="center">
        <Box w="100%" maxW="1200px" px={4}>
          {children}
        </Box>
      </Box>
      
      <Box as="footer" bg={{ base: "gray.100", _dark: "gray.800" }} borderTop="1px" borderColor={{ base: "gray.200", _dark: "gray.700" }} py={6} display="flex" justifyContent="center">
        <Box w="100%" maxW="1200px" px={4}>
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="center" gap={4}>
            <Text color={{ base: "gray.600", _dark: "gray.400" }}>
              &copy; 2025 - Hire Tristan the Coolest Dude Around 😎
            </Text>
            
            <HStack gap={6}>
              <Link
                href="https://sfdork.io"
                target="_blank"
                rel="noopener noreferrer"
                color={{ base: "gray.600", _dark: "gray.400" }}
                _hover={{ color: { base: "blue.600", _dark: "blue.400" } }}
                transition="color 0.2s"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FiGlobe} boxSize={5} />
                <Text fontSize="sm">SFDork.IO</Text>
              </Link>
              
              <Link
                href="https://c4b122c1-c98a-47e1-b055-affe173ab95f.usrfiles.com/ugd/83a56d_6c32d8e94bbe4627a23af2001e0fb4ba.pdf"
                target="_blank"
                rel="noopener noreferrer"
                color={{ base: "gray.600", _dark: "gray.400" }}
                _hover={{ color: { base: "blue.600", _dark: "blue.400" } }}
                transition="color 0.2s"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FiFileText} boxSize={5} />
                <Text fontSize="sm">Resume</Text>
              </Link>
              
              <Link
                href="https://www.linkedin.com/in/tristan-nohrer/"
                target="_blank"
                rel="noopener noreferrer"
                color={{ base: "gray.600", _dark: "gray.400" }}
                _hover={{ color: { base: "blue.600", _dark: "blue.400" } }}
                transition="color 0.2s"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FaLinkedin} boxSize={5} />
                <Text fontSize="sm">LinkedIn</Text>
              </Link>
              
              <Link
                href="https://github.com/tnohrer"
                target="_blank"
                rel="noopener noreferrer"
                color={{ base: "gray.600", _dark: "gray.400" }}
                _hover={{ color: { base: "blue.600", _dark: "blue.400" } }}
                transition="color 0.2s"
                display="flex"
                alignItems="center"
                gap={2}
              >
                <Icon as={FiGithub} boxSize={5} />
                <Text fontSize="sm">GitHub</Text>
              </Link>
            </HStack>
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};
