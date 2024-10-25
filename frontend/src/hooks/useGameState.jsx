import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';

function useGameState(userInfo) {
  const [answer, setAnswer] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showHint, setShowHint] = useState(true);
  const navigate = useNavigate();

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (userInfo) {
      navigate('/loggedin');
    } else {
      navigate('/');
    }
  };

  // 提示计时器
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHint(false);
    }, 15000);
    return () => clearTimeout(timer);
  }, []);

  return {
    answer,
    setAnswer,
    isModalOpen,
    setIsModalOpen,
    showHint,
    setShowHint,
    handleCloseModal,
  };
}

export default useGameState;