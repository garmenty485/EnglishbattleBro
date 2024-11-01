import useScoreManagement from './useScoreManagement'; 
import useQuestionControl from './useQuestionControl'; 
import useKeyboardControl from './useKeyboardControl'; 
import useGameState from './useGameState';
import useGameActions from './useGameActions';

function useSoloPlayLogic(userInfo, questions) {
  // 添加空值檢查，如果 questions 為空，返回默認值
  if (!questions) {
    return {
      questionIndex: 0,
      score: 0,
      isModalOpen: false,
      answer: '',
      isLetterShown: false,
      showBonus: false,
      showPenalty: false,
      isDefShown: false,
      showHint: false,
      question: null,
      revealLetter: () => {},
      showSecondDef: () => {},
      skipQuestion: () => {},
      handleCloseModal: () => {}
    };
  }

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
    isLastQuestion,
    isUpdating  // 添加 isUpdating
  } = useQuestionControl(questions);

  const {
    skipQuestion,
    showLetter,
    showDef
  } = useGameActions({
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
    isUpdating  // 傳入 isUpdating
  });

  useKeyboardControl({
    isModalOpen,
    answer,
    questionLength: question?.question?.length || 0,  // 添加空值檢查
    isLetterShown,
    setAnswer,
    setShowHint,
    showLetter,
    showDef,
    skipQuestion,
    isUpdating  // 傳入 isUpdating
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