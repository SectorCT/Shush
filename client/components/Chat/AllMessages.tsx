import { FlatList, View, Text, StyleSheet } from "react-native";
import React, { useRef } from "react";
import { colors } from "../../styles";

import TextMessage from "./ChatMessage";

interface IAllMessagesProps {
	messages: IMessage[];
}

interface IMessage {
	text: string;
	isOwn: boolean;
	timeToLive: number;
}

export default function AllMessages({ messages = [] }: IAllMessagesProps) {
	const flatListRef = useRef();


	function isNextMessageOwn(index: number) {
		if (messages.length < index + 1) {
			return false;
		}

		if (index < messages.length) {
			if (messages[index + 1] == null) {
				return false;
			}

			return messages[index + 1].isOwn;
		} else {
			return false;
		}
	}

	return (
		<View style={styles.container}>
			{messages.length === 0 ? <Text style={styles.no_messages}>No messages yet</Text> :
				<FlatList
					contentContainerStyle={styles.messages}
					data={messages}
					renderItem={({ item, index }) => <TextMessage
						text={item.text}
						isOwn={item.isOwn}
						isPreviousOwn={index > 0 ? messages[index - 1].isOwn : false}
						isNextOwn={isNextMessageOwn(index)}
						isDisappearing={item.timeToLive > -1}
					/>}
					keyExtractor={(item, index) => index.toString()}
					ref={flatListRef}
					onContentSizeChange={() => {
						if (flatListRef == null || flatListRef.current == null) {
							return;
						}
						flatListRef.current.scrollToEnd({ animated: true });
					}}
				/>
			}
		</View>
	);
}

const styles = StyleSheet.create({
	imageItem: {
		width: 25,
		height: 25,
	},
	islandHider: {
		backgroundColor: colors.primary,
		height: 20,
		width: "100%",
	},
	header: {
		backgroundColor: colors.primary,
		height: 60,
		width: "100%",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 30,
	},
	header_title: {
		color: colors.accent,
		fontSize: 40,
	},
	container: {
		flex: 1,
		width: "100%",
		backgroundColor: colors.backgroundColor,
		height: "100%",
	},
	messages: {
		width: "100%",
		flexDirection: "column",
		justifyContent: "flex-start",
		paddingVertical: 10,
		paddingHorizontal: 30,
		gap: 5,
	},
	messages_message: {
		backgroundColor: colors.secondary,
		padding: 20,
		maxWidth: "90%",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 20,
		// iOS shadow properties
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		// Android elevation property
		elevation: 5,
	},
	messages_message_own: {
		alignSelf: "flex-end",
		borderTopRightRadius: 0,
		backgroundColor: colors.accent,
	},
	messages_message_other: {
		alignSelf: "flex-start",
		borderTopLeftRadius: 0,

	},
	messages_message_text: {
		padding: 0,
		fontSize: 20,
		color: "#000",
	},
	sendMsg: {
		width: "100%",
		height: 80,
		backgroundColor: colors.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 30,
		paddingHorizontal: 30,
	},
	sendMsg_input: {
		backgroundColor: colors.primary,
		borderBottomColor: colors.secondary,
		maxHeight: 50,
		borderBottomWidth: 3,
		color: "#fff",
		width: "80%",
		height: "80%",
		paddingVertical: 0,
		fontSize: 20,
	},
	sendMsg_btn: {
		backgroundColor: colors.primary,
		height: "100%",

	},
	no_messages: {
		color: colors.accent,
		fontSize: 20,
		alignSelf: "center",
		marginTop: 20,
	},
	edit_nickname: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	edit_icon: {
		marginLeft: 10,
	},
});
