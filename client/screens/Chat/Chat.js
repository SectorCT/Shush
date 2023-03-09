import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView, FlatList } from 'react-native';
import { colors, fonts } from '../../styles';

const DATA = [
    {
        id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
        text: 'First Item',
    },
    {
        id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
        text: 'Second Item',
    },
    {
        id: '58694a0f-3da1-471f-bd96-145571e29d72',
        text: 'Third Item',
    },
];

function Message({ text, isOwn }) {
    let alignSelf = isOwn ? "flex-end" : "flex-start";
    return (
        <View style={{ ...styles.chat__item, alignSelf }}>
            <Text style={styles.chat__text}> {text}</Text>
        </View >
    );
}

export default function Chat() {
    return (
        <>
            <View style={styles.chat__header} >
                <Text style={styles.chat__header_title}>Friend Name</Text>
            </View>
            <View style={styles.chat__container}>
                <FlatList
                    contentContainerStyle={styles.chat__messages}
                    data={DATA}
                    renderItem={({ item }) => <Message text={item.text} isOwn={false} />}
                    keyExtractor={item => item.id}
                />
            </View>

            <View style={styles.chat__sendMsg}>

            </View>
        </>
    );
}

const styles = StyleSheet.create({
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
        paddingHorizontal: 30
    },
    chat__messages: {
        width: "100%",
        height: "100%",
        flexDirection: "column",
        justifyContent: "flex-start",
        paddingVertical: 10,
        gap: 10,
    },
    chat__item: {
        backgroundColor: colors.secondary,
        padding: 20,
        width: "auto",
        maxWidth: "80%",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    chat__text: {
        fontSize: 20,
        color: "#fff",
    },
});
