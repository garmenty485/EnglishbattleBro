import React from 'react';
import { useNavigate } from 'react-router-dom';
import CommonLayout from '../components/CommonLayout';
import CustomButton from '../components/CustomButton';
import useGoogleLoginLogic from '../hooks/useGoogleLoginLogic';

function HomePage({ onLogin }) {
  const navigate = useNavigate();
  const login = useGoogleLoginLogic(onLogin);

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
        text="Battle with Friend (Guest Mode)"
      />
    </CommonLayout>
  );
}

export default HomePage;