import { AuthContextProvider } from "./AuthContext";

import Root from "./Root";

import React from "react";

console.log(process.env.SERVER_IP);

export default function App() {
	return (
		<>
			<AuthContextProvider>
				<Root />
			</AuthContextProvider>
		</>
	);
}