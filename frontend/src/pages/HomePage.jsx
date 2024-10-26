import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/react";
import CommonLayout from '../components/CommonLayout';
import CustomButton from '../components/CustomButton';
import BattleModal from '../components/BattleModal';
import useGoogleLoginLogic from '../hooks/useGoogleLoginLogic';

function HomePage({ onLogin }) {
  const navigate = useNavigate();
  const login = useGoogleLoginLogic(onLogin);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSoloPlay = () => {
    navigate('/soloplay');
  };

  return (
    <CommonLayout>
      <CustomButton
        icon="🚀"
        text="Log in (Google Account)"
        onClick={() => login()}
      />
      <CustomButton
        icon="🏃‍♀️"
        text="Solo Play (Guest Mode)"
        onClick={handleSoloPlay}
      />
      <CustomButton
        icon="⚔️"
        text="Battle Mode (Guest)"
        onClick={onOpen}
      />

      <BattleModal 
        isOpen={isOpen} 
        onClose={onClose}
        userInfo={null}
      />
    </CommonLayout>
  );
}

export default HomePage;