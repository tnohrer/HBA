"use client"

import { ThemeProvider, useTheme } from "next-themes"
import { Box, Flex } from "@chakra-ui/react"
import { LuMoon, LuSun } from "react-icons/lu"

export interface ColorModeProviderProps {
  children: React.ReactNode
  forcedTheme?: string
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
      {...props}
    />
  )
}

export interface UseColorModeReturn {
  colorMode: string | undefined
  setColorMode: (theme: string) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { theme, setTheme } = useTheme()
  
  const toggleColorMode = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return {
    colorMode: theme,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T): T {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

export function ColorModeButton() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === "dark"

  return (
    <Flex align="center" gap={2}>
      <LuSun size={16} color={isDark ? "#9CA3AF" : "#F59E0B"} />
      <Box
        as="button"
        onClick={toggleColorMode}
        w="50px"
        h="24px"
        bg={isDark ? "blue.600" : "gray.300"}
        borderRadius="full"
        position="relative"
        transition="background-color 0.2s"
        cursor="pointer"
        _hover={{
          bg: isDark ? "blue.500" : "gray.400"
        }}
        aria-label="Toggle color mode"
      >
        <Box
          w="20px"
          h="20px"
          bg="white"
          borderRadius="full"
          position="absolute"
          top="2px"
          left={isDark ? "28px" : "2px"}
          transition="left 0.2s"
          boxShadow="sm"
        />
      </Box>
      <LuMoon size={16} color={isDark ? "#60A5FA" : "#6B7280"} />
    </Flex>
  )
} 