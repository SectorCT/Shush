import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [refreshChats, setRefreshChats] = useState(null);

    // logic to check if the user is logged in
    const checkIfLoggedIn = async () => {
        const token = await AsyncStorage.getItem('authCookie');
        if (token) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    };

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, checkIfLoggedIn, refreshChats, setRefreshChats }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };