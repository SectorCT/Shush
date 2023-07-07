import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@navigation/AuthStack";

import { StyleSheet, Text, Image, View} from "react-native";
import { StatusBar } from "expo-status-bar";
import AuthStyleButton from "../../components/AuthStyleButton";

import { colors } from "../../styles";

type AuthHomeScreenProps = {
    navigation: StackNavigationProp<AuthStackParamList, "AuthHome">;
};

export default function AuthHomeScreen({ navigation }: AuthHomeScreenProps) {
	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.logoContainer}>
				<Image style={styles.logoImage} source={require("../../assets/ShushLogoWhite.png")} />
				<Text style={styles.logoText}>Shush!</Text>
			</View>
			<AuthStyleButton text="Log In" onPress={() => navigation.navigate("SignIn")} />
			<AuthStyleButton text="Sign Up" onPress={() => navigation.navigate("SignUp")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: colors.backgroundColor
	},
	logoContainer: {
		alignItems: "center",
		marginBottom: 50
	},
	logoImage: {
		width: 120,
		height: 120,
		marginBottom: 10
	},
	logoText: {
		fontFamily: "AlumniSans-SemiBold",
		color: colors.white,
		fontSize: 100,
	},
	button: {
		margin: 20,
		width: "80%",
		backgroundColor: colors.backgroundColor, 
		borderColor: colors.white,
		borderWidth: 2,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10
	},
});
