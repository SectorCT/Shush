import React, { startTransition } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const ImageButton = ({ imageSource}) => {
    //const navigation = useNavigation();
  
    const handlePress = () => {
      //navigation.navigate(targetScreen);
    };
  
    return (
      <TouchableOpacity onPress={handlePress}>
        <Image source={imageSource} />
      </TouchableOpacity>
    );
  };
  

export default function TopBar() {
  return (
    <View style={styles.topbar__container}>
        <Image source = {require('../assets/people.svg')}/>
        <Text style={styles.topbar__text}>ID: VPX_0987</Text>
        <Image source = {require('../assets/settings.svg')}/>
    </View>
  );
}

const styles = StyleSheet.create({
  topbar__container: {
    backgroundColor: '#101010',
    height: 100,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  topbar__text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: "#fff",
    justifyContent: 'center',
  },
  topbar__people: {
    justifyContent: 'flex-start',
  },
  topbar__imageItem: {
    width: 40,
    height: 40,
  }
});
