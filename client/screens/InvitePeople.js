import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image } from 'react-native';
import { colors } from '../styles.js';


const InvitePeople = () => {
    const [text, setText] = useState('');

    // useEffect(() => {
    //     console.log("fetch");
    //     fetch('http://192.168.43.51:8000/authentication/gettoken', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({
    //         })
    //     })
    //         .then(response => response.json())
    //         .then(data => {
    //             console.log("test");
    //         })
    //         .catch(error => {
    //             console.error(error);
    //         });

    // }, []);

    return (
        <>
            <StatusBar style="auto" />
            <View style={styles.islandHider} />
            <View style={styles.container}>
                <View style={styles.invitePeople__header} >
                    <Text style={styles.invitePeople__header_title}>Add People</Text>
                </View>

            </View>
        </>
    );
}


const styles = StyleSheet.create({
    islandHider: {
        backgroundColor: colors.complimentary,
        height: 40,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        width: '100%'
    },
    invitePeople__header: {
        backgroundColor: colors.complimentary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    invitePeople__header_title: {
        color: "#fff",
        fontSize: 30,
        // fontFamily: fonts.primary,
    },
});

export default InvitePeople;
