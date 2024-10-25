import { Box, Text, Flex } from "@chakra-ui/react";

function AnswerInput({
  answer,
  currentQuestion,
  isFirstLetterRevealed,
  showHint
}) {
  return (
    <Flex justify="center" mb={4} position="relative">
      <Box
        bg="pink.500"
        color="black"
        p={{ base: 2, md: 4 }}
        borderRadius="md"
        width={{ base: "100%", md: "auto" }}
      >
        <Text
          fontSize={{ base: "xl", md: "2xl" }}
          letterSpacing={{ base: 2, md: 4 }}
          minH={{ base: "32px", md: "40px" }}
          pointerEvents="none"
          width="100%"
          textAlign="center"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          {isFirstLetterRevealed ? (
            <Text as="span" color="gold" fontWeight="bold">
              {answer.charAt(0)}
            </Text>
          ) : (
            answer.charAt(0)
          )}
          {answer.slice(1)}
          {Array(currentQuestion.question.length - answer.length)
            .fill(" _")
            .join("")}
        </Text>

        <Box
          as="input"
          position="absolute"
          top={0}
          left={0}
          width="100%"
          height="100%"
          opacity={0}
          type="text"
          autoComplete="off"
          onFocus={(e) => {
            e.target.style.transform = 'translateY(-100vh)';
            e.target.style.position = 'absolute';
          }}
          onBlur={(e) => {
            e.target.style.transform = 'none';
            e.target.style.position = 'absolute';
          }}
        />
      </Box>

      {showHint && (
        <Box
          position="absolute"
          right="-20px"
          top="-30%"
          transform="translateY(-50%)"
          bg="green.500"
          color="black"
          p={2}
          borderRadius="md"
          border="2px solid white"
          boxShadow="5px 5px 0px #000"
        >
          Type the Answer
        </Box>
      )}
    </Flex>
  );
}

export default AnswerInput;