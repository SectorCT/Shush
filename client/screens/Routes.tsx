import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import HomeScreen from "./HomeScreen";
import Chat from "./Chat";
import SignUp from "./SignUpScreen.tsx";
import SignIn from "./SignInScreen.tsx";
import AddPeople from "./AddPeople.js";
import AddPeopleOrSeeCode from "./AddPeopleOrSeeCode";
import InvitePeople from "./InvitePeople";
import InviteDevice from "./InviteDevice";
import QRScanner from "./QRScanner";


const homeStackScreens = {
	HomeScreen: {
		screen: HomeScreen,
		navigationOptions: {
			headerShown: false,
		},
	},
	InvitePeople: {
		screen: InvitePeople,
		navigationOptions: {
			headerShown: false,
		},
	},
	Chat: {
		screen: Chat,
		navigationOptions: {
			headerShown: false,
		},
	},
	AddPeople: {
		screen: AddPeople,
		navigationOptions: {
			headerShown: false,
		},
	},
	AddPeopleOrSeeCode: {
		screen: AddPeopleOrSeeCode,
		navigationOptions: {
			headerShown: false,
		},
	},
	InviteDevice: {
		screen: InviteDevice,
		navigationOptions: {
			headerShown: false,
		},
	},
	QRScanner: {
		screen: QRScanner,
		navigationOptions: {
			headerShown: false,
		},
	},
};

const authStackScreens = {
	SignIn: {
		screen: SignIn,
		navigationOptions: {
			headerShown: false,
		},
	},
	SignUp: {
		screen: SignUp,
		navigationOptions: {
			headerShown: false,
		},
	},
};

const HomeStack = createStackNavigator(homeStackScreens);
const AuthStack = createStackNavigator(authStackScreens);

export const HomeStackNavigator = createAppContainer(HomeStack);
export const AuthStackNavigator = createAppContainer(AuthStack);

