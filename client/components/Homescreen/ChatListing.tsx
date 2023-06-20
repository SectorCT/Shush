import React, { useEffect, useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { HomeStackParamList } from "../../screens/Routes";

import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { colors } from "../../styles";

import Icon from "react-native-vector-icons/FontAwesome";

import { makeRequest } from "../../requests";

const Separator = () => <View style={styles.separator} />;


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



	function handleDeleteFriend(friendshipId: string) {
		makeRequest("authentication/remove_friend/", "POST", { friendship_token: friendshipId }).then((response) => {
			if (response === null) {
				return;
			}

			if (response.status === 200) {
				response.json().then((data) => {
					console.log("Friend deleted", data);
					refresh();
				});
			} else {
				response.json().then((data) => {
					console.log("Error while deleting friend", response.status, data.message);
				});
			}
		});
	}

	type ChatListItem = {
		nickname: string;
		friendship_token: string;
		latest_message: string;
		is_latest_message_from_me: boolean;
	};

	const renderItem = ({ item }: { item: ChatListItem }) => (
		<TouchableOpacity
			style={styles.personChat}
			onPress={
				() => handleOpenChat(item.nickname, item.friendship_token)
			}
		>
			<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<View style={styles.personIcon}>
					<Text style={styles.letter}>{item.nickname[0]?.toUpperCase()}</Text>
				</View>
				<View>
					<Text style={styles.name}>{item.nickname}</Text>
					{item.latest_message &&
						<Text style={styles.lastMessage}>{item.is_latest_message_from_me ? "You:" : item.nickname} {item.latest_message}</Text>
					}
				</View>
			</View>
			<Icon name='trash' size={25} color="#fff" style={styles.delete_friend} onPress={() => { handleDeleteFriend(item.friendship_token); }}></Icon>
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
	personChat: {
		backgroundColor: colors.secondary,
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
	},
	personIcon: {
		backgroundColor: colors.accent,
		borderRadius: 90,
		height: "75%",
		aspectRatio: "1/1",
		margin: 8,
		alignItems: "center",
		justifyContent: "center",
	},
	name: {
		marginLeft: 12,
		fontWeight: "900",
		fontSize: 23,
		lineHeight: 34,
		color: colors.textWhite,
	},
	letter: {
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
		marginLeft: 12,
		fontWeight: "400",
		fontSize: 15,
		lineHeight: 34,
		color: colors.textWhite,
	},
});
