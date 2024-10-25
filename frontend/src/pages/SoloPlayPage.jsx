import { Text, Flex, Box, Container, Button, Image } from "@chakra-ui/react";
import useSoloPlayLogic from '../hooks/useSoloPlayLogic';
import useSendRecord from '../hooks/useSendRecord';
import GameOptionButton from '../components/GameOptionButton';
import GameResultModal from '../components/GameResultModal';

function SoloPlayPage({ userInfo }) {
  const {
    currentQuestionIndex,
    answer,
    score,
    isButtonDisabled,
    isFirstLetterRevealed,
    showScoreBonus,
    showScorePenalty,
    isSecondDefinitionRevealed,
    isModalOpen,
    showHint,
    currentQuestion,
    revealFirstLetter,
    revealSecondDefinition,
    skipQuestion,
    handleCloseModal
  } = useSoloPlayLogic(userInfo);

  // 使用 useSendRecord hook
  useSendRecord(isModalOpen, score, userInfo);

  return (
    <Container
      maxWidth={{ base: "95%", md: "500px" }}
      width="100%"
      margin="0 auto"
      padding={{ base: "10px", md: "20px" }}
      border="4px solid"
      borderColor="black"
      borderRadius="8px"
      minH={{ base: "100vh", md: "90vh" }}
      bg="yellow.100"
    >
      {/* 视图代码保持不变 */}
      <Flex justify="space-between" align="center" mb={4} position="relative">
        <Box>
          {userInfo ? (
            <Image src={userInfo.picture} boxSize="40px" borderRadius="full" />
          ) : (
            <Text fontFamily="Comic Sans MS" color="pink.600" fontSize="xl" fontWeight="bold">
              Guest Mode
            </Text>
          )}
        </Box>
        <Flex
          position="absolute"
          left="50%"
          transform="translateX(-50%)"
          justify="center"
          align="center"
        >
          <Text fontFamily="Comic Sans MS" color="pink.600" textShadow="2px 2px #FFA07A" fontSize="3xl" fontWeight="bold">
            #{currentQuestionIndex + 1}
          </Text>
        </Flex>
      </Flex>

      {/* Score Display */}
      <Box 
        bg="yellow.400" 
        color="white" 
        p={4} 
        borderRadius="md" 
        mb={4} 
        w={{ base: "100%", md: "450px" }}
      >
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

      {/* Answer Input Area */}
      <Flex justify="center" mb={4} position="relative">
        <Box 
          bg="pink.500" 
          color="black" 
          p={{ base: 2, md: 4 }} 
          borderRadius="md" 
          width={{ base: "100%", md: "auto" }}
        >
          <Text 
            fontSize={{ base: "xl", md: "2xl" }}
            letterSpacing={{ base: 2, md: 4 }}
            minH={{ base: "32px", md: "40px" }}
            pointerEvents="none" 
            width="100%" 
            textAlign="center"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {isFirstLetterRevealed ? (
              <Text as="span" color="gold" fontWeight="bold">{answer.charAt(0)}</Text>
            ) : (
              answer.charAt(0)
            )}
            {answer.slice(1)}
            {Array(currentQuestion.question.length - answer.length).fill("_").join("")}
          </Text>
          <Box
            as="input"
            position="absolute"
            top={0}
            left={0}
            width="100%"
            height="100%"
            opacity={0}
            type="text"
            autoComplete="off"
            onFocus={(e) => {
              e.target.style.transform = 'translateY(-100vh)';
              e.target.style.position = 'absolute';
            }}
            onBlur={(e) => {
              e.target.style.transform = 'none';
              e.target.style.position = 'absolute';
            }}
          />
        </Box>
        {showHint && (
          <Box position="absolute" right="-20px" top="-30%" transform="translateY(-50%)" bg="green.500" color="black" p={2} borderRadius="md" border="2px solid white" boxShadow="5px 5px 0px #000">
            Type the Answer
          </Box>
        )}
      </Flex>

      {/* Definitions */}
      <Flex justify="center" mb={1} mt={{ base: 6, md: 10 }}>
        <Box 
          bg="pink.500" 
          p={{ base: 3, md: 4 }} 
          borderRadius="md" 
          w={{ base: "100%", md: "90%" }}
          textAlign="center"
        >
          <Text fontSize={{ base: "md", md: "lg" }} whiteSpace="pre-wrap" fontFamily="Comic Sans MS" color="yellow.300" minH={{ base: "50px", md: "60px" }}>
            {currentQuestion.definition1}
          </Text>
        </Box>
      </Flex>

      <Flex justify="center" mb={4}>
        <Box bg="pink.500" color="black" p={4} borderRadius="md" mb={2} w="90%" maxW="700px" textAlign="center" opacity={isSecondDefinitionRevealed ? 1 : 0.5}>
          <Text fontSize="lg" whiteSpace="pre-wrap" fontFamily="Comic Sans MS" color="yellow.300" minH={{ base: "50px", md: "60px" }}>
            {isSecondDefinitionRevealed ? currentQuestion.definition2 : "** another definition **"}
          </Text>
        </Box>
      </Flex>

      {/* Options */}
      <Box w={{ base: "365px", sm: "370px", md: "370px" }} maxW="95%" p={{ base: 2, md: 4 }} textAlign="center" mx="auto">
        <Text fontSize="lg" fontWeight="bold" fontFamily="Comic Sans MS" color="pink.500">
          🛎️ Options 🛎️
        </Text>
        <Flex 
          justify="center" 
          flexWrap={{ base: "wrap", md: "nowrap" }}
          gap={{ base: 2, md: 4 }}
        >
          <GameOptionButton
            icon="💡"
            tooltipText="Reveal a letter (cost: $30)"
            hotKeyIcon="⬅️"
            onClick={revealFirstLetter}
            isDisabled={isButtonDisabled}
            colorScheme="teal"
          />
          
          <GameOptionButton
            icon="📖"
            tooltipText="Show another definition (cost: $30)"
            hotKeyIcon="⬇️"
            onClick={revealSecondDefinition}
            isDisabled={isSecondDefinitionRevealed}
            colorScheme="yellow"
          />
          
          <GameOptionButton
            icon="⏭️"
            tooltipText="Skip this question"
            hotKeyIcon="➡️"
            onClick={skipQuestion}
            colorScheme="red"
          />
        </Flex>
      </Box>

      <GameResultModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        score={score}
      />
    </Container>
  );
}

export default SoloPlayPage;