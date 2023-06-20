import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./HomeScreen";
import Chat from "./Chat";
import SignUp from "./SignUpScreen";
import SignIn from "./SignInScreen";
import AddPeople from "./AddPeople";
import AddPeopleOrSeeCode from "./AddPeopleOrSeeCode";
import InvitePeople from "./InvitePeople";
import InviteDevice from "./InviteDevice";
import QRScanner from "./QRScanner";


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

export type AuthStackParamList = {
	SignIn: undefined;
	SignUp: undefined;
};


const HomeStack = createStackNavigator<HomeStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();

function HomeStackContainer() {
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

function AuthStackContainer() {
	return (
		<AuthStack.Navigator>
			<AuthStack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
			<AuthStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
		</AuthStack.Navigator>
	);
}

export { HomeStackContainer, AuthStackContainer };