import React, { startTransition } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { colors, fonts } from '../styles';

const ImageButton = ({ imageSource}) => {
    //const navigation = useNavigation();
  
    const handlePress = () => {
      //navigation.navigate(targetScreen);
    };
  
    return (
      <TouchableOpacity onPress={handlePress}>
        <Image source={imageSource}/>
      </TouchableOpacity>
    );
  };
  

export default function TopBar() {
  return (
    <View style={styles.topbar__container}>
        <Image source = {require('../assets/addPeople.png')} style ={styles.topbar__imageItem}/>
        <Text style={styles.topbar__text}>ID: VPX_0987</Text>
        <Image source = {require('../assets/settings.png')} style ={styles.topbar__imageItem}/>
        
    </View>
  );
}

const styles = StyleSheet.create({
  topbar__container: {
    // backgroundColor: colors.primary,
    height: 100,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    fontWeight: 400,
    fontSize: 29,
    lineHeight: 43,
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
