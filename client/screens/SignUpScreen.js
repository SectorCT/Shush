import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TextInput, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageButton from '../components/ImageButton.js';
import { colors } from '../styles.js';

const SignScreen = ({navigation}) => {
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');


  
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.islandHider} />
        <View style={styles.container}>
          <View style={styles.sign__header} >
            <Text style={styles.sign__header_title}>Create account</Text>
          </View>
        <View style={styles.main}>
          <View style = {styles.sign__inputcontainer}>
            <TextInput
              style={styles.input__field}
              value={password}
              placeholder="Password"
              onChangeText={(value) => setPassword(value)}
              maxLength={32}
              secureTextEntry={true}
              placeholderTextColor="#525252"
              />
            <TextInput
              style={styles.input__field}
              value={confirmedPassword}
              placeholder="Confirm Password"
              onChangeText={(value) => setConfirmedPassword(value)}
              maxLength={32}
              secureTextEntry={true}
              placeholderTextColor="#525252"
              />
            <TouchableOpacity style = {styles.sign__logInButton} onPress={() => {navigation.navigate('SignIn');}}>
              <Text 
              style = {styles.sign__logInButton_text} 
              >
                Already have an account?
              </Text>
            </TouchableOpacity>
        </View>
            <TouchableOpacity style = {styles.sign__createAccountButton}>
              <Text style = {styles.sign__createAccountButton_text}>Create</Text>
            </TouchableOpacity>
        </View>
      </View>
    </>
  );
}


const styles = StyleSheet.create({
  islandHider: {
    backgroundColor: colors.primary,
    height: 37,
    width: '100%',
  },
  main: {
    flex:1,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.backgroundColor,
    marginBottom: 40
  },
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    width: '100%',
    height:'100%',
    justifyContent: 'space-between',
  },
  sign__header: {
    backgroundColor: colors.primary,
    height: 60,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  sign__header_title: {
    color: "#fff",
    fontSize: 30,
  },
  input__field: {
    padding: 10,
    width: '100%',
    height: '100%',
    borderRadius: 20,
    alignItems: 'center',
    fontSize: 30,
    color: '#fff',
    flex: 0.25,
    borderBottomColor: colors.secondary,
    borderBottomWidth: 2,
  },
  sign__inputcontainer: {
    margin: 40,
    marginTop: 70,
    height: '24%',
    justifyContent: 'space-between',
    flex:0.5
  },
  sign__logInButton: {
    marginTop: 30,
  },
  sign__logInButton_text: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontSize: 20,
    padding: 10
  },
  sign__createAccountButton: {
    backgroundColor: colors.accent,
    color: colors.primary,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    marginBottom: 20,
    width: '80%',
    margin: 40,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sign__createAccountButton_text: {
    fontSize:30
  }

});

export default SignScreen;
