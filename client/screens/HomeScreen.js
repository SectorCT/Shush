import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, FlatList } from 'react-native';
import TopBar from '../components/Topbar.js';
import PersonChat from '../components/personChat';
import { colors } from '../styles.js';
import { TouchableOpacity } from 'react-native-gesture-handler';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { AuthContext } from '../AuthContext.js';

const serverIP = '192.168.7.149';

const Separator = () => <View style={styles.separator} />;



const HomeScreen = ({ navigation }) => {
  const { checkIfLoggedIn } = useContext(AuthContext);

  const [Peopele, setPeopele] = useState([]);

  function refresh() {
    setPeopele([]);
    AsyncStorage.getItem('authCookie').then((cookie) => {
      fetch(`http://${serverIP}:8000/authentication/list_friends/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': cookie,
        },
      }).then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            data.friends.forEach((element) => {
              setPeopele((Peopele) => [...Peopele, element]);
            });
          });
        } else {
          console.error('Error');
        }
      });
    });
  }

  useEffect(() => {
    refresh();
  }, []);

  const handleOpenChat = (friendName, chatId) => {
    navigation.navigate('Chat', { friendName, chatId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.prChat__personChat}
      onPress={
        () => handleOpenChat(item.nickname, item.id)
      }
    >
      <View style={styles.prChat__personIcon}>
        <Text style={styles.prChat__letter}>{item.nickname[0]}</Text>
      </View>
      <Text style={styles.prChat__name}>{item.nickname}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.islandHider} />

      <TopBar navigation={navigation} />
      <FlatList
        data={Peopele}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={Separator}
        style={styles.prChat__flatList}
        showsVerticalScrollIndicator={false}
      />
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
  prChat__personChat: {
    backgroundColor: colors.secondary,
    borderRadius: 20,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  prChat__personIcon: {
    backgroundColor: colors.accent,
    borderRadius: 90,
    height: '75%',
    aspectRatio: '1/1',
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prChat__name: {
    marginLeft: 12,
    fontWeight: 900,
    fontSize: 23,
    lineHeight: 34,
    color: colors.textWhite,
  },
  prChat__letter: {
    color: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
  },
  separator: {
    height: 0,
    backgroundColor: '#ddd',
    marginVertical: 5,
  },
  prChat__flatList: {
    flex: 1,
    margin: 5
  }
});

export default HomeScreen;
