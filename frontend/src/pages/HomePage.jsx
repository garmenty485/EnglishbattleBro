import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/react";
import CommonLayout from '../components/CommonLayout';
import CustomButton from '../components/CustomButton';
import BattleModal from '../components/BattleModal';
import { useUserInfo } from '../context/UserInforContext';
import { useGoogleLogin } from '@react-oauth/google';

const onLogin = async (tokenResponse) => {
  // 使用 Google API 获取用户信息
  const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: {
      Authorization: `Bearer ${tokenResponse.access_token}`,
    },
  });
  const userInfo = await userInfoResponse.json();

  // 将令牌信息添加到 userInfo 对象中
  const userInfoWithToken = {
    ...userInfo,
    token: tokenResponse.access_token, // 添加令牌
  };
  return userInfoWithToken
};

function HomePage() {
  const { setUserInfo } = useUserInfo();

  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const login = useGoogleLogin({
      onSuccess: async (tokenResponse) => {
        const userInfoWithToken = await onLogin(tokenResponse);
        setUserInfo(userInfoWithToken)

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('token', tokenResponse.access_token); // 存儲訪問令牌
        navigate('/loggedin');
      },
      onError: (error) => console.error('Login Failed:', error)
    })

  const handleSoloPlay = () => {
    navigate('/soloplay');
  };

  return (
    <CommonLayout>
      <CustomButton
        icon="🚀"
        text="Log in (Google Account)"
        onClick={login}
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