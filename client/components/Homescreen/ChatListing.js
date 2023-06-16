import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from "react-native";
import { colors, fonts } from "../../styles";

import Icon from "react-native-vector-icons/FontAwesome";

import { makeRequest } from "../../requests.js";

const Separator = () => <View style={styles.separator} />;


export default function ChatListing({ navigation }) {
	const [Peopele, setPeopele] = useState([]);
	function refresh() {
		try {
			makeRequest("authentication/list_friends/").then((response) => {
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
		const unsubscribe = navigation.addListener("didFocus", () => {
			refresh();
		});
		return () => {
			unsubscribe.remove();
		};
	}, []);

	const handleOpenChat = (friendName, friendshipId) => {
		navigation.navigate("Chat", { friendName, friendshipId });
	};

	const handleDeleteFriend = (friendshipId) => {
		makeRequest("authentication/remove_friend/", "POST", { friendship_token: friendshipId }).then((response) => {
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
	};

	const renderItem = ({ item }) => (
		<TouchableOpacity
			style={styles.prChat__personChat}
			onPress={
				() => handleOpenChat(item.nickname, item.friendship_token)
			}
		>
			<View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
				<View style={styles.prChat__personIcon}>
					<Text style={styles.prChat__letter}>{item.nickname[0].toUpperCase()}</Text>
				</View>
				<View>
					<Text style={styles.prChat__name}>{item.nickname}</Text>
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
			keyExtractor={(item, index) => index.toString()}
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
	prChat__personIcon: {
		backgroundColor: colors.accent,
		borderRadius: 90,
		height: "75%",
		aspectRatio: "1/1",
		margin: 8,
		alignItems: "center",
		justifyContent: "center",
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
		alignItems: "center",
		justifyContent: "center",
		fontSize: 30,
	},
	separator: {
		height: 0,
		backgroundColor: "#ddd",
		marginVertical: 5,
	},
	prChat__flatList: {
		flex: 1,
		margin: 5
	},
	delete_friend: {
		marginRight: 20,
	}
});
