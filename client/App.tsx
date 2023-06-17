import { AuthContextProvider } from "./AuthContext";

import Root from "./Root";

import React from "react";

export default function App() {
	return (
		<>
			<AuthContextProvider>
				<Root />
			</AuthContextProvider>
		</>
	);
}