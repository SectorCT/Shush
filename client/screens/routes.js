import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import HomeScreen from './HomeScreen';
import Chat from './Chat';
import People from './People';

const screens = {
    HomeScreen: {
        screen: HomeScreen,
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
    People: {
        screen: People,
        navigationOptions: {
            headerShown: false,
        },
    },
};

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);

