import { StyleSheet, View, Text } from "react-native";

import emojiRegex from "emoji-regex";

const numberOfEmojis = 4;

function isStringOnlyEmojis(str) {
	const regex = emojiRegex();
	const matches = str.match(regex);
	if (matches === null) {
		return false;
	}
	if (matches.length > numberOfEmojis) {
		return false;
	}
	matches && matches.forEach((match) => {
		str = str.replace(match, "");
	});
	return str.length === 0;
}

export default function Message({ text, isOwn, isPreviousOwn, isNextOwn, isDisappearing}) {
	//emoji regex
	let isOwnStyles = isOwn ? styles.messages_message_own : styles.messages_message_other;
	let concecativeOwnStyle = {};
	let messageStyle = {};
	let messageTextStyle = {};
	let messageType = "text";

	text = text.trim();

	if (isOwn) {
		concecativeOwnStyle = { ...concecativeOwnStyle, borderTopRightRadius: 0 };
		if (isNextOwn !== null && isNextOwn === isOwn) {
			concecativeOwnStyle = { ...concecativeOwnStyle, borderBottomRightRadius: 0 };
		}
	} else {
		concecativeOwnStyle = { ...concecativeOwnStyle, borderTopLeftRadius: 0 };
		if (isNextOwn !== null && isNextOwn === isOwn) {
			concecativeOwnStyle = { ...concecativeOwnStyle, borderBottomLeftRadius: 0 };
		}
	}
	if (isNextOwn !== isOwn) {
		concecativeOwnStyle = { ...concecativeOwnStyle, marginBottom: 12 };
	}

	let messageColor = isOwn ? "#000" : "#fff";

	if (isStringOnlyEmojis(text)) {
		messageType = "emoji";
	}

	switch (messageType) {
	case "text":
		messageStyle = { ...messageStyle, ...styles.messages_text_message};
		messageTextStyle = { ...messageTextStyle, ...styles.messages_text_message_text, color: messageColor };
		if (isOwn) {
			messageStyle = { ...messageStyle, backgroundColor: colors.accent };
		}
		if(isDisappearing){
			messageStyle = { ...messageStyle, backgroundColor: "#ff686b" };
		}
		break;
	case "emoji":
		messageStyle = { ...messageStyle, ...styles.messages_emoji_message };
		messageTextStyle = { ...messageTextStyle, ...styles.messages_emoji_message_text };
		break;
	default:
		break;
	}

	messageStyle = { ...messageStyle, ...isOwnStyles, ...concecativeOwnStyle };


	return (
		<View style={messageStyle}>
			<Text style={messageTextStyle}> {text} </Text>
		</View >
	);
}

const styles = StyleSheet.create({
	messages_message_own: {
		alignSelf: "flex-end",
	},
	messages_message_other: {
		alignSelf: "flex-start",
	},
	messages_text_message: {
		backgroundColor: colors.secondary,
		maxWidth: "90%",
		paddingVertical: 10,
		paddingHorizontal: 15,
		borderRadius: 20,
	},
	messages_text_message_text: {
		padding: 0,
		fontSize: 18,
		color: "#000",
	},
	messages_emoji_message: {
		backgroundColor: "transparent",
	},
	messages_emoji_message_text: {
		padding: 0,
		fontSize: 40,
	}
});
