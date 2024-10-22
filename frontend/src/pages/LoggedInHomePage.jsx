import React from 'react';
import { Image } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import CommonLayout from '../components/CommonLayout';
import CustomButton from '../components/CustomButton';

function LoggedInHomePage({ userInfo }) {
  const navigate = useNavigate();

  const handleSoloPlay = () => {
    navigate('/soloplay'); // 跳转到 SoloPlayPage
  };

  return (
    <CommonLayout>
      <CustomButton
        icon={<Image src={userInfo?.picture} boxSize="40px" borderRadius="full" mr={4} />}
        text={`${userInfo?.name}'s Records & Words`}
      />
      <CustomButton
        icon="🏃‍♀️"
        text="Solo Play"
        onClick={handleSoloPlay} // 绑定点击事件
      />
      <CustomButton
        icon="⚔️"
        text="Battle with Friend"
      />
    </CommonLayout>
  );
}

export default LoggedInHomePage;