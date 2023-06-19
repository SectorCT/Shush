import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";

import HomeScreen from "./HomeScreen";
import Chat from "./Chat";
import SignUp from "./SignUpScreen";
import SignIn from "./SignInScreen";
import AddPeople from "./AddPeople";
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

export type HomeStackParamList = {
	HomeScreen: undefined;
	Chat: {
		friendshipId: string;
		friendName: string;
	};
	AddPeople: {
		token : string;
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


const HomeStack = createStackNavigator(homeStackScreens);
const AuthStack = createStackNavigator(authStackScreens);

export const HomeStackNavigator = createAppContainer(HomeStack);
export const AuthStackNavigator = createAppContainer(AuthStack);