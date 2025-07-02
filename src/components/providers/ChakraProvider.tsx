import { ChakraProvider as BaseChakraProvider, defaultSystem } from "@chakra-ui/react"
import { ColorModeProvider } from "../ui/color-mode"
import "@fontsource-variable/bricolage-grotesque/index.css"

export const ChakraUIProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <BaseChakraProvider value={defaultSystem}>
            <ColorModeProvider>
                {children}
            </ColorModeProvider>
        </BaseChakraProvider>
    )
}