import { AuthContextProvider } from "./AuthContext";

import Navigation from "./navigation/Navigation";

import React, {useState, useEffect} from "react";

import * as Font from "expo-font";
import { FontAwesome } from "@expo/vector-icons";

export default function App() {

	const [fontLoaded, setFontLoaded] = useState(false);

	useEffect(() => {
		async function loadFonts(){
			await Promise.all([
				Font.loadAsync({
					"AlumniSans-Thin": require("./assets/fonts/AlumniSans-Thin.ttf"),
					"AlumniSans-ExtraLight": require("./assets/fonts/AlumniSans-ExtraLight.ttf"),
					"AlumniSans-Light": require("./assets/fonts/AlumniSans-Light.ttf"),
					"AlumniSans-Regular": require("./assets/fonts/AlumniSans-Regular.ttf"),
					"AlumniSans-Medium": require("./assets/fonts/AlumniSans-Medium.ttf"),
					"AlumniSans-SemiBold": require("./assets/fonts/AlumniSans-SemiBold.ttf"),
					"AlumniSans-Bold": require("./assets/fonts/AlumniSans-Bold.ttf"),
					"AlumniSans-ExtraBold": require("./assets/fonts/AlumniSans-ExtraBold.ttf"),
					"AlumniSans-Black": require("./assets/fonts/AlumniSans-Black.ttf"),
				}),
				FontAwesome.loadFont(),
			]);
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