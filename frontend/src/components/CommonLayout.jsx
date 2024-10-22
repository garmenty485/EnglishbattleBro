import { Heading, VStack, Container, Text } from "@chakra-ui/react";
import StyledBox from "./StyledBox";

function CommonLayout({ children }) {
  return (
    <Container maxW={["100%", "container.sm", "container.md", "container.lg"]}>
      <StyledBox>
        <Text fontSize="5xl" mb={4}>😏</Text>
        <Heading
          as="h1"
          size={["xl", "2xl"]}
          mb={12}
          fontFamily="Comic Sans MS"
          color="pink.600"
          textShadow="2px 2px #FFA07A"
        >
          English Battle, Bro
        </Heading>
        <VStack spacing={6} w="100%" align="center">
          {children}
        </VStack>
      </StyledBox>
    </Container>
  );
}

export default CommonLayout;