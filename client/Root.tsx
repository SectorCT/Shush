import React, { useEffect, useContext } from "react";

import { HomeStackNavigator, AuthStackNavigator } from "./screens/Routes";

import { AuthContext } from "./AuthContext";
import { NavigationContainer } from "@react-navigation/native";

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