import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

import { SERVER_IP } from '@env';

const AuthContextProvider = ({ children }) => {
    const [loggedIn, setLoggedIn] = useState(false);



    console.log('AuthContext:', SERVER_IP);

    // logic to check if the user is logged in
    const checkIfLoggedIn = () => {
        try {
            AsyncStorage.getItem('authCookie').then((value) => {
                fetch(`http://${SERVER_IP}:8000/authentication/verify_session/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': value,
                    },
                }).then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            setLoggedIn(true);
                        });
                    } else {
                        setLoggedIn(false);
                    }
                });
            });
        } catch (error) {
            console.log(error);
        }
    };

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
                        const authCookie = response.headers.get('set-cookie');
                        console.log(authCookie);
                        response.json().then((data) => {
                            AsyncStorage.setItem("authCookie", authCookie).then(() => {
                                AsyncStorage.setItem("userToken", data.token).then(() => {
                                    checkIfLoggedIn();
                                });
                            });
                        });

                    } else {
                        console.log('Error');
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
                    const authCookie = response.headers.get('set-cookie');
                    response.json().then((data) => {
                        AsyncStorage.setItem("authCookie", authCookie).then(() => {
                            AsyncStorage.setItem("userToken", data.token).then(() => {
                                checkIfLoggedIn();
                            });
                        });
                    });
                } else {
                    console.log('Error');
                }
            });
        } catch (error) {
            console.log(error);
        }
    };

    function logout() {
        try {
            fetch(`http://${SERVER_IP}:8000/authentication/logout/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        AsyncStorage.removeItem('authCookie').then(() => {
                            checkIfLoggedIn();
                        });
                    });
                } else {
                    console.error('Error');
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        checkIfLoggedIn();
    }, []);

    return (
        <AuthContext.Provider value={{ loggedIn, checkIfLoggedIn, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthContextProvider };