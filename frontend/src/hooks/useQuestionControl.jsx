import { useState } from 'react';
import { useToast } from "@chakra-ui/react";
import questions from '../assets/questions.json';

function useQuestionControl() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFirstLetterRevealed, setIsFirstLetterRevealed] = useState(false);
  const [isSecondDefinitionRevealed, setIsSecondDefinitionRevealed] = useState(false);
  const toast = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  const revealFirstLetter = (deductPenalty) => {
    if (!isFirstLetterRevealed && deductPenalty()) {
      const firstLetter = currentQuestion.question.charAt(0).toLowerCase();
      setIsFirstLetterRevealed(true);
      return firstLetter;
    }
    return null;
  };

  const revealSecondDefinition = (deductPenalty) => {
    if (!isSecondDefinitionRevealed && deductPenalty()) {
      setIsSecondDefinitionRevealed(true);
      return true;
    }
    return false;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setIsFirstLetterRevealed(false);
      setIsSecondDefinitionRevealed(false);
      return true;
    }
    return false;
  };

  const resetQuestionState = () => {
    setIsFirstLetterRevealed(false);
    setIsSecondDefinitionRevealed(false);
  };

  const isLastQuestion = () => {
    return currentQuestionIndex === questions.length - 1;
  };

  return {
    currentQuestion,
    currentQuestionIndex,
    isFirstLetterRevealed,
    isSecondDefinitionRevealed,
    revealFirstLetter,
    revealSecondDefinition,
    nextQuestion,
    resetQuestionState,
    isLastQuestion
  };
}

export default useQuestionControl;