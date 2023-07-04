import AsyncStorage from "@react-native-async-storage/async-storage";

const SERVER_IP = process.env.SERVER_IP ?? "";
const SERVER_PORT = process.env.SERVER_PORT ?? "";
// cosnt SERVER_PORT } from "@env";
const API_URL = `https://${SERVER_IP}:${SERVER_PORT}`;

async function refreshToken() {
	const refreshToken = await AsyncStorage.getItem("refreshToken");

	const refreshResponse = await fetch(`${API_URL}/authentication/api/refreshToken/`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ refreshToken: refreshToken }),
	});

	if (refreshResponse.status !== 200) {
		try {
			const refreshResponseData = await refreshResponse.json();
			console.log("Error refreshing token", refreshResponse.status, refreshResponseData.message, refreshResponse);
			await AsyncStorage.removeItem("accessToken");
			await AsyncStorage.removeItem("refreshToken");
			return null;
		} catch {
			console.log("Error parsing data when refreshing token", refreshResponse.status, refreshResponse);
			return null;
		} finally {
			await AsyncStorage.removeItem("accessToken");
			await AsyncStorage.removeItem("refreshToken");
			// checkIfLoggedIn();
		}

	}
	try {

		const data = await refreshResponse.json();
		return data.accessToken;
	} catch {
		console.log("Error parsing data when refreshing token", refreshResponse.status, refreshResponse);
		return null;
	}
}

export async function makeRequest(endpoint: string, method = "GET", body = {}) {
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
		// return null;
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