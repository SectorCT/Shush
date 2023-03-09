import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors } from './styles.js'

import Chat from './screens/Chat/Chat';
import HomeScreen from './screens/HomeScreen.js';
import AddPeople from './screens/AddPeople.js';


export default function App() {
  return (
    <>
      <View style={styles.container}>
        <AddPeople />
      </View>
    </>
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
    height: '100%',
    width: '100%',
  },
});
