import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_IP = process.env.SERVER_IP ?? "localhost";
const SERVER_PORT = process.env.SERVER_PORT ?? "3000";


const API_URL = `https://${SERVER_IP}:${SERVER_PORT}`;

interface IAuthContextData {
	loggedIn: boolean | undefined;
	login: (token: string, password: string) => void;
	signup: (password: string, confirmPassword: string) => void;
	logout: () => void;
	checkIfLoggedIn: () => void;
}


export const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export function AuthContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const [loggedIn, setLoggedIn] = useState(false);

	interface ILoginResponse {
		success?: {
			status: number;
			access_token: string;
			refresh_token: string
		};
		error?: {
			status: number;
			message: string
		};
	}

	const login = async function (token: string, password: string) {
		try {
			const response = await fetch(`${API_URL}/authentication/login/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: token,
					password: password,
				}),
			});
			const data: ILoginResponse = await response.json();

			if (data.success) {
				AsyncStorage.setItem("access_token", data.success.access_token);
				AsyncStorage.setItem("refresh_token", data.success.refresh_token);
				setLoggedIn(true);
			} else if (data.error) {
				console.log(data.error.message);
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};

	interface ISignupResponse {
		success?: {
			status: number;
			access_token: string;
			refresh_token: string;
		};
		error?: {
			status: number;
			message: string;
		};
	}

	const signup = async function (password: string, confirmPassword: string) {
		try {
			if (password !== confirmPassword) {
				console.log("Passwords do not match");
				return;
			}

			const response = await fetch(`${API_URL}/authentication/signup/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: password,
				}),
			});

			const data: ISignupResponse = await response.json();

			if (data.success) {
				await AsyncStorage.setItem("access_token", data.success.access_token);
				await AsyncStorage.setItem("refresh_token", data.success.refresh_token);
				await setLoggedIn(true);
				return;
			} else if (data.error) {
				console.log(data.error.message);
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};

	interface ILogoutResponse {
		success?: {
			status: number;
			message: string;
		};
		error?: {
			status: number;
			message: string;
		};
	}

	const logout = async function () {
		try {
			const refreshToken = await AsyncStorage.getItem("refresh_token");

			const response = await fetch(`${API_URL}/authentication/logout/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					refresh_token: refreshToken,
				}),
			});

			const data: ILogoutResponse = await response.json();

			if (data.success) {
				AsyncStorage.removeItem("access_token");
				AsyncStorage.removeItem("refresh_token");
				setLoggedIn(false);
			} else if (data.error) {
				console.log(data.error.message);
				return;
			}
		} catch (error) {
			console.log(error);
		}
	};


	const checkIfLoggedIn = async () => {
		// Implement your checkIfLoggedIn logic here
		// Check if a token exists in AsyncStorage
		// If a token exists, set the loggedIn state to true
		// Otherwise, set the loggedIn state to false
	};

	useEffect(() => {
		checkIfLoggedIn();
	}, []);

	const authContextData: IAuthContextData = {
		loggedIn,
		login,
		signup,
		logout,
		checkIfLoggedIn,
	};

	return (
		<AuthContext.Provider value={authContextData}>
			{children}
		</AuthContext.Provider>
	);
}
