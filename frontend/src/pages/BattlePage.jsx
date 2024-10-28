import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Text, Flex, Box, Container, Image } from "@chakra-ui/react";
import useSoloPlayLogic from '../hooks/useSoloPlayLogic'; // 假設你有類似的邏輯 hook
import GameOptionButton from '../components/GameOptionButton';
import GameResultModal from '../components/GameResultModal';
import DefinitionBox from '../components/DefinitionBox';
import AnswerInput from '../components/AnswerInput';
import ScoreDisplay from '../components/ScoreDisplay';

function BattlePage() {
  const location = useLocation();
  const { userInfo, battleCode, players, currentSocketId } = location.state || {};

  // 確定誰是對手
  const rival = players?.playerA.socketId === currentSocketId 
    ? players.playerB 
    : players.playerA;

  // 使用從 BattleModal 傳來的數據，而不是重新建立 socket 連接
  useEffect(() => {
    console.log('Battle Page Info:', {
      battleCode,
      currentPlayer: currentSocketId,
      players
    });
  }, [battleCode, currentSocketId, players]); // 確保依賴數據變化時才會重新執行

  const {
    currentQuestionIndex,
    answer,
    score,
    isFirstLetterRevealed,
    showScoreBonus,
    showScorePenalty,
    isSecondDefinitionRevealed,
    isModalOpen,
    showHint,
    currentQuestion,
    revealLetter,
    revealSecondDefinition,
    handleSkipQuestion,
    handleCloseModal
  } = useSoloPlayLogic(userInfo); // 使用類似的邏輯 hook

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
        {/* 左側：當前玩家 */}
        <Box>
          {userInfo ? (
            <Flex align="center" gap={2}>
              <Image src={userInfo.picture} boxSize="40px" borderRadius="full" />
            </Flex>
          ) : (
            <Flex align="center" gap={2}>
              <Text fontFamily="Comic Sans MS" color="pink.600" fontSize="xl" fontWeight="bold">
                Guest
              </Text>
            </Flex>
          )}
        </Box>

        {/* 中間：題號 */}
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

        {/* 右側：對手 */}
        <Box>
          {rival?.userInfo ? (
            <Flex align="center" gap={2}>
              <Text fontFamily="Comic Sans MS" color="red" fontSize="3xl" fontWeight="bold">
                Rival:
              </Text>
              <Image src={rival.userInfo.picture} boxSize="40px" borderRadius="full" />
            </Flex>
          ) : (
            <Flex align="center" gap={2}>
              <Text fontFamily="Comic Sans MS" color="red" fontSize="3xl" fontWeight="bold">
                Rival: Guest
              </Text>
            </Flex>
          )}
        </Box>
      </Flex>

      <ScoreDisplay
        score={score}
        showScoreBonus={showScoreBonus}
        showScorePenalty={showScorePenalty}
      />

      <AnswerInput
        answer={answer}
        currentQuestion={currentQuestion}
        isFirstLetterRevealed={isFirstLetterRevealed}
        showHint={showHint}
      />

      {/* 顯示對手已回答的提示 */}
      <Text fontSize="md" color="red" textAlign="center" mt={4}>
        Your rival got 3x scores for answering this question first! 😢
      </Text>

      <DefinitionBox
        definition={currentQuestion.definition1}
      />

      <DefinitionBox
        definition={currentQuestion.definition2}
        isSecondary
        isRevealed={isSecondDefinitionRevealed}
      />

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
            onClick={revealLetter}
            isDisabled={isFirstLetterRevealed}
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
            onClick={handleSkipQuestion}
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

export default BattlePage;