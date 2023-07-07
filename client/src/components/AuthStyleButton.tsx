import React from "react";

import { StyleSheet, Text, TouchableOpacity, StyleProp, ViewStyle} from "react-native";

import { colors } from "../styles";

type AuthStyleButtonProps = {
    text: string;
    onPress: () => void;
    style?: StyleProp<ViewStyle>;
};

export default function AuthStyleButton({ text, onPress, style }: AuthStyleButtonProps) {

	const mergedContainerStyle = StyleSheet.flatten([
		styles.button,
		style,
	]);

	return (
		<TouchableOpacity style={mergedContainerStyle} onPress={onPress}>
			<Text style={styles.buttonText}>{text}</Text>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
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
	buttonText: {
		fontFamily: "AlumniSans-Regular",  
		color: colors.white,
		fontSize: 30,
		letterSpacing: 0.75,
		padding: 15,
	},
});
