import { Button, Flex, Text } from "@chakra-ui/react";

function CustomButton({ icon, text, onClick, ...props }) {
  return (
    <Button
      size="lg"
      colorScheme="pink"
      borderRadius="full"
      boxShadow="md"
      width="90%"
      maxW="350px"
      whiteSpace="normal"
      fontSize="lg"
      height="80px"
      onClick={onClick}
      {...props}
    >
      <Flex align="center" justify="flex-start" width="100%">
        <Text fontSize="3xl" mr={4}>{icon}</Text>
        <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
          {text}
        </Text>
      </Flex>
    </Button>
  );
}

export default CustomButton;