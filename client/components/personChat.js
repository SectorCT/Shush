import React, { startTransition } from 'react';
import { Button, StyleSheet, Text, View, TouchableOpacity, Image, FlatList} from 'react-native';
import { colors, fonts } from '../styles';

const Names = ["Damyan", "Jeni", "Svetoslav", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh", "Kelesh"];
const ColorsOfPeople = ["#31CC4A", '#B82727', '#A04492', '#4CA2BD'];

export default function TopBar() {
  const renderItem = ({ item }) => (
    <View style={styles.prChat__personChat}>
      <View style={styles.prChat__personIcon}>
        <Text style={styles.prChat__letter}>{item[0]}</Text>
      </View>
      <Text style={styles.prChat__name}>{item}</Text>
    </View>
  );

  return (
    <FlatList
      data={Names}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
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
