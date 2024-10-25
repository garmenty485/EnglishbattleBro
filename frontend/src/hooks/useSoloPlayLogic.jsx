import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import useScoreManagement from './useScoreManagement'; 
import useQuestionControl from './useQuestionControl'; 
import useKeyboardControl from './useKeyboardControl'; 

function useSoloPlayLogic(userInfo) {
  const {
    score,
    showScoreBonus,
    showScorePenalty,
    addBonus,
    deductPenalty
  } = useScoreManagement();

  const {
    currentQuestion,
    currentQuestionIndex,
    isFirstLetterRevealed,
    isSecondDefinitionRevealed,
    revealFirstLetter,
    revealSecondDefinition,
    nextQuestion,
    isLastQuestion
  } = useQuestionControl();

  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (userInfo) {
      navigate('/loggedin');
    } else {
      navigate('/');
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

  // 使用鍵盤控制 hook
  useKeyboardControl({
    isModalOpen,
    answer,
    questionLength: currentQuestion.question.length,
    isFirstLetterRevealed,
    setAnswer,
    setShowHint,
    handleRevealLetter,
    handleRevealDefinition,
    handleSkipQuestion
  });

  // 移除原有的鍵盤事件 useEffect

  useEffect(() => {
    if (answer.length === currentQuestion.question.length) {
      if (answer === currentQuestion.question) {
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
  }, [answer, currentQuestion, toast, isFirstLetterRevealed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  return {
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
    revealLetter: handleRevealLetter,
    revealSecondDefinition: handleRevealDefinition,
    handleSkipQuestion,
    handleCloseModal
  };
}

export default useSoloPlayLogic;