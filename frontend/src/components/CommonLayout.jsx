import { Heading, VStack, Container, Text } from "@chakra-ui/react";

function CommonLayout({ children }) {
  return (
    <Container
      maxWidth={{ base: "90%", md: "500px" }}
      height={{ base: "100vh", md: "90vh" }}
      margin="0 auto"
      padding={{ base: "10px", md: "20px" }}
      border="4px solid"
      borderColor="black"
      borderRadius="8px"
      bg="yellow.100"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={{ base: 4, md: 6 }}
    >
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
    </Container>
  );
}

export default CommonLayout;