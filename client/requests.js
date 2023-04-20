import { SERVER_IP, SERVER_PORT } from '@env';

const API_URL = `http://${SERVER_IP}:${SERVER_PORT}`;
let access_token = '';

import AsyncStorage from '@react-native-async-storage/async-storage';


async function refreshToken() {
    const refresh_token = await AsyncStorage.getItem('refreshToken');
    const refreshResponse = await fetch(`${API_URL}/authentication/api/refresh_token/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refresh_token }),
    });
    if (refreshResponse.status !== 200) {
        refreshResponseData = await refreshResponse.json();
        console.log('Error refreshing token', refreshResponse.status, refreshResponseData.message, refreshResponse);
        AsyncStorage.removeItem('accessToken');
        AsyncStorage.removeItem('refreshToken');
        checkIfLoggedIn();
        throw new Error('Refresh token failed');
    }
    const data = await refreshResponse.json();
    access_token = data.access_token;
}

export async function makeRequest(endpoint, method = 'GET', body = {}) {
    if (!access_token) {
        access_token = await AsyncStorage.getItem('access_token');
    }
    const response = await fetch(`${API_URL}/${endpoint}`, method == "GET" ? {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        }
    } : {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
        body: JSON.stringify(body)
    });
    if (response.status === 401) {
        await refreshToken();
        const refreshedResponse = await fetch(`${API_URL}/${endpoint}`, method == "GET" ? {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            }
        } : {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`
            },
            body: JSON.stringify(body)
        });
        return refreshedResponse;
    }
    return response;
}