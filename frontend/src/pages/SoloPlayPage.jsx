import { Text, Flex, Box, Container, Button, Image } from "@chakra-ui/react";
import useSoloPlayLogic from '../hooks/useSoloPlayLogic';
import useSendRecord from '../hooks/useSendRecord';
import GameOptionButton from '../components/GameOptionButton';
import GameResultModal from '../components/GameResultModal';
import DefinitionBox from '../components/DefinitionBox';
import AnswerInput from '../components/AnswerInput';

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
      <AnswerInput 
        answer={answer}
        currentQuestion={currentQuestion}
        isFirstLetterRevealed={isFirstLetterRevealed}
        showHint={showHint}
      />

      {/* Definitions */}
      <DefinitionBox 
        definition={currentQuestion.definition1} 
      />
      
      <DefinitionBox 
        definition={currentQuestion.definition2}
        isSecondary
        isRevealed={isSecondDefinitionRevealed}
      />

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