import useScoreManagement from './useScoreManagement'; 
import useQuestionControl from './useQuestionControl'; 
import useKeyboardControl from './useKeyboardControl'; 
import useGameState from './useGameState';
import useGameActions from './useGameActions';

function useSoloPlayLogic(userInfo) {
  const {
    answer,
    setAnswer,
    isModalOpen,
    setIsModalOpen,
    showHint,
    setShowHint,
    handleCloseModal,
  } = useGameState(userInfo);

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

  const {
    handleSkipQuestion,
    handleRevealLetter,
    handleRevealDefinition
  } = useGameActions({
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
  });

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