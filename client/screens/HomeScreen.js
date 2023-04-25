import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import TopBar from '../components/Topbar.js';
import ChatListing from '../components/Homescreen/ChatListing.js';
import { colors } from '../styles.js';
import { StatusBar } from 'expo-status-bar';


const HomeScreen = ({ navigation }) => {

	return (
		<View style={styles.container}>
			<StatusBar style="light" />
			<View style={styles.islandHider} />
			<TopBar navigation={navigation} />
			<ChatListing navigation={navigation} />
		</View>
	);
}


const styles = StyleSheet.create({
	islandHider: {
		backgroundColor: colors.primary,
		height: 25,
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
