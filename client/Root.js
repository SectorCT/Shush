import React, { useState, useEffect, useContext } from 'react';

import { HomeStackNavigator, AuthStackNavigator } from './screens/routes.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext, AuthContextProvider } from './AuthContext.js';

export default function Root() {
    const { loggedIn, checkIfLoggedIn } = useContext(AuthContext);


    // logic to check if the user is logged in
    useEffect(() => {
        checkIfLoggedIn();
    }, []);


    return (
        <>
            {loggedIn ? <HomeStackNavigator /> : <AuthStackNavigator />}
        </>
    );
}