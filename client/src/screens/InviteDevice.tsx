import React, { useContext } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "@navigation/HomeStack";

import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../styles";
import QRCode from "react-native-qrcode-svg";

import { AuthContext } from "../AuthContext";

const codeLink = "3ER89H5Y";

type InviteDeviceProps = {
	navigation: StackNavigationProp<HomeStackParamList, "InviteDevice">;
};

export default function InviteDevice({ navigation }: InviteDeviceProps) {

	const { logout } = useContext(AuthContext);
	// useEffect(() => {
	//     console.log("fetch");
	//     fetch('http://192.168.43.51:8000/authentication/gettoken', {
	//         method: 'POST',
	//         headers: {
	//             'Content-Type': 'application/json'
	//         },
	//         body: JSON.stringify({
	//         })
	//     })
	//         .then(response => response.json())
	//         .then(data => {
	//             console.log("test");
	//         })
	//         .catch(error => {
	//             console.error(error);
	//         });

	// }, []);

	function handleLogout() {
		logout();
	}

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.islandHider} />
			<View style={styles.container}>
				<View style={styles.inviteDevice__header} >
					<Text style={styles.inviteDevice__header_title}>Your Profile</Text>
				</View>
				<View style={styles.inviteDevice__flex}>
					<View style={styles.inviteDevice__descriptionview}>
						<Text style={styles.inviteDevice__description}>Scan from another device</Text>
						<Text style={styles.inviteDevice__description}>ID: <Text style={styles.inviteDevice__description_highlight}>{codeLink}</Text></Text>
					</View>
					<View style={styles.inviteDevice__qrCode_view}>
						<View style={{ borderWidth: 10, borderColor: "white" }}>
							<QRCode
								value={codeLink}
								size={200}
								color='black'
								backgroundColor='white'
							/>
						</View>
					</View>
					<TouchableOpacity style={styles.inviteDevice__createAccountButton} onPress={() => { navigation.navigate("HomeScreen"); }}>
						<Text style={styles.inviteDevice__createAccountButton_text}>Go Back</Text>
					</TouchableOpacity>
					<TouchableOpacity style={styles.inviteDevice__logOutButton} onPress={handleLogout}>
						<Text style={{ color: "#fff", fontSize: 30 }} >Log Out</Text>
					</TouchableOpacity>
				</View>

			</View>
		</>
	);
}


const styles = StyleSheet.create({
	islandHider: {
		backgroundColor: colors.primary,
		height: 35,
		width: "100%",
	},
	container: {
		flex: 1,
		backgroundColor: colors.backgroundColor,
		width: "100%"
	},
	inviteDevice__header: {
		backgroundColor: colors.primary,
		height: 60,
		width: "100%",
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		paddingHorizontal: 30,
	},
	inviteDevice__header_title: {
		color: "#fff",
		fontSize: 40,
		// fontFamily: fonts.primary,
	},
	inviteDevice__flex: {
		flex: 1,
		margin: 40,
		justifyContent: "space-between"
	},
	inviteDevice__description: {
		color: colors.complimentary,
		fontSize: 32,
		lineHeight: 32,
		marginTop: 10,
	},
	inviteDevice__descriptionview: {
	},
	inviteDevice__description_highlight: {
		fontSize: 34,
		fontWeight: "bold",
		color: colors.textWhite
	},
	inviteDevice__createAccountButton: {
		backgroundColor: colors.secondary,
		color: colors.primary,
		borderRadius: 15,
		margin: 0,
		marginBottom: 20,
		width: "100%",
		height: 70,
		alignItems: "center",
		justifyContent: "center",
	},
	inviteDevice__logOutButton: {
		backgroundColor: colors.secondary,
		color: colors.primary,
		borderRadius: 15,
		margin: 0,
		marginBottom: 20,
		width: "100%",
		height: 70,
		alignItems: "center",
		justifyContent: "center",
	},
	inviteDevice__createAccountButton_text: {
		fontSize: 30,
		color: colors.textWhite
	},
	inviteDevice__qrCode_style: {
		alignSelf: "center",
	},
	inviteDevice__qrCode_view: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center"

	}
});
