import { Heading, VStack, Container, Text, Link, Flex } from "@chakra-ui/react";
import { FaLinkedin } from "react-icons/fa";

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
        
        <Link
          href="https://www.linkedin.com/in/chia-ming-hu-683382255/"
          isExternal
          display="flex"
          alignItems="center"
          color="gray.600"
          fontSize="sm"
          opacity={0.7}
          _hover={{ 
            opacity: 1,
            textDecoration: "none" 
          }}
          transition="opacity 0.2s"
          mt="auto"
          pt={4}
        >
          <FaLinkedin size={20} style={{ marginRight: "8px" }}/>
          <Text>Created by Chia-Ming Hu (Ken)</Text>
        </Link>
      </VStack>
    </Container>
  );
}

export default CommonLayout;