import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import questions from '../assets/questions.json';
import { SCORE_CONFIG } from '../constants/gameConfig';
import useScoreManagement from './useScoreManagement'; // 假設有這個 hook
import useQuestionControl from './useQuestionControl'; // 假設有這個 hook

function useSoloPlayLogic(userInfo) {
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

  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (userInfo) {
      navigate('/loggedin');
    } else {
      navigate('/');
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

  useEffect(() => {
    if (!isModalOpen) {
      const handleKeyPress = (e) => {
        e.preventDefault();
        if (e.key.match(/^[a-z]$/i)) {
          if (answer.length < currentQuestion.question.length) {
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

      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, [answer, currentQuestion.question.length, isFirstLetterRevealed, isSecondDefinitionRevealed, isModalOpen]);

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
  }, [answer, currentQuestion, toast, isFirstLetterRevealed]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

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