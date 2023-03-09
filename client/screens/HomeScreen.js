import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import TopBar from '../components/Topbar.js';
import PersonChat from '../components/personChat';
import { colors } from '../styles.js';

const HomeScreen = () => {
  return (
      <View style={styles.container}>
        <TopBar />
        <PersonChat />
      </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});

export default HomeScreen;
