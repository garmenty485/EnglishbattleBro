import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import LoggedInHomePage from './pages/LoggedInHomePage';
import SoloPlayPage from './pages/SoloPlayPage';
import BattlePage from './pages/BattlePage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  const handleLogin = async (tokenResponse) => {
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

    setUserInfo(userInfoWithToken);
    setIsLoggedIn(true);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage onLogin={handleLogin} />} />
            <Route path="/loggedin" element={<LoggedInHomePage userInfo={userInfo} />} />
            <Route path="/soloplay" element={<SoloPlayPage userInfo={userInfo} />} />
            <Route path="/battle" element={<BattlePage />} />
          </Routes>
        </Router>
      </SocketProvider>
    </GoogleOAuthProvider>
  );
}

export default App;