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
  const [isSecondDefinitionRevealed, setIsSecondDefinitionRevealed] = useState(false);
  const toast = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  const revealFirstLetter = () => {
    if (score >= 30 && !isFirstLetterRevealed) {
      const firstLetter = currentQuestion.question.charAt(0).toLowerCase();
      setAnswer(firstLetter);
      setScore(prev => prev - 30);
      setIsButtonDisabled(true);
      setIsFirstLetterRevealed(true);
      setShowScorePenalty(true);
      setTimeout(() => setShowScorePenalty(false), 750); // 0.75秒後隱藏 "-$30"
    } else if (score < 30) {
      toast({
        title: "Not enough money!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
  };

  const revealSecondDefinition = () => {
    if (score >= 30 && !isSecondDefinitionRevealed) {
      setScore(prev => prev - 30);
      setIsSecondDefinitionRevealed(true);
      setShowScorePenalty(true);
      setTimeout(() => setShowScorePenalty(false), 750); // 0.75秒後隱藏 "-$30"
    } else if (score < 30) {
      toast({
        title: "Not enough money!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
  };

  const skipQuestion = () => {
    setAnswer("");
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
    setIsButtonDisabled(false); // 重置按鈕狀態
    setIsFirstLetterRevealed(false); // 重置揭露狀態
    setIsSecondDefinitionRevealed(false); // 重置第二個定義揭露狀態
    toast({
      title: "Question skipped!",
      status: "info",
      duration: 1500,
      isClosable: true,
      position: "top"
    });
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
          setAnswer("");// 如果第一個字母是揭露的，且只有一個字母，則不刪除
        }
        
      } else if (e.key === 'ArrowLeft') {
        revealFirstLetter();
      } else if (e.key === 'ArrowDown') {
        revealSecondDefinition();
      } else if (e.key === 'ArrowRight') {
        skipQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [answer, currentQuestion.question.length, isFirstLetterRevealed, isSecondDefinitionRevealed]);

  useEffect(() => {
    if (answer.length === currentQuestion.question.length) {
      if (answer === currentQuestion.question) {
        toast({
          title: "Correct!",
          status: "success",
          duration: 1500,
          isClosable: true,
          position: "top"
        });
        setScore((prev) => prev + 100);
        setShowScoreBonus(true);
        setTimeout(() => setShowScoreBonus(false), 750); // 0.75秒後隱藏 "+$100"
        setAnswer("");
        setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
        setIsButtonDisabled(false); // 重置按鈕狀態
        setIsFirstLetterRevealed(false); // 重置揭露狀態
        setIsSecondDefinitionRevealed(false); // 重置第二個定義揭露狀態
      } else {
        toast({
          title: "Incorrect!",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top"
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
        <Text fontFamily="Comic Sans MS" color="pink.600" textShadow="2px 2px #FFA07A" fontSize="3xl" fontWeight="bold">
          #{currentQuestionIndex + 1}
        </Text>
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
              color="red.600"
            >
              - $30
            </Text>
          )}
        </Text>
      </Box>

      <Flex justify="center" mb={4}>
        <Box bg="pink.500" color="black" p={4} borderRadius="md">
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

      <Flex justify="center" mb={1} mt={10}>
        <Box bg="pink.500" color="black" p={4} borderRadius="md" mb={4} w="90%" maxW="700px" textAlign="center">
          <Text fontSize="lg" whiteSpace="pre-wrap" fontFamily="Comic Sans MS" color="yellow.300">{currentQuestion.definition1}</Text>
        </Box>
      </Flex>

      <Flex justify="center" mb={4}>
        <Box bg="pink.500" color="black" p={4} borderRadius="md" mb={2} w="90%" maxW="700px" textAlign="center" opacity={isSecondDefinitionRevealed ? 1 : 0.5}>
          <Text fontSize="lg" whiteSpace="pre-wrap" fontFamily="Comic Sans MS" color="yellow.300">{isSecondDefinitionRevealed ? currentQuestion.definition2 : "** another definition **"}</Text>
        </Box>
      </Flex>

      <Box p={4} borderRadius="md" mb={4} textAlign="center">
        <Text fontSize="lg" fontWeight="bold" fontFamily="Comic Sans MS" color="pink.500">🛎️ Options 🛎️</Text>
        <Flex justify="center">
          <Box textAlign="center">
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
            <Text
              position="relative"
              opacity={isButtonDisabled ? 0.5 : 1}
              _hover={{
                _after: {
                  content: '"Hotkey"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 2,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999,
                  fontWeight: "bold"
                }
              }}
            >
              ⬅️
            </Text>
          </Box>
          <Box textAlign="center">
            <Button
              size="md"
              colorScheme="yellow"
              borderRadius="full"
              boxShadow="md"
              m={2}
              position="relative"
              _hover={{
                _after: {
                  content: '"Show another definition (cost: $30)"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 16,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999
                }
              }}
              onClick={revealSecondDefinition}
              disabled={isSecondDefinitionRevealed}
            >
              📖
            </Button>
            <Text
              position="relative"
              opacity={isSecondDefinitionRevealed ? 0.5 : 1}
              _hover={{
                _after: {
                  content: '"Hotkey"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 2,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999,
                  fontWeight: "bold"
                }
              }}
            >
              ⬇️
            </Text>
          </Box>
          <Box textAlign="center">
            <Button
              size="md"
              colorScheme="red"
              borderRadius="full"
              boxShadow="md"
              m={2}
              position="relative"
              _hover={{
                _after: {
                  content: '"Skip this question"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 16,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999
                }
              }}
              onClick={skipQuestion}
            >
              ⏭️
            </Button>
            <Text
              position="relative"
              _hover={{
                _after: {
                  content: '"Hotkey"',
                  position: "absolute",
                  bg: "gray.700",
                  color: "white",
                  p: 2,
                  borderRadius: "md",
                  mt: 2,
                  fontSize: "sm",
                  whiteSpace: "nowrap",
                  zIndex: 9999,
                  fontWeight: "bold"
                }
              }}
            >
              ➡️
            </Text>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
}

export default SoloPlayPage;