import React from "react";
import { createStackNavigator } from "@react-navigation/stack";


import AuthHomeScreen from "../screens/AuthStack/AuthHomeScreen";
import SignUp from "../screens/AuthStack/SignUpScreen";
import SignIn from "../screens/AuthStack/SignInScreen";

export type AuthStackParamList = {
    AuthHome: undefined;
	SignIn: undefined;
	SignUp: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

export default function AuthStackContainer() {
	return (
		<AuthStack.Navigator>
			<AuthStack.Screen name="AuthHome" component={AuthHomeScreen} options={{ headerShown: false }} />
			<AuthStack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
			<AuthStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
		</AuthStack.Navigator>
	);
}
