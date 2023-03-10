import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors } from './styles.js'

import Navigator from './screens/routes.js';
import AddPeople from './screens/AddPeople.js';
import SignScreen from './screens/SignScreen.js'


export default function App() {
  return (
    <>
      <SignScreen />
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
