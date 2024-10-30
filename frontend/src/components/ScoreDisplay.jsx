import { Box, Text } from "@chakra-ui/react";
import { SCORE_CONFIG } from '../constants/gameConfig';

function ScoreDisplay({
  score,
  showBonus,  // 現在這個值是實際的加分金額
  showPenalty,
}) {
  return (
    <Box
      bg="yellow.400"
      color="white"
      p={4}
      borderRadius="md"
      mb={4}
      w={{ base: "100%", md: "450px" }}
    >
      <Text fontSize="3xl">
        💰
        <Text as="span" fontWeight="bold" color="black">
          {score}
        </Text>

        {showBonus > 0 && (
          <Text
            as="span"
            fontWeight="bold"
            ml={2}
            bgGradient="linear(to-r, red.500, yellow.500, green.500, blue.500, purple.500)"
            bgClip="text"
          >
            + ${showBonus}
          </Text>
        )}

        {showPenalty && (
          <Text
            as="span"
            fontWeight="bold"
            ml={2}
            color="red.600"
          >
            - ${SCORE_CONFIG.PENALTY_AMOUNT}
          </Text>
        )}
      </Text>
    </Box>
  );
}

export default ScoreDisplay;