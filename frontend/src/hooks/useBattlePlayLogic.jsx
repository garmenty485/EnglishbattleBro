import useScoreManagement from './useScoreManagement'; 
import useQuestionControl from './useQuestionControl'; 
import useKeyboardControl from './useKeyboardControl'; 
import useGameState from './useGameState';
import useGameActions from './useGameActions';

function useBattlePlayLogic(userInfo, battleInfo) {
  const { socket, battleCode, socketId, questions } = battleInfo;

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
    isUpdating
  } = useQuestionControl(questions);

  const {
    skipQuestion,
    showLetter,
    showDef,
    answeredQuestions
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
    socket, 
    battleCode,
    socketId,
    questionIndex,
    isModalOpen,
    isUpdating
  });

  useKeyboardControl({
    isModalOpen,
    answer,
    questionLength: question?.question.length || 0,
    isLetterShown,
    setAnswer,
    setShowHint,
    showLetter,
    showDef,
    skipQuestion,
    isUpdating
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
    handleCloseModal,
    answeredQuestions,
    isUpdating
  };
}

export default useBattlePlayLogic;