import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_IP = process.env.SERVER_IP ?? "localhost";
const SERVER_PORT = process.env.SERVER_PORT ?? "5000";


const API_URL = `https://${SERVER_IP}:${SERVER_PORT}`;

interface IAuthContextData {
	loggedIn: boolean | null;
	login: (token: string, password: string) => void;
	signup: (password: string, confirmPassword: string) => void;
	logout: () => void;
	checkIfLoggedIn: () => void;
}

console.log(API_URL);

export const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export function AuthContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
	const [loggedIn, setLoggedIn] = useState(null as boolean | null);

	type ILoginResponse = 
		{
			status: "success";
			message: string;
			access_token: string;
			refresh_token: string;
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
				AsyncStorage.setItem("accessToken", data.access_token);
				AsyncStorage.setItem("refreshToken", data.refresh_token);
				AsyncStorage.setItem("userToken", token);
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
			access_token: string;
			refresh_token: string;
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
			await AsyncStorage.setItem("accessToken", data.access_token);
			await AsyncStorage.setItem("refreshToken", data.refresh_token);
			await AsyncStorage.setItem("userToken", data.token);
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

			console.log("refreshToken", `${API_URL}/authentication/logout/`);

			if (!refreshToken) {
				AsyncStorage.removeItem("accessToken");
				AsyncStorage.removeItem("refreshToken");
				setLoggedIn(false);
			}

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
