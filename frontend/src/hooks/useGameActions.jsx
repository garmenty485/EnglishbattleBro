import { useEffect, useCallback } from 'react';
import { useToast } from "@chakra-ui/react";

function useGameActions({
  answer,
  setAnswer,
  isModalOpen,
  setIsModalOpen,
  question,
  isLastQuestion,
  isLetterShown,
  nextQuestion,
  showFirstLetter,
  showSecondDef,
  deductPenalty,
  addBonus,
  socket,  // 現在接收的是 Context 中的 socket
  battleCode,
  socketId,
  questionIndex
}) {
  const toast = useToast();

  // 將發送答案邏輯抽出為獨立函數
  const sendAnswer = useCallback((isCorrect) => {
    if (socket && battleCode) {
      console.log('Sending answer:', {
        roomCode: battleCode,
        socketId: socketId,
        questionIndex: questionIndex,
        isCorrect
      });
      socket.emit('answerSubmitted', {
        roomCode: battleCode,
        socketId: socketId,
        questionIndex: questionIndex,
        isCorrect
      });
    }
  }, [socket, battleCode, socketId, questionIndex]);

  const skipQuestion = () => {
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

  const showLetter = () => {
    const letter = showFirstLetter(deductPenalty);
    if (letter) {
      setAnswer(letter);
    }
  };

  const showDef = () => {
    showSecondDef(deductPenalty);
  };

  // 答案檢查
  useEffect(() => {
    if (!answer || !question) return;
    if (isModalOpen) return;
    
    if (answer.length === question.question.length) {
      if (answer === question.question) {
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
        setAnswer(isLetterShown ? question.question.charAt(0).toLowerCase() : "");
      }
    }
  }, [
    answer, 
    question, 
    isLetterShown, 
    sendAnswer, 
    isLastQuestion, 
    addBonus, 
    nextQuestion, 
    setAnswer, 
    setIsModalOpen,
    toast
  ]);

  return {
    skipQuestion,
    showLetter,
    showDef
  };
}

export default useGameActions;