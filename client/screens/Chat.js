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



const serverIP = '192.168.7.149';

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
    const [typedMessage, setTypedMessage] = useState("");

    const flatListRef = useRef();


    let Cookie = "";

    useEffect(() => {

        AsyncStorage.getItem('authCookie').then((cookie) => {
            Cookie = cookie;
            setMessages([]);
            fetch(`http://${serverIP}:8000/authentication/get_recent_messages/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie,
                },
                body: JSON.stringify({
                    nickname: friendName,
                }),
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        console.log(data);
                        for (let i = 0; i < data.messages.length; i++) {
                            let isOwn = data[i].isOwn;
                            let text = data[i].content;
                            setMessages([...messages, {
                                text: text,
                                isOwn: isOwn,
                            }]);
                        }
                    });
                } else {
                    console.log("error");
                }
            }
            );
        });
    }, []);


    const handleOpen = () => {
        console.log('WebSocket connection opened');
    };

    const handleMessage = (event) => {
        setMessage(event.data);
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
            id: Math.random().toString(),
            text: typedMessage,
            isOwn: true,
        }]);
        setTypedMessage("");
    }

    return (
        <>
            {/* <WebSocket
                url='ws://192.168.7.149:8000/ws/chat/1/'
                headers={
                    {
                        "Cookie": Cookie,
                    }
                }
                onOpen={handleOpen}
                onMessage={handleMessage}
                onError={handleError}
                onClose={handleClose}
                reconnect={true}
                reconnectInterval={30000}
            /> */}
            <View style={styles.islandHider}></View>
            <View style={styles.chat__header} >
                <Text style={styles.chat__header_title}>{friendName}</Text>
                <ImageButton imageSource={require('../assets/cross.png')} style={styles.chat__imageItem} onPress={() => {
                    navigation.navigate('HomeScreen');
                }} />
            </View>
            <View style={styles.chat__container}>
                <FlatList
                    contentContainerStyle={styles.chat__messages}
                    data={messages.length === 0 ? [{ text: "No messages yet", isOwn: false }] : messages}
                    renderItem={({ item }) => <Message
                        text={item.text}
                        isOwn={item.isOwn}
                    />}
                    keyExtractor={(item, index) => index.toString()}
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
                />
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
    downSpace: {
        backgroundColor: colors.primary,
        height: 50,
        width: '100%',
    },
    islandHider: {
        backgroundColor: colors.primary,
        height: 50,
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
        height: 60,
        backgroundColor: colors.primary,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 30,
        paddingHorizontal: 30,
    },
    chat__sendMsg_input: {
        backgroundColor: colors.primary,
        borderBottomColor: colors.secondary,
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
    chat__sendMsg_btn_text: {
        fontSize: 20,
        color: colors.accent,
    },
});
