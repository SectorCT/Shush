import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

import { SERVER_IP } from '@env';

const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);

    async function checkIfLoggedIn() {
        AsyncStorage.getItem('refreshToken').then((userToken) => {
            if (userToken !== null) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
        });
    }

    function signup(password, confirmPassword) {
        try {
            if (password === confirmPassword) {
                fetch(`http://${SERVER_IP}:8000/authentication/signup/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        password: password,
                    }),
                }).then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            if (data.success !== true) {
                                console.log(data.message);
                                return;
                            }
                            AsyncStorage.setItem("refreshToken", data.refresh_token).then(() => {
                                AsyncStorage.setItem("userToken", data.token).then(() => {
                                    checkIfLoggedIn();
                                });
                            });
                        });
                    } else {
                        console.log('Error creating account:', response.status, response.message);
                    }
                });
            } else {
                console.log('Passwords do not match');
            }
        } catch (error) {
            console.log(error);
        }
    }

    function login(token, password) {
        try {
            fetch(`http://${SERVER_IP}:8000/authentication/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    password: password,
                }),
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        AsyncStorage.setItem("accessToken", data.access_token).then(() => {
                            AsyncStorage.setItem("refreshToken", data.refresh_token).then(() => {
                                AsyncStorage.setItem("userToken", token).then(() => {
                                    checkIfLoggedIn();
                                });
                            });
                        });
                    });
                } else {
                    console.log('Error logging in:', response.status, response.message);
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    function logout() {
        try {
            AsyncStorage.getItem('refreshToken').then((refreshToken) => {
                fetch(`http://${SERVER_IP}:8000/authentication/logout/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        refresh_token: refreshToken,
                    }),
                }).then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            AsyncStorage.removeItem('accessToken');
                            AsyncStorage.removeItem('refreshToken');
                            checkIfLoggedIn();
                        });
                    } else {
                        console.log('Error logging out:', response.status, response.message);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <AuthContext.Provider value={{ loggedIn, login, signup, logout, checkIfLoggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };