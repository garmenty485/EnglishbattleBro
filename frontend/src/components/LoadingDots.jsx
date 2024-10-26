import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";

const dotAnimation = keyframes`
  0%, 20% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
  80%, 100% { transform: translateY(0); }
`;

function LoadingDots() {
  return (
    <Box display="flex" gap={2} mx={2}>
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          as="span"
          w="8px"
          h="8px"
          borderRadius="full"
          bg="pink.500"
          display="inline-block"
          animation={`${dotAnimation} 1.4s infinite ${index * 0.2}s`}
        />
      ))}
    </Box>
  );
}

export default LoadingDots;

