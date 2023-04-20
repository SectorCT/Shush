import React, { useState, useEffect, useContext } from 'react';

import { HomeStackNavigator, AuthStackNavigator } from './screens/routes.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from './AuthContext.js';
import { NavigationContainer } from '@react-navigation/native';

export default function Root() {
    const { loggedIn, checkIfLoggedIn } = useContext(AuthContext);

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    return (
        <>
            <NavigationContainer>
                {loggedIn ? <HomeStackNavigator /> : <AuthStackNavigator />}
            </NavigationContainer>
        </>
    );
}