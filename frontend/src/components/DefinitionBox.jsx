import { Box, Text, Flex } from "@chakra-ui/react";

function DefinitionBox({
  definition,
  isSecondary = false,  // 是否為第二個定義
  isRevealed = true,    // 是否已顯示（用於第二個定義）
}) {
  return (
    <Flex justify="center" mb={isSecondary ? 4 : 1} mt={isSecondary ? 0 : { base: 6, md: 10 }}>
      <Box
        bg="pink.500"
        p={{ base: 3, md: 4 }}
        borderRadius="md"
        w={{ base: "100%", md: "90%" }}
        textAlign="center"
        opacity={isRevealed ? 1 : 0.5}
      >
        <Text
          fontSize={{ base: "md", md: "lg" }}
          whiteSpace="pre-wrap"
          fontFamily="Comic Sans MS"
          color="yellow.300"
          minH={{ base: "50px", md: "60px" }}
        >
          {isRevealed ? definition : "** another definition **"}
        </Text>
      </Box>
    </Flex>
  );
}

export default DefinitionBox;