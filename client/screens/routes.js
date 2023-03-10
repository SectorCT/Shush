import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen';
import Chat from './Chat';
import SignUp from './SignUpScreen.js'
import SignIn from './SignInScreen.js'
import AddPeople from './AddPeople.js'
import AddPeopleOrSeeCode from './AddPeopleOrSeeCode';
import InvitePeople from './InvitePeople';

const screens = {
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            headerShown: false,
        },
    },
    HomeScreen: {
        screen: HomeScreen,
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
    Chat: {
        screen: Chat,
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
    InvitePeople: {
        screen: InvitePeople,
        navigationOptions: {
            headerShown: false,
        },
    },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);

