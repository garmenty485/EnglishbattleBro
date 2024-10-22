import React from 'react';
import { Button, Text, Flex } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import CommonLayout from './CommonLayout';

function HomePage({ onLogin }) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      await onLogin(tokenResponse);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/loggedin');
    },
    onError: (error) => console.error('Login Failed:', error)
  });

  const handleSoloPlay = () => {
    navigate('/soloplay');
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
        onClick={() => login()}
      >
        <Flex align="center" justify="flex-start" width="100%">
          <Text fontSize="3xl" mr={4}>🚀</Text>
          <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
            Log in <br /> (Google Account)
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
        onClick={handleSoloPlay}
      >
        <Flex align="center" justify="flex-start" width="100%">
          <Text fontSize="3xl" mr={4}>🏃‍♀️</Text>
          <Text fontFamily="Comic Sans MS" color="yellow.300" textAlign="center" flex="1">
            Solo Play <br /> (Guest Mode)
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
            Battle with Friend <br /> (Guest Mode)
          </Text>
        </Flex>
      </Button>
    </CommonLayout>
  );
}

export default HomePage;