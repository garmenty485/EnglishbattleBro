import { useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { SCORE_CONFIG } from '../constants/gameConfig';

function useScoreManagement() {
  const [score, setScore] = useState(SCORE_CONFIG.INITIAL_SCORE);
  const [showBonus, setShowScoreBonus] = useState(false);
  const [showPenalty, setShowScorePenalty] = useState(false);
  const toast = useToast();

  const addBonus = () => {
    setScore(prevScore => Number(prevScore) + SCORE_CONFIG.BONUS_AMOUNT);
    setShowScoreBonus(true);
    setTimeout(() => setShowScoreBonus(false), 750);
  };

  const deductPenalty = () => {
    if (score >= SCORE_CONFIG.PENALTY_AMOUNT) {
      setScore(prevScore => Number(prevScore) - SCORE_CONFIG.PENALTY_AMOUNT);
      setShowScorePenalty(true);
      setTimeout(() => setShowScorePenalty(false), 750);
      return true;
    } else {
      toast({
        title: "Not enough money!",
        status: "warning",
        duration: 2000,
        isClosable: true,
        position: "top"
      });
      return false;
    }
  };

  return {
    score,
    showBonus,
    showPenalty,
    addBonus,
    deductPenalty
  };
}

export default useScoreManagement;