import React from "react";

import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../screens/HomeStack/HomeScreen";
import Chat from "../screens/HomeStack/Chat";
import AddPeople from "../screens/HomeStack/AddPeople";
import AddPeopleOrSeeCode from "../screens/HomeStack/AddPeopleOrSeeCode";
import InvitePeople from "../screens/HomeStack/InvitePeople";
import InviteDevice from "../screens/HomeStack/InviteDevice";
import QRScanner from "../screens/QRScanner";

export type HomeStackParamList = {
	HomeScreen: undefined;
	Chat: {
		friendshipId: string;
		friendName: string;
	};
	AddPeople: {
		token: string | undefined;
	};
	AddPeopleOrSeeCode: undefined;
	InvitePeople: undefined;
	InviteDevice: undefined;
	QRScanner: undefined;
};

const HomeStack = createStackNavigator<HomeStackParamList>();

export default function HomeStackContainer() {
	return (
		
		<HomeStack.Navigator>
			<HomeStack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
			<HomeStack.Screen name="Chat" component={Chat} options={{ headerShown: false }} />
			<HomeStack.Screen name="AddPeople" component={AddPeople} options={{ headerShown: false }} />
			<HomeStack.Screen name="AddPeopleOrSeeCode" component={AddPeopleOrSeeCode} options={{ headerShown: false }} />
			<HomeStack.Screen name="InvitePeople" component={InvitePeople} options={{ headerShown: false }} />
			<HomeStack.Screen name="InviteDevice" component={InviteDevice} options={{ headerShown: false }} />
			<HomeStack.Screen name="QRScanner" component={QRScanner} options={{ headerShown: false }} />
		</HomeStack.Navigator>
	);
}