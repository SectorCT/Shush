import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar } from 'react-native';
import TopBar from '../components/Topbar.js';
import PersonChat from '../components/personChat';
import { colors } from '../styles.js';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TopBar />
      <PersonChat navigation={navigation} />
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
