import React from 'react';
import { Image, useDisclosure } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import CommonLayout from '../components/CommonLayout';
import CustomButton from '../components/CustomButton';
import BattleModal from '../components/BattleModal';
import { useUserInfo } from '../context/UserInforContext';


function LoggedInHomePage() {
  const { userInfo } = useUserInfo();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleSoloPlay = () => {
    navigate('/soloplay');
  };

  return (
    <CommonLayout>
      <CustomButton
        icon={<Image src={userInfo?.picture} boxSize="40px" borderRadius="full" mr={4} />}
        text={`${userInfo?.name}'s Records & Words`}
        onClick={() => navigate('/records', { state: { userInfo } })}
      />
      <CustomButton
        icon="🏃‍♀️"
        text="Solo Play"
        onClick={handleSoloPlay}
      />
      <CustomButton
        icon="⚔️"
        text="Battle Mode (PvP)"
        onClick={onOpen}
      />

      <BattleModal
        isOpen={isOpen}
        onClose={onClose}
        userInfo={userInfo}
      />
    </CommonLayout>
  );
}

export default LoggedInHomePage;