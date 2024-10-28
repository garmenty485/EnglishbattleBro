import { useEffect } from 'react';
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
  socket,  // 新增 socket 參數
  battleCode,  // 新增 battleCode 參數
  currentSocketId,  // 新增 currentSocketId 參數
  currentQuestionIndex  // 新增 currentQuestionIndex 參數
}) {
  const toast = useToast();

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

  // 答案检查
  useEffect(() => {
    if (answer.length === currentQuestion.question.length) {
      if (answer === currentQuestion.question) {
        // 答對時，發送答題結果到服務器
        if (socket.current) {
          socket.current.emit('answerSubmitted', {
            roomCode: battleCode,
            socketId: currentSocketId,
            questionIndex: currentQuestionIndex,
            isCorrect: true
          });
        }

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
  }, [answer, currentQuestion, isFirstLetterRevealed]);

  return {
    handleSkipQuestion,
    handleRevealLetter,
    handleRevealDefinition
  };
}

export default useGameActions;