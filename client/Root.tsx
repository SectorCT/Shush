import React, { useEffect, useContext } from "react";

import { HomeStackContainer, AuthStackContainer } from "./screens/Routes";
import { NavigationContainer }  from "@react-navigation/native";

import { AuthContext } from "./AuthContext";

export default function Root() {
	const { loggedIn, checkIfLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		checkIfLoggedIn();
	}, []);

	return (
		<>
			<NavigationContainer>
				{loggedIn ? <HomeStackContainer /> : <AuthStackContainer />}
			</NavigationContainer>
		</>
	);
}