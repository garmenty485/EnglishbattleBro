import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import questions from '../assets/questions.json';

function useSoloPlayLogic(userInfo) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [score, setScore] = useState(500); // 修改 score 的初始化
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
      setScore(prevScore => Number(prevScore) - 30); // 修改所有更新 score 的地方
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
      setScore(prevScore => Number(prevScore) - 30); // 修改所有更新 score 的地方
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
        // 先加分
        setScore(prevScore => Number(prevScore) + 100); // 修改所有更新 score 的地方
        setShowScoreBonus(true);
        setTimeout(() => setShowScoreBonus(false), 750);

        if (currentQuestionIndex === questions.length - 1) {
          // 最后一题答对后，显示模态框
          setTimeout(() => setIsModalOpen(true), 400); // 延迟显示模态框，确保加分动画完成
        } else {
          toast({
            title: "Correct!",
            status: "success",
            duration: 1500,
            isClosable: true,
            position: "top"
          });
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