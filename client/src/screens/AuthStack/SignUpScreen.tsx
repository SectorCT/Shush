import React, { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@navigation/AuthStack";

import { StyleSheet, Text, View, StatusBar, TextInput } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import ShushLogoAndText from "../../components/ShushLogoAndText";
import AuthStyleButton from "../../components/AuthStyleButton";

import { colors } from "../../styles";

import { AuthContext } from "../../AuthContext";


type SignScreenProps = {
	navigation: StackNavigationProp<AuthStackParamList, "SignUp">;
};

export default function SignUpScreen({ navigation }: SignScreenProps) {
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [error, setError] = useState("");

	const { signup } = React.useContext(AuthContext);


	function validatePassword() {
		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return false;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			return false;
		}
		setError("");
		return true;
	}

	function handleSubmit() {
		if (!validatePassword()) {
			return;
		}
		signup(password, confirmPassword);
	}
	return (
		<>
			<StatusBar />
			<View style={styles.islandHider} />
			<View style={styles.container}>
				<ShushLogoAndText text="Create account" ContainerStyle={styles.header} />
				<View style={styles.main}>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input__field}
							value={password}
							placeholder="Password"
							onChangeText={(value) => setPassword(value)}
							maxLength={32}
							secureTextEntry={true}
							placeholderTextColor="#525252"
						/>
						<TextInput
							style={styles.input__field}
							value={confirmPassword}
							placeholder="Confirm Password"
							onChangeText={(value) => setConfirmPassword(value)}
							maxLength={32}
							secureTextEntry={true}
							placeholderTextColor="#525252"
						/>
						<AuthStyleButton text="Sign up" onPress={handleSubmit} style={styles.createAccountButton} />
						<TouchableOpacity style={styles.switchOptionButton} onPress={() => { navigation.navigate("SignIn");}}>
							<Text style={styles.switchOptionButton_text}>*Already have an account?</Text>
						</TouchableOpacity>
					</View>
					{error !== "" &&
						<View style={styles.errorContainer}>
							<Text style={styles.errorContainer_text}>{error}</Text>
						</View>
					}
				</View>
			</View>
		</>
	);
}


const styles = StyleSheet.create({
	islandHider: {
		backgroundColor: colors.backgroundColor,
		height: 50,
		width: "100%",
	},
	container: {
		width: "100%",
		height: "100%",
	},
	header: {
		backgroundColor: colors.backgroundColor,
		height: 60,
		width: "100%",
		marginBottom: 0,
	},
	main: {
		marginTop: 0,
		flex: 1,
		height: "100%",
		alignItems: "center",
		justifyContent: "flex-start",
		backgroundColor: colors.backgroundColor,
	},
	inputContainer: {
		width: "85%",
		marginTop: 30,
		marginBottom: 30,
	},
	input__field: {
		fontFamily: "AlumniSans-Regular",
		padding: 10,
		width: "100%",
		height: 70,
		alignItems: "center",
		justifyContent: "center",
		fontSize: 40,
		letterSpacing: 0.75,
		color: colors.white,
		borderBottomColor: colors.complimentary,
		borderBottomWidth: 2,
		marginTop: 30,
	},
	createAccountButton: {
		margin: 0,
		marginTop: 80,
		marginBottom: 20,
		width: "100%",
	},
	switchOptionButton: {
		marginTop: 10,
		alignSelf: "flex-start",
	},
	switchOptionButton_text: {
		color: colors.white,
		textDecorationLine: "underline",
		fontFamily: "AlumniSans-Light",
		fontSize: 24,
		padding: 10,
	},
	errorContainer: {
		backgroundColor: colors.secondary,
		width: "80%",
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 15,
		padding: 20
	},
	errorContainer_text: {
		color: colors.white,
		fontSize: 20,
	}
});
