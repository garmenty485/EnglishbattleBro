import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let serverUrl;
    if (process.env.NODE_ENV === 'production') {
      serverUrl = 'https://englishbattlebro.onrender.com';
    } else {
      serverUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:5000'
        : `http://${window.location.hostname}:5000`;
    }

    const newSocket = io(serverUrl, {
      transports: ['websocket'],
      upgrade: false
    });
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);