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
  addBonus
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