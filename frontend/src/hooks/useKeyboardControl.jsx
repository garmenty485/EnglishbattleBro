import { useEffect } from 'react';

function useKeyboardControl({
  isModalOpen,
  answer,
  questionLength,
  isFirstLetterRevealed,
  setAnswer,
  setShowHint,
  handleRevealLetter,
  handleRevealDefinition,
  handleSkipQuestion
}) {
  useEffect(() => {
    if (!isModalOpen) {
      const handleKeyPress = (e) => {
        e.preventDefault();
        if (e.key.match(/^[a-z]$/i)) {
          if (answer.length < questionLength) {
            setAnswer(prev => prev + e.key.toLowerCase());
            setShowHint(false);
          }
        } else if (e.key === 'Backspace') {
          if (answer.length > 1) {
            setAnswer(prev => prev.slice(0, -1));
          } else if (answer.length === 1 && !isFirstLetterRevealed) {
            setAnswer("");
          }
        } else if (e.key === 'ArrowLeft') {
          handleRevealLetter();
        } else if (e.key === 'ArrowDown') {
          handleRevealDefinition();
        } else if (e.key === 'ArrowRight') {
          handleSkipQuestion();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [answer, questionLength, isFirstLetterRevealed, isModalOpen]);
}

export default useKeyboardControl;