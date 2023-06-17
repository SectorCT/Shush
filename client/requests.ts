
import { useContext } from "react";
import { AuthContext } from "./AuthContext";


import AsyncStorage from "@react-native-async-storage/async-storage";
// import { SERVER_IP, SERVER_PORT } from "@env";
const SERVER_IP = "";
const SERVER_PORT = "8000";
const API_URL = `https://${SERVER_IP}:${SERVER_PORT}`;


async function refreshToken() {
	const {checkIfLoggedIn} = useContext(AuthContext);
	const refresh_token = await AsyncStorage.getItem("refreshToken");
	const refreshResponse = await fetch(`${API_URL}/authentication/api/refresh_token/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refresh_token: refresh_token }),
	});
	if (refreshResponse.status !== 200) {
		const refreshResponseData = await refreshResponse.json();
		console.log("Error refreshing token", refreshResponse.status, refreshResponseData.message, refreshResponse);
		AsyncStorage.removeItem("accessToken");
		AsyncStorage.removeItem("refreshToken");
		checkIfLoggedIn();
		return null;
	}
	const data = await refreshResponse.json();
	return data.access_token;
}

export async function makeRequest(endpoint:string, method = "GET", body = {}) {
	let accessToken = "" as string | null;
	if (!accessToken) {
		accessToken = await AsyncStorage.getItem("accessToken");
	}
	const response = await fetch(`${API_URL}/${endpoint}`, method == "GET" ? {
		method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		}
	} : {
		method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${accessToken}`
		},
		body: JSON.stringify(body)
	});
	if (response.status === 401) {
		accessToken = await refreshToken();
		if (!accessToken) {
			return null;
		}
		await AsyncStorage.setItem("accessToken", accessToken);
		const refreshedResponse = await fetch(`${API_URL}/${endpoint}`, method == "GET" ? {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			}
		} : {
			method,
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${accessToken}`
			},
			body: JSON.stringify(body)
		});
		return refreshedResponse;
	}
	return response;
}