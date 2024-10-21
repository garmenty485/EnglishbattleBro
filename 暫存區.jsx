import { Box, Text, VStack, Button, Flex, Input } from "@chakra-ui/react";
import CommonLayout from './CommonLayout';

function SoloPlayPage() {
  return (
    <CommonLayout>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Solo Play Mode</Text>

      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="lg">Number of the question</Text>
        <Box bg="blue.500" color="white" px={3} py={1} borderRadius="md">7</Box>
      </Flex>

      <Input placeholder="Player's answer" size="lg" mb={4} />

      <Box bg="green.500" color="white" p={4} borderRadius="md" mb={4}>
        the main meal of the day, taken either around midday or in the evening; a formal evening meal, typically one in honor of a person or event
      </Box>

      <Box bg="yellow.400" color="white" p={4} borderRadius="md" mb={4}>
        <Text fontSize="2xl">Score</Text>
        <Text fontSize="4xl" fontWeight="bold">500</Text>
      </Box>

      <Box bg="blue.200" p={4} borderRadius="md" mb={4}>
        <Text fontSize="lg" fontWeight="bold">Tips: costs</Text>
        <Text>Reveal a word: 50</Text>
        <Text>Reveal 2 words: 75</Text>
      </Box>

      <Button colorScheme="teal" size="lg">Submit Answer</Button>
    </CommonLayout>
  );
}

export default SoloPlayPage;

------XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

import { Text, VStack, Flex, useToast, Box, Container, Button } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import questions from './questions.json';
import StyledBox from '../components/StyledBox';

function SoloPlayPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(500);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFirstLetterRevealed, setIsFirstLetterRevealed] = useState(false);
  const [showScoreBonus, setShowScoreBonus] = useState(false);
  const [showScorePenalty, setShowScorePenalty] = useState(false);
  const toast = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  const revealFirstLetter = () => {
    if (score >= 30) {
      const firstLetter = currentQuestion.question.charAt(0).toLowerCase();
      setAnswer(firstLetter);
      setScore(prev => prev - 30);
      setIsButtonDisabled(true);
      setIsFirstLetterRevealed(true);
      setShowScorePenalty(true);
      setTimeout(() => setShowScorePenalty(false), 750); // 0.75秒後隱藏 "-$30"
    } else {
      toast({
        title: "Not enough money!",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      e.preventDefault();
      if (e.key.match(/^[a-z]$/i)) {
        if (answer.length < currentQuestion.question.length) {
          setAnswer(prev => prev + e.key.toLowerCase());
        }
      } else if (e.key === 'Backspace') {
        // 根據不同情況處理刪除邏輯
        if (answer.length > 1) {
          setAnswer(prev => prev.slice(0, -1));
        } else if (answer.length === 1 && !isFirstLetterRevealed) {
          setAnswer("");
        }
        // 如果第一個字母是揭露的，且只有一個字母，則不刪除
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [answer, currentQuestion.question.length, isFirstLetterRevealed]);

  useEffect(() => {
    if (answer.length === currentQuestion.question.length) {
      if (answer === currentQuestion.question) {
        toast({
          title: "Correct!",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        setScore((prev) => prev + 100);
        setShowScoreBonus(true);
        setTimeout(() => setShowScoreBonus(false), 750); // 0.75秒後隱藏 "+$100"
        setAnswer("");
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
        setIsButtonDisabled(false); // 重置按鈕狀態
        setIsFirstLetterRevealed(false); // 重置揭露狀態
      } else {
        toast({
          title: "Incorrect!",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        setAnswer(isFirstLetterRevealed ? currentQuestion.question.charAt(0).toLowerCase() : "");
      }
    }
  }, [answer, currentQuestion, toast, isFirstLetterRevealed]);

  return (
    <Container
      maxWidth="500px"
      width="100%"
      margin="0 auto"
      padding="20px"
      border="4px solid"
      borderColor="black"
      borderRadius="8px"
      minH="90vh"
      bg="yellow.100"
    >
      <Flex justify="center" align="center" mb={4}>
        <Box bg="blue.500" color="black" px={3} py={1} borderRadius="md" fontSize="2xl" fontWeight="bold">#{currentQuestionIndex + 1}</Box>
      </Flex>

      <Box bg="yellow.400" color="white" p={4} borderRadius="md" mb={4} w="450px">
        <Text fontSize="3xl">
          💰 <Text as="span" fontWeight="bold" color="black">{score}</Text>
          {showScoreBonus && (
            <Text
              as="span"
              fontWeight="bold"
              ml={2}
              bgGradient="linear(to-r, red.500, yellow.500, green.500, blue.500, purple.500)"
              bgClip="text"
            >
              + $100
            </Text>
          )}
          {showScorePenalty && (
            <Text
              as="span"
              fontWeight="bold"
              ml={2}
              color="red.500"
            >
              - $30
            </Text>
          )}
        </Text>
      </Box>

      <Flex justify="center" mb={4}>
        <Box bg="black" color="white" p={4} borderRadius="md">
          <Text fontSize="2xl" letterSpacing={4}>
            {isFirstLetterRevealed ? (
              <Text as="span" color="gold" fontWeight="bold">{answer.charAt(0)}</Text>
            ) : (
              answer.charAt(0)
            )}
            {answer.slice(1)}
            {Array(currentQuestion.question.length - answer.length).fill("_").join("")}
          </Text>
        </Box>
      </Flex>

      <Flex justify="center" mb={4}>
        <Box bg="black" color="white" p={4} borderRadius="md" mb={4} w="90%" maxW="700px" textAlign="center">
          <Text fontSize="lg" whiteSpace="pre-wrap">{currentQuestion.hint}</Text>
        </Box>
      </Flex>

      <Box bg="blue.200" p={4} borderRadius="md" mb={4} textAlign="center">
        <Text fontSize="lg" fontWeight="bold">🛎️ Your options 🛎️</Text>
        <Button
          size="md"
          colorScheme="teal"
          borderRadius="full"
          boxShadow="md"
          m={2}
          position="relative"
          _hover={{
            _after: {
              content: '"Reveal a letter (cost: $30)"',
              position: "absolute",
              bg: "gray.700",
              color: "white",
              p: 2,
              borderRadius: "md",
              mt: 16,
              fontSize: "sm",
              whiteSpace: "nowrap",
              zIndex: 9999 // 設置最高優先級，確保不被覆蓋
            }
          }}
          onClick={revealFirstLetter}
          disabled={isButtonDisabled}
        >
          💡
        </Button>
        <Button
          size="md"
          colorScheme="teal"
          borderRadius="full"
          boxShadow="md"
          m={2}
        >
          test button
        </Button>
      </Box>
    </Container>
  );
}

export default SoloPlayPage;