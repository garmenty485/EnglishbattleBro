import { Button, Text, Flex, Image } from "@chakra-ui/react";
import CommonLayout from './CommonLayout';

function LoggedInHomePage({ onSoloPlay }) {
  return (
    <CommonLayout>
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
      >
        <Flex align="center" justify="flex-start" width="100%">
          <Image src="https://pbs.twimg.com/media/GSzM-FkXoAAtfxm?format=jpg&name=small" boxSize="40px" borderRadius="full" mr={4} />
          <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
            Your Records & Words
          </Text>
        </Flex>
      </Button>
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
        onClick={onSoloPlay}
      >
        <Flex align="center" justify="flex-start" width="100%">
          <Text fontSize="3xl" mr={4}>🏃‍♀️</Text>
          <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
            Solo Play
          </Text>
        </Flex>
      </Button>
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
      >
        <Flex align="center" justify="flex-start" width="100%">
          <Text fontSize="3xl" mr={4}>⚔️</Text>
          <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
            Battle with Friend
          </Text>
        </Flex>
      </Button>
    </CommonLayout>
  );
}

export default LoggedInHomePage;