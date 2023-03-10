import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Button } from 'react-native';
import { colors, fonts } from '../styles';
import { TextInput } from 'react-native-gesture-handler';

import { useState, useRef } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';




function Message({ text, isOwn }) {
    let extraStyles = isOwn ? styles.chat__messages_message_own : styles.chat__messages_message_other;
    let fontColor = isOwn ? "#000" : "#fff";
    return (
        <View style={{ ...styles.chat__messages_message, ...extraStyles }}>
            <Text style={{ ...styles.chat__text, color: fontColor }}> {text}</Text>
        </View >
    );
}



export default function Chat() {
    const [messages, setMessages] = useState([
        {
            id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
            text: 'First Item',
            isOwn: true,
            expiresAt: 1620000000000,
        },
        {
            id: '3ac68afc-c605-48d3-a4f8-fb d91aa97f63',
            text: "Lorem ipsum dolo sit amet, consectetur adipisicing elit. Dolores obcaecati a quia vero doloribus vel ut neque aut odio blanditiis in magnam unde, rem sequi eum totam veritatis. Similique, consequatur.\
    Et quasi libero perspiciatis natus molestias delectus dolore a officia hic, vel molestiae perferendis rem nam placeat, quibusdam assumenda incidunt? Alias laudantium ipsam tempore laboriosam amet minima ad molestias sunt?\
    Voluptatum odio voluptates vitae laboriosam nostrum itaque animi, rerum quis, nam neque obcaecati.Accusantium, fugiat rem deleniti adipisci quisquam commodi distinctio quam, ut deserunt sit ducimus recusandae iste omnis? Temporibus.\
    Laborum ipsam reiciendis earum laudantium? Cum enim a accusantium saepe quaerat vel in necessitatibus iste at molestiae dignissimos voluptatibus, quod eos.Sunt aliquid recusandae ipsa.Dolore repellendus atque nam nesciunt?\
    Esse necessitatibus delectus saepe recusandae nisi error dolores veniam ratione similique maiores sint ea doloremque, accusantium quae voluptates unde perferendis iusto aut vel magni est quibusdam.Suscipit illo mollitia sed?\
    Ab tempore, non nihil quas autem eveniet quibusdam eligendi eos facilis.A quos impedit fugit ullam voluptate provident, doloribus libero assumenda iusto suscipit, ipsa incidunt ducimus est ipsum in harum?\
    Architecto mollitia tempora, quaerat optio veniam laborum.Necessitatibus, consequuntur asperiores, sint laudantium tempore id obcaecati molestiae itaque fuga similique aperiam voluptatum accusamus harum doloribus, doloremque aliquid reprehenderit.Ducimus, facere eligendi.\
    Aliquid ipsam sed voluptatem temporibus placeat ea, sapiente voluptates repellendus quisquam quasi quibusdam laudantium quo, fuga, et vel magnam ipsum provident doloremque ratione recusandae quod optio commodi doloribus aspernatur! Consequuntur.\
    Iure architecto nisi ratione perspiciatis culpa molestiae suscipit delectus repudiandae reprehenderit nesciunt.Ducimus perspiciatis omnis amet ratione veniam mollitia vitae accusantium dolores.Natus quod assumenda mollitia magni illum perferendis architecto.\
    Voluptatem vel eos corporis doloribus consequatur pariatur, exercitationem ratione, nihil deleniti eum sed veniam libero ut aliquid dolores quos impedit saepe officia.Optio quo laboriosam saepe ipsa, amet voluptate explicabo!",
            isOwn: false,
        },
        {
            id: '58694a0f-3da1-471f-bd96-145571e29d72',
            text: 'Third Item',
            isOwn: true,
        },
    ]);

    const [typedMessage, setTypedMessage] = useState("");

    const flatListRef = useRef();

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
            <View style={styles.islandHider}></View>
            <View style={styles.chat__header} >
                <Text style={styles.chat__header_title}>Friend Name</Text>
            </View>
            <View style={styles.chat__container}>
                <FlatList
                    contentContainerStyle={styles.chat__messages}
                    data={messages}
                    renderItem={({ item }) => <Message
                        text={item.text}
                        isOwn={item.isOwn}
                    />}
                    keyExtractor={item => item.id}
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
        </>
    );
}

const styles = StyleSheet.create({
    islandHider: {
        backgroundColor: colors.primary,
        height: 40,
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
        color: "#2CBCFA",
        fontSize: 30,
        // fontFamily: fonts.primary,
    },
    chat__container: {
        flex: 1,
        width: '100%',
        backgroundColor: colors.primary,
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
