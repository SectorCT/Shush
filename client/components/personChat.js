import React, { startTransition } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import { colors, fonts } from '../styles';

const Peopele = [
  {
    id: 1,
    name: 'Jeni',
  },
  {
    id: 2,
    name: 'Jeni',
  },
  {
    id: 3,
    name: 'Jeni',
  },
  {
    id: 4,
    name: 'Jeni',
  },
  {
    id: 5,
    name: 'Jeni',
  },
  {
    id: 6,
    name: 'Jeni',
  },
  {
    id: 7,
    name: 'Jeni',
  },
  {
    id: 8,
    name: 'Jeni',
  },
  {
    id: 9,
    name: 'Jeni',
  },
  {
    id: 10,
    name: 'Jeni',
  },
  {
    id: 11,
    name: 'Jeni',
  },
  {
    id: 12,
    name: 'Jeni',
  },
  {
    id: 13,
    name: 'Jeni',
  },
  {
    id: 14,
    name: 'Jeni',
  },
  {
    id: 15,
    name: 'Jeni',
  },
  {
    id: 16,
    name: 'Jeni',
  },
];

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
    />
  );
}

const styles = StyleSheet.create({
  prChat__personChat: {
    marginLeft: 30,
    backgroundColor: colors.primary,
    width: '100%',
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  prChat__personIcon: {
    backgroundColor: colors.accent,
    borderRadius: 10,
    height: '80%',
    aspectRatio: '1/1',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prChat__name: {
    color: '#fff',
    marginLeft: 12,
    fontWeight: 900,
    fontSize: 23,
    lineHeight: 34,
    color: '#898989',
  },
  prChat__letter: {
    color: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 30,
  }
});
