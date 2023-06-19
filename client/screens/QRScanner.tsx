import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import { NavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "./Routes";

type QRCodeScannerProps = {
	navigation: NavigationProp<StackNavigationProp<HomeStackParamList, "QRCodeScanner">>;
};

export default function QRCodeScanner({ navigation } : QRCodeScannerProps) {
	const [hasPermission, setHasPermission] = useState(false);
	const [scanned, setScanned] = useState(false);

	useEffect(() => {
		const getBarCodeScannerPermissions = async () => {
			const { status } = await BarCodeScanner.requestPermissionsAsync();
			setHasPermission(status === "granted");
		};

		getBarCodeScannerPermissions();
	}, []);

	const handleBarCodeScanned = ({ data } : {data: string}) => {
		setScanned(true);
		navigation.navigate("AddPeople", { token: data });
	};

	const handleScanButtonPress = () => {
		setScanned(false);
	};

	if (hasPermission === null) {
		return <Text>Requesting for camera permission</Text>;
	}
	if (hasPermission === false) {
		return <Text>No access to camera</Text>;
	}

	return (
		<View style={styles.container}>
			<TouchableOpacity onPress={() => setScanned(false)}>
				<Text style={styles.scanButton}>Scan QR Code</Text>
			</TouchableOpacity>
			{scanned && <Button title={"Tap to Scan Again"} onPress={handleScanButtonPress} />}
			{scanned === false && (
				<BarCodeScanner
					onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
					style={StyleSheet.absoluteFillObject}
				/>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	scanButton: {
		padding: 10,
		backgroundColor: "#fff",
		color: "#FFFFFF",
		borderRadius: 5,
		fontSize: 20,
		marginBottom: 20,
	},
});
