import React, { useState, useEffect, useContext } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { NavigationStackProp } from "react-navigation-stack";

import { StyleSheet, Text, View, TextInput, TouchableOpacity} from "react-native";
import { StatusBar } from "expo-status-bar";
import ShushLogoAndText from "../../components/ShushLogoAndText";
import AuthStyleButton from "../../components/AuthStyleButton";


import { colors } from "../../styles";

import { AuthContext } from "../../AuthContext";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@navigation/AuthStack";


// Define the type for the navigation prop
type SignInScreenProps = {
  navigation: StackNavigationProp<AuthStackParamList, "SignIn">;
};

export default function SignInScreen({navigation} : SignInScreenProps) {
	const [code, setCode] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");

	const { login } = useContext(AuthContext);

	useEffect(() => {
		AsyncStorage.getItem("userToken").then((value) => {
			if (value === null) {
				return;
			}
			setCode(value);
		});
	}, []);

	function verrifyCodeAndPass() {
		if (code.length < 8) {
			setError("Code must be at least 8 characters long");
			return false;
		}
		if (password.length < 8) {
			setError("Password must be at least 8 characters long");
			return false;
		}
		setError("");
		return true;
	}

	function handleSubmit() {
		if (!verrifyCodeAndPass()) {
			return;
		}
		login(code, password);
	}
	return (
		<>
			<StatusBar style="light" />
			<View style={styles.islandHider} />
			<View style={styles.container}>
				<ShushLogoAndText text="Log in account" ContainerStyle={styles.header} />
				<View style={styles.main}>
					<View style={styles.inputContainer}>
						<TextInput
							style={styles.input__field}
							value={code}
							placeholder="Your ID"
							placeholderTextColor={colors.textGray}
							onChangeText={(value) => setCode(value)}
						/>
						<TextInput
							style={styles.input__field}
							value={password}
							placeholder="Password"
							onChangeText={(value) => setPassword(value)}
							maxLength={32}
							secureTextEntry={true}
							placeholderTextColor={colors.textGray}
						/>
						<AuthStyleButton text="Log in" onPress={handleSubmit} style={styles.logInButton} />
						<TouchableOpacity style={styles.switchOptionButton} onPress={() => { navigation.navigate("SignUp");}}>
							<Text style={styles.switchOptionButton_text}>*Don&apos;t have an account?</Text>
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
	logInButton: {
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