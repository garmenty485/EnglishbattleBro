import { useEffect, useCallback } from 'react';
import { useToast } from "@chakra-ui/react";

function useGameActions({
  answer,
  setAnswer,
  setIsModalOpen,
  currentQuestion,
  isLastQuestion,
  isFirstLetterRevealed,
  nextQuestion,
  revealFirstLetter,
  revealSecondDefinition,
  deductPenalty,
  addBonus,
  socket,  // 現在接收的是 Context 中的 socket
  battleCode,
  currentSocketId,
  currentQuestionIndex
}) {
  const toast = useToast();

  // 將發送答案邏輯抽出為獨立函數
  const sendAnswer = useCallback((isCorrect) => {
    if (socket && battleCode) {
      console.log('Sending answer:', {
        roomCode: battleCode,
        socketId: currentSocketId,
        questionIndex: currentQuestionIndex,
        isCorrect
      });
      socket.emit('answerSubmitted', {
        roomCode: battleCode,
        socketId: currentSocketId,
        questionIndex: currentQuestionIndex,
        isCorrect
      });
    }
  }, [socket, battleCode, currentSocketId, currentQuestionIndex]);

  const handleSkipQuestion = () => {
    if (isLastQuestion()) {
      setIsModalOpen(true);
    } else {
      nextQuestion();
      setAnswer("");
      toast({
        title: "Question skipped!",
        status: "info",
        duration: 1500,
        isClosable: true,
        position: "top"
      });
    }
  };

  const handleRevealLetter = () => {
    const letter = revealFirstLetter(deductPenalty);
    if (letter) {
      setAnswer(letter);
    }
  };

  const handleRevealDefinition = () => {
    revealSecondDefinition(deductPenalty);
  };

  // 答案檢查
  useEffect(() => {
    if (!answer || !currentQuestion) return;
    
    if (answer.length === currentQuestion.question.length) {
      if (answer === currentQuestion.question) {
        // 答對
        sendAnswer(true);
        addBonus();
        
        if (isLastQuestion()) {
          setIsModalOpen(true);
        } else {
          toast({
            title: "Correct!",
            status: "success",
            duration: 1500,
            isClosable: true,
            position: "top"
          });
          setAnswer("");
          nextQuestion();
        }
      } else {
        // 答錯也發送結果
        sendAnswer(false);
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
  }, [
    answer, 
    currentQuestion, 
    isFirstLetterRevealed, 
    sendAnswer, 
    isLastQuestion, 
    addBonus, 
    nextQuestion, 
    setAnswer, 
    setIsModalOpen,
    toast
  ]);

  return {
    handleSkipQuestion,
    handleRevealLetter,
    handleRevealDefinition
  };
}

export default useGameActions;