import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import CommonLayout from '../components/CommonLayout';
import CustomButton from '../components/CustomButton';

function HomePage({ onLogin }) {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login Success:', tokenResponse);
      await onLogin(tokenResponse);
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/loggedin');
    },
    onError: (error) => console.error('Login Failed:', error)
  });

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