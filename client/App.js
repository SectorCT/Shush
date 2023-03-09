import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from './styles.js'

import Chat from './screens/Chat/Chat';


export default function App() {
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.islandHider} />
      <View style={styles.container}>
        <Chat />
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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
