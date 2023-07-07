import React from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { HomeStackParamList } from "@navigation/HomeStack";


import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { colors} from "../../styles";
import { TextInput } from "react-native-gesture-handler";


import { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import ImageButton from "../../components/ImageButton";

const SERVER_IP = process.env.SERVER_IP ?? "localhost";
const SERVER_SOCKET_PORT = process.env.SERVER_SOCKET_PORT ?? "3001";

import { makeRequest } from "../../utils/requests";

import AllMessages from "../../components/Chat/AllMessages";



type ChatScreenProps = {
	navigation : StackNavigationProp<HomeStackParamList, "Chat">;
	route: RouteProp<HomeStackParamList, "Chat">;
};

interface IMessage {
	text: string;
	isOwn: boolean;
	timeToLive: number;
}

export default function Chat({ navigation, route } : ChatScreenProps) {

	const [messages, setMessages] = useState<IMessage[]>([]);

	const [friendName, setFriendName] = useState(route.params.friendName);
	const friendshipId = route.params.friendName;
	const [typedMessage, setTypedMessage] = useState("");

	const ws = new WebSocket(`ws://${SERVER_IP}:${SERVER_SOCKET_PORT}/ws/chat/${friendshipId}/`);

	const [isEdditingNickname, setIsEdditingNickname] = useState(false);

	const [mode, setMode] = useState("Normal");
	const dissapearTime = 5;

	useEffect(() => {
		try {
			setMessages([]);
			makeRequest("authentication/get_recent_messages/", "POST", { friendship_token: friendshipId })
				.then((response) => {
					if (response == null) {
						console.log("response is null");
						return;
					}
					if (response.status === 200) {
						response.json().then((data) => {
							console.log(data);
							const newMessages = [];
							for (let i = 0; i < data.messages.length; i++) {
								const isOwn = data.messages[i].isOwn;
								const text = data.messages[i].content;
								newMessages.push({
									text: text,
									isOwn: isOwn,
								});
							}
							setMessages(newMessages as IMessage[]);
						});
					} else {
						console.log("error");
					}
				}
				);
		} catch (error) {
			console.log(error);
		}
	}, []);

	useEffect(() => {
		ws.onopen = handleSocketOpen;
		ws.onmessage = handleSocketMessage;
		ws.onerror = handleSocketError;
		ws.onclose = handleSocketClose;
		ws.onclose = () => {
			console.log("WebSocket closed");
			navigation.navigate("HomeScreen");
		};
	}, []);



	const handleSocketOpen = () => {
		console.log("WebSocket connection opened");
	};

	function addMessage(text: string, isOwn: boolean) {
		setMessages([...messages, {
			text: text,
			isOwn: isOwn,
			timeToLive: mode === "Disappearing" ? 10 : -1, // -1 means the message never disappears
		}]);
	}

	const handleSocketMessage= (event: WebSocketMessageEvent) => {
		const data = JSON.parse(event.data);
		// if (data.type === "message") {
		addMessage(data.message, false);
		// }
	};

	const handleSocketError = (error: WebSocketErrorEvent) => {
		console.error("WebSocket error:", error);
	};

	const handleSocketClose = () => {
		console.log("WebSocket closed");
	};

	function handleSendMsg() {
		console.log("send message friendName: " + friendName + " friendshipId: " + friendshipId);
		if (typedMessage.length === 0) return;
		setMessages([...messages, {
			text: typedMessage,
			isOwn: true,
			timeToLive: mode === "Disappearing" ? dissapearTime : -1,
		}]);
		setTypedMessage("");
		ws.send(JSON.stringify({
			message: typedMessage.trim(),
			friendship_token: friendshipId,
		}));
	}

	function handleAcceptNickname() {
		setIsEdditingNickname(false);
		makeRequest("authentication/change_nickname/", "POST", { friendship_token: friendshipId, new_nickname: friendName })
			.then((response) => {
				if (response == null) {
					return;
				}
				if (response.status === 200) {
					console.log("success");
				} else {
					console.log("error");
				}
			}
			);
	}

	function handleDeclineNickname() {
		setIsEdditingNickname(false);
		setFriendName(route.params.friendName);
	}

	function switchMode () {
		setMode(mode === "Normal" ? "Disappearing" : "Normal");
	}

	function updateMessagesTimeToLive() {
		const prevMessages = messages;
		const newMessages = prevMessages.map((msg) => {
			if (msg.timeToLive === -1) {
				return msg; // never expires
			} else {
				const newTTL = msg.timeToLive - 1;
				if (newTTL < 0) {
					return null;
				} else {
					return {...msg, timeToLive: newTTL};
				}
			}
		});
		setMessages(newMessages.filter((msg) => msg !== null) as IMessage[]); // remove expired messages
	}
    
	useEffect(() => {
		const intervalId = setInterval(updateMessagesTimeToLive, 1000); // update timeToLive every second
		return () => clearInterval(intervalId);
	}, [messages]);

	return (
		<>
			<StatusBar style="light" />
			<View style={styles.islandHider}></View>
			<View style={styles.header} >
				{isEdditingNickname ?
					<View style={styles.edit_nickname}>
						<TextInput style={styles.header_title} value={friendName} onChangeText={(text) => setFriendName(text)}></TextInput>
						<FontAwesome name='check' size={25} color={colors.white} style={styles.edit_icon} onPress={handleAcceptNickname}/>
						<FontAwesome name='times' size={25} color={colors.white} style={styles.edit_icon} onPress={handleDeclineNickname}/>
					</View> :
					<View style={styles.edit_nickname}>
						<Text style={styles.header_title}>{friendName}</Text>
						<FontAwesome name='edit' size={25} color={colors.white} style={styles.edit_icon} onPress={() => { setIsEdditingNickname(true); }}/>
					</View>
				}
				<ImageButton imageSource={require("../../assets/cross.png")} style={styles.imageItem} onPress={() => {
					navigation.navigate("HomeScreen");
				}} />
			</View>
			<AllMessages messages={messages} />

			<View style={styles.sendMsg}>
				<TouchableOpacity onPress={switchMode}>
					<FontAwesome name={mode === "Normal" ? "eye" : "eye-slash"} size={24} color="white" />
				</TouchableOpacity>
				<TextInput
					style={styles.sendMsg_input}
					value={typedMessage}
					onChangeText={(text) => setTypedMessage(text)}
					placeholder="Type a message ..."
					placeholderTextColor="#b4b4b4"
				/>

				<FontAwesome name='send' size={20} color={colors.white} onPress={handleSendMsg}/>
			</View>
			<View style={styles.downSpace} />
		</>
	);
}

const styles = StyleSheet.create({
	imageItem: {
		width: 25,
		height: 25,
	},
	islandHider: {
		backgroundColor: colors.primary,
		height: 30,
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
		fontSize: 45,
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
		color: colors.white,
		width: "80%",
		height: "80%",
		paddingVertical: 0,
		fontSize: 20,
	},
	sendMsg_btn: {
		backgroundColor: colors.primary,
		height: "100%",

	},
	edit_nickname: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	edit_icon: {
		marginLeft: 10,
	},
	downSpace: {
		height: 30,
		width: "100%",
		backgroundColor: colors.primary,
	},

});
