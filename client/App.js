import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { colors } from './styles.js'

import Navigator from './screens/routes.js';


export default function App() {
  return (
    <>
      <StatusBar style={{ backgroundColor: colors.primary }} />
      <View style={styles.islandHider} />
      <View style={styles.container}>
        <Navigator style={{ height: "100%" }} />
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
