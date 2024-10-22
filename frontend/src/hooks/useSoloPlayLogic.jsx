import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import questions from '../assets/questions.json';

function useSoloPlayLogic() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(500);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [isFirstLetterRevealed, setIsFirstLetterRevealed] = useState(false);
  const [showScoreBonus, setShowScoreBonus] = useState(false);
  const [showScorePenalty, setShowScorePenalty] = useState(false);
  const [isSecondDefinitionRevealed, setIsSecondDefinitionRevealed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  const currentQuestion = questions[currentQuestionIndex];

  const revealFirstLetter = () => {
    if (score >= 30 && !isFirstLetterRevealed) {
      const firstLetter = currentQuestion.question.charAt(0).toLowerCase();
      setAnswer(firstLetter);
      setScore(prev => prev - 30);
      setIsButtonDisabled(true);
      setIsFirstLetterRevealed(true);
      setShowScorePenalty(true);
      setTimeout(() => setShowScorePenalty(false), 750);
    } else if (score < 30) {
      toast({
        title: "Not enough money!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
  };

  const revealSecondDefinition = () => {
    if (score >= 30 && !isSecondDefinitionRevealed) {
      setScore(prev => prev - 30);
      setIsSecondDefinitionRevealed(true);
      setShowScorePenalty(true);
      setTimeout(() => setShowScorePenalty(false), 750);
    } else if (score < 30) {
      toast({
        title: "Not enough money!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top"
      });
    }
  };

  const skipQuestion = () => {
    if (currentQuestionIndex === questions.length - 1) {
      setIsModalOpen(true);
    } else {
      setAnswer("");
      setCurrentQuestionIndex((prev) => (prev + 1));
      setIsButtonDisabled(false);
      setIsFirstLetterRevealed(false);
      setIsSecondDefinitionRevealed(false);
      toast({
        title: "Question skipped!",
        status: "info",
        duration: 1500,
        isClosable: true,
        position: "top"
      });
    }
  };

  useEffect(() => {
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
        revealFirstLetter();
      } else if (e.key === 'ArrowDown') {
        revealSecondDefinition();
      } else if (e.key === 'ArrowRight') {
        skipQuestion();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [answer, currentQuestion.question.length, isFirstLetterRevealed, isSecondDefinitionRevealed]);

  useEffect(() => {
    if (answer.length === currentQuestion.question.length) {
      if (answer === currentQuestion.question) {
        if (currentQuestionIndex === questions.length - 1) {
          setIsModalOpen(true);
        } else {
          toast({
            title: "Correct!",
            status: "success",
            duration: 1500,
            isClosable: true,
            position: "top"
          });
          setScore((prev) => prev + 100);
          setShowScoreBonus(true);
          setTimeout(() => setShowScoreBonus(false), 750);
          setAnswer("");
          setCurrentQuestionIndex((prev) => (prev + 1));
          setIsButtonDisabled(false);
          setIsFirstLetterRevealed(false);
          setIsSecondDefinitionRevealed(false);
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
  }, [answer, currentQuestion, toast, isFirstLetterRevealed, currentQuestionIndex]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (userInfo) {
      navigate('/loggedin');
    } else {
      navigate('/');
    }
  };

  return {
    currentQuestionIndex,
    answer,
    score,
    isButtonDisabled,
    isFirstLetterRevealed,
    showScoreBonus,
    showScorePenalty,
    isSecondDefinitionRevealed,
    isModalOpen,
    showHint,
    currentQuestion,
    revealFirstLetter,
    revealSecondDefinition,
    skipQuestion,
    handleCloseModal
  };
}

export default useSoloPlayLogic;