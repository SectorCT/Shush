import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TextInput } from 'react-native';
import { colors } from '../styles.js';

const SignScreen = () => {
    const [text, setText] = useState('');
    return (
        <>
            <StatusBar style="auto" />
            <View style={styles.islandHider} />
            <View style={styles.container}>
                <View style={styles.sign__header} >
                    <Text style={styles.sign__header_title}>Create account</Text>

                </View>
                <TextInput
                    style={styles.input__field}
                    value={text}
                    placeholder="Password"
                    onChangeText={(value) => setText(value.toUpperCase())}
                    maxLength={8}
                />
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
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        width: '100%'
    },
    sign__header: {
        backgroundColor: colors.primary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    sign__header_title: {
        color: "#fff",
        fontSize: 30,
    },
    input__field: {
        padding: 10,
        width: '100%',
        height: '100%',
        borderRadius: 20,
        alignItems: 'center',
        fontSize: 30,
        color: '#fff',
        flex: 0.75,
    }
});

export default SignScreen;
