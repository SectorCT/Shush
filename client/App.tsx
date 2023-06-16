import { AuthContextProvider } from "./AuthContext.js";

import Root from "./Root.js";

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