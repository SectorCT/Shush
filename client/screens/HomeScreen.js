import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import TopBar from '../components/Topbar.js';
import PersonChat from '../components/personChat';
import { colors } from '../styles.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../AuthContext.js';

const HomeScreen = ({ navigation }) => {
  const { checkIfLoggedIn } = React.useContext(AuthContext);

  function handleLogout() {
    fetch('http://192.168.7.149:8000/authentication/logout/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          console.log(data);
          AsyncStorage.removeItem('authCookie').then(() => {
            console.log('Cookie removed');
            checkIfLoggedIn();
          });
        });
      } else {
        console.error('Error');
      }
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.islandHider} />
      {/* <TouchableOpacity>
        <Text style={{ color: "#fff" }} onPress={handleLogout}>Log Out</Text>
      </TouchableOpacity> */}
      <TopBar navigation={navigation} />
      <PersonChat navigation={navigation} />
    </View>
  );
}


const styles = StyleSheet.create({
  islandHider: {
    backgroundColor: colors.primary,
    height: 40,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});

export default HomeScreen;
