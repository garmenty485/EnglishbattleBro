import React, { createContext, useContext, useState } from 'react';

const UserInfoContext = createContext(null);

export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState(null);

    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};

export const useUserInfo = () => {
    const context = useContext(UserInfoContext);
    if (!context) {
        throw new Error('useUserInfo must be used within a UserInfoProvider');
    }
    return context;
};
