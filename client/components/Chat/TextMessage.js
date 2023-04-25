import { StyleSheet, View, Text } from "react-native";

export default function Message({ text, isOwn, isPreviousOwn, isNextOwn }) {
    let isOwnStyles = isOwn ? styles.messages_message_own : styles.messages_message_other;
    let concecativeOwnStyle;
    if (isOwn) {
        if (isPreviousOwn) {
            if (isNextOwn) {
                concecativeOwnStyle = styles.concecativeOwn_middle;
            } else {
                concecativeOwnStyle = styles.concecativeOwn_end;
            }
        } else {
            if (isNextOwn) {
                concecativeOwnStyle = styles.concecativeOwn_start;
            } else {
                concecativeOwnStyle = styles.concecativeOwn_single;
            }
        }
    }
    let messageColor = isOwn ? "#000" : "#ccc";
    console.log(isPreviousOwn, isOwn, isNextOwn);
    return (
        <View style={{ ...styles.messages_message, ...isOwnStyles, ...concecativeOwnStyle }}>
            <Text style={{ ...styles.messages_message_text, color: messageColor }}>{isPreviousOwn} {text} {isNextOwn}</Text>
        </View >
    );
}

const styles = StyleSheet.create({
    messages_message: {
        backgroundColor: colors.secondary,
        maxWidth: "90%",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    messages_message_own: {
        alignSelf: "flex-end",
        backgroundColor: colors.accent,
    },
    messages_message_other: {
        alignSelf: "flex-start",
    },
    messages_message_text: {
        padding: 0,
        fontSize: 20,
        color: "#000",
    },
    concecativeOwn_first: {
        borderTopRightRadius: 0,
    },
    concecativeOwn_middle: {
        borderBottomRightRadius: 0,
        borderTopRightRadius: 0,
    },
    concecativeOwn_last: {
        borderBottomRightRadius: 0,
    },
    concecativeOwn_single: {
        borderRadius: 20,
    },
});
