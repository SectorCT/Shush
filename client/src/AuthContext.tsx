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

	type ILoginResponse = 
		{
			status: "success";
			message: string;
			accessToken: string;
			refreshToken: string;
		} |
		{
			status: "error"
			message: string;
		};

	async function login (token: string, password: string) {
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

			if (data.status === "success") {
				AsyncStorage.setItem("accessToken", data.accessToken);
				AsyncStorage.setItem("refreshToken", data.refreshToken);
				setLoggedIn(true);
			} else {
				console.log(data.message);
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}

	type ISignupResponse =
		{
			status: "success";
			message: string;
			token: string;
			accessToken: string;
			refreshToken: string;
		} |
		{
			status: "error"
			message: string;
		};

	async function signup (password: string, confirmPassword: string) {
		if (password !== confirmPassword) {
			console.log("Passwords do not match");
			return;
		}

		let response = null;
		try {
			response = await fetch(`${API_URL}/authentication/signup/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					password: password,
				}),
			});
		} catch (error) {
			console.log(error);
			return;
		}

		let data = null;
		try {
			data = await response.json() as ISignupResponse;
		} catch {
			console.log("Error parsing JSON");
			return;
		}

		if (data.status === "success") {
			await AsyncStorage.setItem("accessToken", data.accessToken);
			await AsyncStorage.setItem("refreshToken", data.refreshToken);
			console.log("Successfully signed up");
			await setLoggedIn(true);
			return;
		} else {
			console.log(data.message);
			return;
		}
	}

	interface ILogoutResponse {
		status: string;
		message: string;
	}

	async function logout () {
		try {
			const refreshToken = await AsyncStorage.getItem("refreshToken");

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
			if (data.status === "success") {
				AsyncStorage.removeItem("accessToken");
				AsyncStorage.removeItem("refreshToken");
				setLoggedIn(false);
			} else {
				console.log("error:", data.message);
				return;
			}
		} catch (error) {
			console.log(error);
		}
	}


	async function checkIfLoggedIn () {
		try {
			const refreshToken = await AsyncStorage.getItem("refreshToken");

			if (refreshToken) {
				setLoggedIn(true);
			} else {
				setLoggedIn(false);
			}
		} catch (error) {
			console.log(error);
		}
	}

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
