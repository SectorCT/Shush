import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "@navigation/HomeStack";

import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { colors } from "../../styles";


import { makeRequest } from "../../utils/requests";

type ChatListingProps = {
	navigation: StackNavigationProp<HomeStackParamList>;
};


export default function ChatListing({ navigation }: ChatListingProps) {
	const [Peopele, setPeopele] = useState([]);
	function refresh() {
		try {
			makeRequest("authentication/list_friends/").then((response) => {
				if (response === null) {
					return;
				}
				if (response.status === 200) {
					response.json().then((data) => {
						console.log("Friends", data);
						setPeopele(data.friends);
					});
				} else {
					response.json().then((data) => {
						console.log("Error while getting friends", response.status, data.message);
					});
				}
			});
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			refresh();
		});
		return () => {
			unsubscribe();
		};
	}, []);

	const handleOpenChat = (friendName: string, friendshipId: string) => {
		navigation.navigate("Chat", { friendName, friendshipId });
	};


	type ChatListItem = {
		nickname: string;
		friendship_token: string;
		latest_message: string;
		is_latest_message_from_me: boolean;
	};

	function Separator() {
		return (
			<View style={styles.separator}></View>
		);
	}

	const renderItem = ({ item }: { item: ChatListItem }) => (
		<TouchableOpacity
			style={styles.personChatContainer}
			onPress={
				() => handleOpenChat(item.nickname, item.friendship_token)
			}
		>
			<View style={styles.personIcon}>
				<Text style={styles.letter}>{item.nickname[0]?.toUpperCase()}</Text>
			</View>
			<View style={styles.nameAndLastMessage}>
				<Text style={styles.name}>{item.nickname}</Text>
				<Text numberOfLines={1} ellipsizeMode="tail" style={styles.lastMessage}>da ti eba majkata pedal zashto iztri vsichko asa das</Text>
				{item.latest_message &&
						<Text style={styles.lastMessage}>{item.is_latest_message_from_me ? "You:" : item.nickname} {item.latest_message}</Text>
				}
			</View>
		</TouchableOpacity>
	);

	return (
		<FlatList
			data={Peopele}
			renderItem={renderItem}
			keyExtractor={(item) => item.friendship_token}
			ItemSeparatorComponent={Separator}
			style={styles.flatList}
			showsVerticalScrollIndicator={false}
		/>
	);
}

const styles = StyleSheet.create({
	personChatContainer: {
		backgroundColor: colors.backgroundColor,
		borderRadius: 20,
		height: 80,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		marginHorizontal: 10,
	},
	personIcon: {
		backgroundColor: colors.accent,
		borderRadius: 5,
		height: "75%",
		aspectRatio: "1/1",
		margin: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	nameAndLastMessage: {
		flex: 1,
		height: "100%",
		flexDirection: "column",
		alignItems: "flex-start",
		justifyContent: "center",
		borderBottomColor: colors.underlineBlack,
		borderBottomWidth: 2,
		marginLeft: 5,
	},
	name: {
		fontFamily: "AlumniSans-Bold",
		fontSize: 34,
		lineHeight: 34,
		color: colors.white,
	},
	letter: {
		fontFamily: "AlumniSans-Bold",
		color: colors.primary,
		alignItems: "center",
		justifyContent: "center",
		fontSize: 30,
	},
	separator: {
		height: 0,
		backgroundColor: "#ddd",
		marginVertical: 5,
	},
	flatList: {
		flex: 1,
		margin: 5
	},
	delete_friend: {
		marginRight: 20,
	},
	lastMessage: {
		fontFamily: "AlumniSans-Regular",
		fontSize: 20,
		lineHeight: 34,
		color: colors.textGray,
	},
});
