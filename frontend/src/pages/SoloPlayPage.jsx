import { Text, Flex, Box, Container, Button, Image, Center, Spinner, useToast } from "@chakra-ui/react";
import { useRef, useEffect, useState } from 'react';
import useSoloPlayLogic from '../hooks/useSoloPlayLogic';
import useSendRecord from '../hooks/useSendRecord';
import GameOptionButton from '../components/GameOptionButton';
import GameResultModal from '../components/GameResultModal';
import DefinitionBox from '../components/DefinitionBox';
import AnswerInput from '../components/AnswerInput';
import ScoreDisplay from '../components/ScoreDisplay';

function SoloPlayPage({ userInfo }) {
  const [questions, setQuestions] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const fetchedRef = useRef(false);
  
  // 始終調用 hook，但傳入空數組作為預設值
  const gameLogic = useSoloPlayLogic(userInfo, questions || []);

  useSendRecord(gameLogic?.isModalOpen || false, gameLogic?.score || 0, userInfo, 'solo', null, null, questions);

  useEffect(() => {
    const fetchQuestions = async () => {
      if (fetchedRef.current) return; // 如果已經獲取過，直接返回
      fetchedRef.current = true;

      try {
        console.log('開始獲取題目...');
        const response = await fetch('/api/questions/random?count=10');
        console.log('API 響應狀態:', response.status);
        
        if (!response.ok) throw new Error('Failed to fetch questions');
        const data = await response.json();
        console.log('獲取到的題目:', data);
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid questions data');
        }
        
        setQuestions(data);
        console.log('題目設置完成');
      } catch (error) {
        console.error('Error fetching questions:', error);
        toast({
          title: "Error",
          description: "Failed to load questions", 
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, [toast]);

  // 修改加載條件
  if (isLoading || !questions) {
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  // 使用 useSendRecord hook


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
            #{gameLogic.questionIndex + 1}
          </Text>
        </Flex>
      </Flex>

      {gameLogic && (
        <ScoreDisplay 
          score={gameLogic.score}
          showBonus={gameLogic.showBonus}
          showPenalty={gameLogic.showPenalty}
        />
      )}

      {gameLogic && (
        <AnswerInput 
          answer={gameLogic.answer}
          question={gameLogic.question}
          isLetterShown={gameLogic.isLetterShown}
          showHint={gameLogic.showHint}
        />
      )}

      {gameLogic && (
        <DefinitionBox 
          definition={gameLogic.question.definition1} 
        />
      )}
      
      {gameLogic && (
        <DefinitionBox 
          definition={gameLogic.question.definition2}
          isSecondary
          isRevealed={gameLogic.isDefShown}
        />
      )}

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
            onClick={gameLogic.revealLetter}
            isDisabled={gameLogic.isLetterShown}
            colorScheme="teal"
          />
          
          <GameOptionButton
            icon="📖"
            tooltipText="Show another definition (cost: $30)"
            hotKeyIcon="⬇️"
            onClick={gameLogic.showSecondDef}
            isDisabled={gameLogic.isDefShown}
            colorScheme="yellow"
          />
          
          <GameOptionButton
            icon="⏭️"
            tooltipText="Skip this question"
            hotKeyIcon="➡️"
            onClick={gameLogic.skipQuestion}
            colorScheme="red"
          />
        </Flex>
      </Box>

      {gameLogic && (
        <GameResultModal 
          isOpen={gameLogic.isModalOpen}
          onClose={gameLogic.handleCloseModal}
          score={gameLogic.score}
        />
      )}
    </Container>
  );
}

export default SoloPlayPage;