import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button } from 'react-native';
import { colors, fonts } from '../styles';
import { TextInput } from 'react-native-gesture-handler';

import { useState, useRef, useEffect } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import '../scripts/encryption-Secure.js'
import ImageButton from '../components/ImageButton';

import AsyncStorage from '@react-native-async-storage/async-storage';

import WebSocket from 'react-native-websocket';

import { SERVER_IP } from '@env';
import { makeRequest } from '../requests';


function Message({ text, isOwn }) {
    let extraStyles = isOwn ? styles.chat__messages_message_own : styles.chat__messages_message_other;
    let fontColor = isOwn ? "#000" : "#fff";
    return (
        <View style={{ ...styles.chat__messages_message, ...extraStyles }}>
            <Text style={{ ...styles.chat__text, color: fontColor }}> {text}</Text>
        </View >
    );
}

export default function Chat({ navigation }) {
    const [messages, setMessages] = useState([]);

    const [friendName, setFriendName] = useState(navigation.getParam('friendName'));
    const [friendshipId, setFriendshipId] = useState(navigation.getParam('friendshipId'));
    const [typedMessage, setTypedMessage] = useState("");

    const flatListRef = useRef();

    const ws = useRef(null);

    let Cookie = "";

    useEffect(() => {
        try {
            AsyncStorage.getItem('access_token').then((access_token) => {
                console.log(access_token);
                setMessages([]);
                makeRequest(`authentication/get_recent_messages/`, 'POST', { friendship_token: friendshipId })
                    .then((response) => {
                        if (response.status === 200) {
                            response.json().then((data) => {
                                const newMessages = []
                                for (let i = 0; i < data.messages.length; i++) {
                                    let isOwn = data.messages[i].isOwn;
                                    let text = data.messages[i].content;
                                    console.log(isOwn, text)
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
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    const handleOpen = () => {
        console.log('WebSocket connection opened');
    };

    const handleMessage = (event) => {
        let data = JSON.parse(event.data);
        // if (data.type === "message") {
        setMessages([...messages, {
            text: data.message,
            isOwn: false,
        }]);
        // }
    };

    const handleError = (error) => {
        console.error('WebSocket error:', error);
    };

    const handleClose = () => {
        console.log('WebSocket closed');
    };

    function handleSendMsg() {
        if (typedMessage.length === 0) return;
        setMessages([...messages, {
            text: typedMessage,
            isOwn: true,
        }]);
        setTypedMessage("");
        ws.current.send(JSON.stringify({
            type: "message",
            message: typedMessage,
            friendship_token: friendshipId,
        }));
    }

    return (
        <>
            <StatusBar style="light" />
            <WebSocket
                ref={ws}
                url={`ws://${SERVER_IP}:8000/ws/chat/${friendshipId}/`}
                headers={{
                    Cookie: Cookie,
                }}
                onOpen={handleOpen}
                onMessage={handleMessage}
                onError={handleError}
                onClose={handleClose}
            />
            <View style={styles.islandHider}></View>
            <View style={styles.chat__header} >
                <Text style={styles.chat__header_title}>{friendName}</Text>
                <ImageButton imageSource={require('../assets/cross.png')} style={styles.chat__imageItem} onPress={() => {
                    navigation.navigate('HomeScreen');
                }} />
            </View>
            <View style={styles.chat__container}>
                {messages.length === 0 ? <Text style={styles.no_messages}>No messages yet</Text> :
                    <FlatList
                        contentContainerStyle={styles.chat__messages}
                        data={messages}
                        renderItem={({ item }) => <Message
                            text={item.text}
                            isOwn={item.isOwn}
                        />}
                        keyExtractor={(item, index) => index.toString()}
                        ref={flatListRef}
                        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                    />
                }
            </View>

            <View style={styles.chat__sendMsg}>
                <TextInput
                    style={styles.chat__sendMsg_input}
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
    chat__imageItem: {
        width: 25,
        height: 25,
    },
    islandHider: {
        backgroundColor: colors.primary,
        height: 20,
        width: '100%',
    },
    chat__header: {
        backgroundColor: colors.primary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    chat__header_title: {
        color: colors.accent,
        fontSize: 40,
        // fontFamily: fonts.primary,
    },
    chat__container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.background,
        height: '100%',
    },
    chat__messages: {
        width: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingVertical: 10,
        paddingHorizontal: 30,
        gap: 15,
    },
    chat__messages_message: {
        backgroundColor: colors.secondary,
        padding: 20,
        width: "100%",
        maxWidth: "100%",
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
    chat__messages_message_own: {
        alignSelf: "flex-end",
        borderTopRightRadius: 0,
        backgroundColor: colors.accent,
    },
    chat__messages_message_other: {
        alignSelf: "flex-start",
        borderTopLeftRadius: 0,

    },
    chat__text: {
        padding: 0,
        fontSize: 20,
    },
    chat__sendMsg: {
        width: "100%",
        height: 80,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 30,
        paddingHorizontal: 30,
    },
    chat__sendMsg_input: {
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
    chat__sendMsg_btn: {
        backgroundColor: colors.primary,
        height: "100%",

    },
    no_messages: {
        color: colors.accent,
        fontSize: 20,
        alignSelf: 'center',
        marginTop: 20,
    },
});
