import React from "react";
import { Image, View, Text, StyleProp, ViewStyle, StyleSheet} from "react-native";

import { colors } from "../styles";

interface IShushLogoAndTextProps {
    text: string;
    ContainerStyle?: StyleProp<ViewStyle>;
}

export default function ShushLogoAndText({ text, ContainerStyle } : IShushLogoAndTextProps): JSX.Element {
    
	const mergedContainerStyle = StyleSheet.flatten([
		styles.container,
		ContainerStyle,
	]);

	return (
		<View style={mergedContainerStyle}>
			<Image style={styles.image} source={require("../assets/ShushLogoWhite.png")} />
			<Text style={styles.text}>{text}</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 50
	},
	image : {
		width: 35,
		height: 35,
		margin: 10
	},
	text: {
		fontFamily: "AlumniSans-Bold",
		color: colors.white,
		fontSize: 40,
	}
});
