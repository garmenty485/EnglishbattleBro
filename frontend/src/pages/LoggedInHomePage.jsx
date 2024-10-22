import React from 'react';
import { Button, Text, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import CommonLayout from './CommonLayout';

function LoggedInHomePage({ userInfo }) {
  const navigate = useNavigate();

  const handleSoloPlay = () => {
    navigate('/soloplay'); // 跳转到 SoloPlayPage
  };

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
          <Image src={userInfo?.picture} boxSize="40px" borderRadius="full" mr={4} />
          <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
            {userInfo?.name}'s Records & Words
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
        onClick={handleSoloPlay} // 绑定点击事件
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