import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button, TouchableOpacity } from 'react-native';
import { colors, fonts } from '../styles';
import { TextInput } from 'react-native-gesture-handler';

import { useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImageButton from '../components/ImageButton';

import AsyncStorage from '@react-native-async-storage/async-storage';

import WebSocket from 'react-native-websocket';

import { SERVER_IP } from '@env';
import { makeRequest } from '../requests';

import TextMessage from '../components/Chat/ChatMessage';
import AllMessages from '../components/Chat/AllMessages';

import { MaterialIcons } from '@expo/vector-icons';


export default function Chat({ navigation }) {
    const [messages, setMessages] = useState([]);

    const [friendName, setFriendName] = useState(navigation.getParam('friendName'));
    const [friendshipId, setFriendshipId] = useState(navigation.getParam('friendshipId'));
    const [typedMessage, setTypedMessage] = useState("");

    const flatListRef = useRef();

    const ws = useRef(null);

    const [isEdditingNickname, setIsEdditingNickname] = useState(false);

    let Cookie = "";

    const [mode, setMode] = useState("Normal");
    const [dissapearTime, setDissapearTime] = useState(5);

    useEffect(() => {
        try {
            setMessages([]);
            makeRequest(`authentication/get_recent_messages/`, 'POST', { friendship_token: friendshipId })
                .then((response) => {
                    if (response.status === 200) {
                        response.json().then((data) => {
                            console.log(data);
                            const newMessages = []
                            for (let i = 0; i < data.messages.length; i++) {
                                let isOwn = data.messages[i].isOwn;
                                let text = data.messages[i].content;
                                newMessages.push({
                                    text: text,
                                    isOwn: isOwn,
                                });
                            }
                            setMessages(newMessages)
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

    const handleOpen = () => {
        console.log('WebSocket connection opened');
    };

    function addMessage(text, isOwn) {
        setMessages([...messages, {
            text: text,
            isOwn: isOwn,
            timeToLive: mode === "Disappearing" ? 10 : -1, // -1 means the message never disappears
        }]);
    }

    const handleMessage = (event) => {
        let data = JSON.parse(event.data);
        // if (data.type === "message") {
        addMessage(data.message, false);
        // }
    };

    const handleError = (error) => {
        console.error('WebSocket error:', error);
    };

    const handleClose = () => {
        console.log('WebSocket closed');
    };

    function handleSendMsg() {
        console.log("send message friendName: " + friendName + " friendshipId: " + friendshipId)
        if (typedMessage.length === 0) return;
        setMessages([...messages, {
            text: typedMessage,
            isOwn: true,
            timeToLive: mode === "Disappearing" ? dissapearTime : -1,
        }]);
        setTypedMessage("");
        ws.current.send(JSON.stringify({
            message: typedMessage.trim(),
            friendship_token: friendshipId,
        }));
    }

    function handleAcceptNickname() {
        setIsEdditingNickname(false);
        makeRequest(`authentication/change_nickname/`, 'POST', { friendship_token: friendshipId, new_nickname: friendName })
            .then((response) => {
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
        setFriendName(navigation.getParam('friendName'));
    }

    function switchMode () {
        setMode(mode === "Normal" ? "Disappearing" : "Normal");
    };

    function updateMessagesTimeToLive() {
        setMessages(prevMessages => {
            const newMessages = prevMessages.map(msg => {
                if (msg.timeToLive === -1) {
                    return msg; // never expires
                } else {
                    const newTTL = msg.timeToLive - 1;
                    if (newTTL < 0) {
                        return null; // message has expired, remove it
                    } else {
                        return {...msg, timeToLive: newTTL};
                    }
                }
            });
            return newMessages.filter(msg => msg !== null); // remove expired messages
        });
    }
    
    useEffect(() => {
        const intervalId = setInterval(updateMessagesTimeToLive, 1000); // update timeToLive every second
        return () => clearInterval(intervalId);
    }, [messages]);

    return (
        <>
            <StatusBar style="light" />
            <WebSocket
                ref={ws}
                url={`wss://${SERVER_IP}/ws/chat/${friendshipId}/`}
                headers={{
                    Cookie: Cookie,
                }}
                onOpen={handleOpen}
                onMessage={handleMessage}
                onError={handleError}
                onClose={handleClose}
            />
            <View style={styles.islandHider}></View>
            <View style={styles.header} >
                {isEdditingNickname ?
                    <View style={styles.edit_nickname}>
                        <TextInput style={styles.header_title} value={friendName} onChangeText={(text) => setFriendName(text)}></TextInput>
                        <Icon name='check' size={25} color="#fff" style={styles.edit_icon} onPress={handleAcceptNickname}></Icon>
                        <Icon name='times' size={25} color="#fff" style={styles.edit_icon} onPress={handleDeclineNickname}></Icon>
                    </View> :
                    <View style={styles.edit_nickname}>
                        <Text style={styles.header_title}>{friendName}</Text>
                        <Icon name='edit' size={25} color="#fff" style={styles.edit_icon} onPress={() => { setIsEdditingNickname(true) }}></Icon>
                    </View>
                }
                <ImageButton imageSource={require('../assets/cross.png')} style={styles.imageItem} onPress={() => {
                    navigation.navigate('HomeScreen');
                }} />
            </View>
            <AllMessages messages={messages} />

            <View style={styles.sendMsg}>
                <TouchableOpacity onPress={switchMode}>
                    <Icon name={mode === "Normal" ? "eye" : "eye-slash"} size={24} color="white" />
                </TouchableOpacity>
                <TextInput
                    style={styles.sendMsg_input}
                    value={typedMessage}
                    onChangeText={(text) => setTypedMessage(text)}
                    placeholder="Type a message ..."
                    placeholderTextColor="#b4b4b4"
                />

                <Icon name='send' size={20} color="#fff" onPress={handleSendMsg}></Icon>
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
        width: '100%',
    },
    header: {
        backgroundColor: colors.primary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    edit_nickname: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    edit_icon: {
        marginLeft: 10,
    },
});
