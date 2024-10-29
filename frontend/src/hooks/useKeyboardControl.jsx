import { useEffect } from 'react';

function useKeyboardControl({
  isModalOpen,
  answer,
  questionLength,
  isLetterShown,
  setAnswer,
  setShowHint,
  showLetter,
  showDef,
  skipQuestion
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
          } else if (answer.length === 1 && !isLetterShown) {
            setAnswer("");
          }
        } else if (e.key === 'ArrowLeft') {
          showLetter();
        } else if (e.key === 'ArrowDown') {
          showDef();
        } else if (e.key === 'ArrowRight') {
          skipQuestion();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }
  }, [answer, questionLength, isLetterShown, isModalOpen]);
}

export default useKeyboardControl;