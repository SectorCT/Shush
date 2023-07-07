import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "@navigation/HomeStack";

import { StyleSheet, View } from "react-native";
import TopBar from "../../components/Topbar";
import ChatList from "../../components/Homescreen/ChatList";
import { colors } from "../../styles";
import { StatusBar } from "expo-status-bar";


type HomeScreenProps = {
	navigation: StackNavigationProp<HomeStackParamList, "HomeScreen">;
};

export default function HomeScreen({ navigation }: HomeScreenProps) {

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.islandHider} />
			<TopBar navigation={navigation} />
			<ChatList navigation={navigation} />
		</View>
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
	},
});
