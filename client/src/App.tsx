import { AuthContextProvider } from "./AuthContext";

import Navigation from "./navigation/Navigation";

import React, {useState, useEffect} from "react";

import * as Font from "expo-font";

export default function App() {

	const [fontLoaded, setFontLoaded] = useState(false);

	useEffect(() => {
		async function loadFonts(){
			await Font.loadAsync({
				"AlumniSans": require("./assets/fonts/AlumniSans.ttf"),
			});
			setFontLoaded(true);
		}

		loadFonts();
	}, []);

	if (!fontLoaded) {
		return null;
	}

	return (
		<>
			<AuthContextProvider>
				<Navigation />
			</AuthContextProvider>
		</>
	);
}