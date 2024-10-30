import { useEffect, useCallback, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { SCORE_CONFIG } from '../constants/gameConfig';

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
  const [answeredQuestions, setAnsweredQuestions] = useState(new Map());

  // 監聽對手答題狀態
  useEffect(() => {
    if (!socket) return;
    
    socket.on('rivalAnswered', ({ questionIndex, isCorrect }) => {
      if (isCorrect) {
        setAnsweredQuestions(prev => new Map(prev).set(questionIndex, true));
      }
    });

    return () => {
      socket?.off('rivalAnswered');
    };
  }, [socket]);

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
        
        // 檢查對手是否已經答對這題
        const rivalAnsweredCorrect = answeredQuestions.get(questionIndex);
        
        // 根據對手答題情況決定加分
        addBonus(rivalAnsweredCorrect ? SCORE_CONFIG.BONUS_AMOUNT : SCORE_CONFIG.FIRST_BONUS_AMOUNT);
        
        if (isLastQuestion()) {
          setIsModalOpen(true);
        } else {
          toast({
            title: rivalAnsweredCorrect ? "Correct! (+$100)" : "Faster than rival and correct! (+$300)",
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
    toast,
    questionIndex,
    answeredQuestions
  ]);

  return {
    skipQuestion,
    showLetter,
    showDef,
    answeredQuestions
  };
}

export default useGameActions;