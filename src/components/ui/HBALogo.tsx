import React from 'react';
import { Box } from '@chakra-ui/react';
import { useColorModeValue } from './color-mode';

interface HBALogoProps {
  size?: number;
}

export const HBALogo: React.FC<HBALogoProps> = ({ size = 40 }) => {
  const buildingColor = useColorModeValue('#000000', '#FFFFFF');
  const windowColor = useColorModeValue('#FFFFFF', '#000000');
  const textColor = useColorModeValue('#000000', '#FFFFFF');
  
  return (
    <Box display="inline-block">
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        {/* Hotel icon (simplified building) */}
        <rect x="60" y="40" width="80" height="80" fill={buildingColor} rx="5"/>
        <rect x="70" y="50" width="10" height="10" fill={windowColor}/>
        <rect x="90" y="50" width="10" height="10" fill={windowColor}/>
        <rect x="110" y="50" width="10" height="10" fill={windowColor}/>
        <rect x="70" y="70" width="10" height="10" fill={windowColor}/>
        <rect x="90" y="70" width="10" height="10" fill={windowColor}/>
        <rect x="110" y="70" width="10" height="10" fill={windowColor}/>

        {/* HBA Text */}
        <text 
          x="100" 
          y="150" 
          fontFamily="Arial, sans-serif" 
          fontSize="24" 
          fill={textColor} 
          textAnchor="middle" 
          fontWeight="bold"
        >
          HBA
        </text>
      </svg>
    </Box>
  );
}; 