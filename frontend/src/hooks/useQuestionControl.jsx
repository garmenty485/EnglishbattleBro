import { useState, useRef } from 'react';

function useQuestionControl(questions) {  // 接收题目数组作为参数
  const [questionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLetterShown, setIsFirstLetterRevealed] = useState(false);
  const [isDefShown, setIsSecondDefinitionRevealed] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);  // 新增狀態

  const question = questions.length > 0 ? questions[questionIndex] : null;

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
      setIsUpdating(true);  // 開始更新
      console.log('進入下一題:開始更新狀態');
      setCurrentQuestionIndex(prev => prev + 1);
      setIsFirstLetterRevealed(false);
      setIsSecondDefinitionRevealed(false);
      
      // 使用 setTimeout 確保狀態已更新
      setTimeout(() => {
        setIsUpdating(false);  // 更新完成
        console.log('進入下一題:更新完成');
      }, 100);
      
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
    isLastQuestion,
    isUpdating  // 導出新狀態
  };
}

export default useQuestionControl;