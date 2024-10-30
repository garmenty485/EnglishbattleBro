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
    showBonus,
    showPenalty,
    addBonus,
    deductPenalty
  } = useScoreManagement();

  const {
    question,
    questionIndex,
    isLetterShown,
    isDefShown,
    showFirstLetter,
    showSecondDef,
    nextQuestion,
    isLastQuestion
  } = useQuestionControl();

  const {
    skipQuestion,
    showLetter,
    showDef
  } = useGameActions({
    answer,
    setAnswer,
    setIsModalOpen,
    question,
    isLastQuestion,
    isLetterShown,
    nextQuestion,
    showFirstLetter,
    showSecondDef,
    deductPenalty,
    addBonus,
    isModalOpen
  });

  useKeyboardControl({
    isModalOpen,
    answer,
    questionLength: question.question.length,
    isLetterShown,
    setAnswer,
    setShowHint,
    showLetter,
    showDef,
    skipQuestion
  });

  return {
    questionIndex,
    answer,
    score,
    isLetterShown,
    showBonus,
    showPenalty,
    isDefShown,
    isModalOpen,
    showHint,
    question,
    revealLetter: showLetter,
    showSecondDef: showDef,
    skipQuestion,
    handleCloseModal
  };
}

export default useSoloPlayLogic;