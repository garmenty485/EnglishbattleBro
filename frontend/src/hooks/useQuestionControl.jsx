import { useState } from 'react';

function useQuestionControl(questions) {  // 接收题目数组作为参数
  const [questionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLetterShown, setIsFirstLetterRevealed] = useState(false);
  const [isDefShown, setIsSecondDefinitionRevealed] = useState(false);

  const question = questions[questionIndex];

  const showFirstLetter = (deductPenalty) => {
    if (!isLetterShown && deductPenalty()) {
      const firstLetter = question.question.charAt(0).toLowerCase();
      setIsFirstLetterRevealed(true);
      return firstLetter;
    }
    return null;
  };

  const showSecondDef = (deductPenalty) => {
    if (!isDefShown && deductPenalty()) {
      setIsSecondDefinitionRevealed(true);
      return true;
    }
    return false;
  };

  const nextQuestion = () => {
    if (questionIndex < questions.length - 1) {
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
    return questionIndex === questions.length - 1;
  };

  return {
    question,
    questionIndex,
    isLetterShown,
    isDefShown,
    showFirstLetter,
    showSecondDef,
    nextQuestion,
    resetQuestionState,
    isLastQuestion
  };
}

export default useQuestionControl;