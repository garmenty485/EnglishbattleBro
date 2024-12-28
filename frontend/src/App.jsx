import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SocketProvider } from './context/SocketContext';
import HomePage from './pages/HomePage';
import LoggedInHomePage from './pages/LoggedInHomePage';
import SoloPlayPage from './pages/SoloPlayPage';
import BattlePage from './pages/BattlePage';
import RecordsPage from './pages/RecordsPage';
import { UserInfoProvider } from './context/UserInforContext';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <SocketProvider>
        <UserInfoProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/loggedin" element={<LoggedInHomePage />} />
              <Route path="/soloplay" element={<SoloPlayPage />} />
              <Route path="/battle" element={<BattlePage />} />
              <Route 
                path="/records" 
                element={
                  <RecordsPage  />
                } 
                />
            </Routes>
          </Router>
        </UserInfoProvider>
      </SocketProvider>
    </GoogleOAuthProvider>
  );
}

export default App;