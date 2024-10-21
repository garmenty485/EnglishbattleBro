import { useState } from "react";
import HomePage from './pages/HomePage';
import LoggedInHomePage from './pages/LoggedInHomePage';
import SoloPlayPage from './pages/SoloPlayPage';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSoloPlay, setIsSoloPlay] = useState(false);

  if (isSoloPlay) {
    return <SoloPlayPage />;
  }

  return (
    isLoggedIn
      ? <LoggedInHomePage onSoloPlay={() => setIsSoloPlay(true)} />
      : <HomePage onLogin={() => setIsLoggedIn(true)} onSoloPlay={() => setIsSoloPlay(true)} />
  );
}

export default App;