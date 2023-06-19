import React, { useState, useEffect } from "react";
import { NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./Routes";



import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors } from "../styles";
import QRCode from "react-native-qrcode-svg";

import { makeRequest } from "../requests";

type InvitePeopleProps = {
	navigation: NavigationProp<StackNavigationProp<HomeStackParamList, "InvitePeople">>;
};

export default function InvitePeople({ navigation }: InvitePeopleProps) {

	useEffect(() => {
		try {
			makeRequest("authentication/get_friend_token/", "GET").then((response) => {
				if (response === null) {
					console.log("error getting friend invite code: response.status is null");
					return;
				}
				
				if (response.status === 200) {
					response.json().then((data) => {
						setInviteCode(data.friendInviteCode);
					});
				} else {
					console.log("error getting friend invite code" + response.status);
				}
			});
		} catch (error) {
			console.log("error getting friend invite code:" + error);
		}
	});

	const [inviteCode, setInviteCode] = useState("");

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.islandHider} />
			<View style={styles.container}>
				<View style={styles.invitePeople__header} >
					<Text style={styles.invitePeople__header_title}>Add People</Text>
				</View>
				<View style={styles.invitePeople__flex}>
					<View style={styles.invitePeople__descriptionview}>
						<Text style={styles.invitePeople__description}>Let your friend insert/scan it</Text>
						<Text style={styles.invitePeople__description}>Code: <Text style={styles.invitePeople__description_highlight}>{inviteCode}</Text></Text>
					</View>
					<View style={styles.invitePeople__qrCode_view}>
						<View style={{ borderWidth: 10, borderColor: "white" }}>
							{inviteCode ? <QRCode
								value={`${inviteCode}`}
								size={200}
								color='black'
								backgroundColor='white'
							/> : <Text>loading</Text>}
						</View>
					</View>
					<TouchableOpacity style={styles.invitePeople__createAccountButton} onPress={() => { navigation.navigate("HomeScreen"); }}>
						<Text style={styles.invitePeople__createAccountButton_text}>Go Back</Text>
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
	invitePeople__header: {
		backgroundColor: colors.primary,
		height: 60,
		width: "100%",
		flexDirection: "row",
		alignItems: "flex-start",
		justifyContent: "space-between",
		paddingHorizontal: 30,
	},
	invitePeople__header_title: {
		color: "#fff",
		fontSize: 40,
		// fontFamily: fonts.primary,
	},
	invitePeople__flex: {
		flex: 1,
		margin: 40,
		justifyContent: "space-between"
	},
	invitePeople__description: {
		color: colors.complimentary,
		fontSize: 32,
		lineHeight: 32,
		marginTop: 10,
	},
	invitePeople__descriptionview: {
	},
	invitePeople__description_highlight: {
		fontSize: 34,
		fontWeight: "bold",
		color: colors.textWhite
	},
	invitePeople__createAccountButton: {
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
	invitePeople__createAccountButton_text: {
		fontSize: 30,
		color: colors.textWhite
	},
	invitePeople__qrCode_style: {
		alignSelf: "center",
	},
	invitePeople__qrCode_view: {
		width: "100%",
		alignItems: "center",
		justifyContent: "center"

	}
});
