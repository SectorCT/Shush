import React, { useEffect, useContext } from "react";

import HomeStackContainer from "./HomeStack";
import AuthStackContainer from "./AuthStack";

import { NavigationContainer }  from "@react-navigation/native";

import { AuthContext } from "../AuthContext";

export default function Navigation() {
	const { loggedIn, checkIfLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		checkIfLoggedIn();
	}, []);

	useEffect(() => {
		console.log("loggedIn", loggedIn);
	}, [loggedIn]);

	return (
		<>
			<NavigationContainer>
				{loggedIn ? <HomeStackContainer /> : <AuthStackContainer />}
			</NavigationContainer>
		</>
	);
}