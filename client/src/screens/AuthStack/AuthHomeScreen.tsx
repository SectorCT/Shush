import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@navigation/AuthStack";

import { StyleSheet, Text, Image, View, TouchableOpacity} from "react-native";
import { StatusBar } from "expo-status-bar";

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
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignIn")}>
				<Text style={styles.buttonText}>Sign In</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.button} onPress={() => navigation.navigate("SignUp")}>
				<Text style={styles.buttonText}>Sign Up</Text>
			</TouchableOpacity>
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
		width: 100,
		height: 100
	},
	logoText: {
		fontFamily: "AlumniSans",
		color: "#fff",
		fontSize: 90,
		fontWeight: "700",
	},
	button: {
		margin: 20,
		width: "80%",
		backgroundColor: colors.backgroundColor,
		borderColor: "#fff",
		borderWidth: 2,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
		marginTop: 10
	},
	buttonText: {
		fontFamily: "AlumniSans",  
		color: "#fff",
		fontSize: 20,
		fontWeight: "bold",
		padding: 15
	}
});
