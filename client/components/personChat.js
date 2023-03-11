import React, { startTransition } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors, fonts } from '../styles';

const Peopele = [
  {
  id: 1,
  name: 'Samantha',
  },
  {
  id: 2,
  name: 'David',
  },
  {
  id: 3,
  name: 'Amanda',
  },
  {
  id: 4,
  name: 'Michael',
  },
  {
  id: 5,
  name: 'Emily',
  },
  {
  id: 6,
  name: 'Brian',
  },
  {
  id: 7,
  name: 'Rachel',
  },
  {
  id: 8,
  name: 'Alex',
  },
  {
  id: 9,
  name: 'Jessica',
  },
  {
  id: 10,
  name: 'Ryan',
  },
  {
  id: 11,
  name: 'Taylor',
  },
  {
  id: 12,
  name: 'Justin',
  },
  {
  id: 13,
  name: 'Hannah',
  },
  {
  id: 14,
  name: 'Andrew',
  },
  {
  id: 15,
  name: 'Olivia',
  },
  {
  id: 16,
  name: 'Jacob',
  },
  ];
  
const Requests = [
  {id: 17, name: 'Muj'},
  {id: 18, name: 'Muj'},
  {id: 19, name: 'Muj'},
  {id: 20, name: 'Muj'}
]

const Separator = () => <View style={styles.separator} />;

export default function TopBar({ navigation }) {
  const handleOpenChat = (friendName, chatId) => {
    navigation.navigate('Chat', { friendName, chatId });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.prChat__personChat}
      onPress={
        () => handleOpenChat(item.name, item.id)
      }
    >
      <View style={styles.prChat__personIcon}>
        <Text style={styles.prChat__letter}>{item.name[0]}</Text>
      </View>
      <Text style={styles.prChat__name}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={Peopele}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={Separator}
      style={styles.prChat__flatList}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
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
    flex:1,
    margin: 5
  }
});
