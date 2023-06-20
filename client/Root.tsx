import React, { useEffect, useContext } from "react";

import { HomeStackContainer, AuthStackContainer } from "./screens/Routes";

import { AuthContext } from "./AuthContext";

export default function Root() {
	const { loggedIn, checkIfLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		checkIfLoggedIn();
	}, []);

	return (
		<>
			{loggedIn ? <HomeStackContainer /> : <AuthStackContainer />}
		</>
	);
}