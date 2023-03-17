import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles.js';
import { Header } from 'react-native/Libraries/NewAppScreen';
import QRScanner from '../components/QRScanner';
import QRCodeScanner from '../components/QRScanner';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { SERVER_IP } from '@env';

const AddPeople = ({ navigation }) => {
    const [text, setText] = useState('');

    function handleSubmit() {
        AsyncStorage.getItem('authCookie').then((cookie) => {
            fetch(`http://${SERVER_IP}:8000/authentication/make_friends/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': cookie,
                },
                body: JSON.stringify({
                    friend_token: text,
                }),
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        console.log(data);
                    });
                } else {
                    console.log("error");
                }
            }
            );
        }
        );
    }

    return (
        <>
            <StatusBar style="auto" />
            <View style={styles.islandHider} />
            <View style={styles.container}>
                <View style={styles.addPeople__header} >
                    <Text style={styles.addPeople__header_title}>Add People</Text>
                </View>
                {/* Invite */}
                <View style={styles.main}>
                    <View style={styles.addPeople__invite_container}>
                        <Text style={styles.addPeople__invite_text}>
                            Insert{' '}
                            <Text style={styles.addPeople__invite_text_blue}>invite code</Text>
                        </Text>
                        <View style={styles.input}>
                            <TextInput
                                style={styles.input__field}
                                value={text}
                                placeholder="Insert code"
                                placeholderTextColor={colors.complimentary}
                                onChangeText={(value) => setText(value.toUpperCase())}
                                maxLength={20}
                            />
                            <TouchableOpacity onPress={() => { }}>
                                <Image source={require('../assets/scanQr.png')} style={styles.input__field_button} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.inviteDevice__createAccountButton} onPress={() => { navigation.navigate('HomeScreen'); }}>
                        <Text style={styles.inviteDevice__createAccountButton_text}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    main: {
        flex: 1,
        margin: 40,
    },
    islandHider: {
        backgroundColor: colors.primary,
        height: 20,
        width: '100%',
    },
    container: {
        flex: 1,
        backgroundColor: colors.background,
        width: '100%',
    },
    addPeople__header: {
        backgroundColor: colors.primary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    addPeople__header_title: {
        color: colors.accent,
        fontSize: 40,
        // fontFamily: fonts.primary,
    },
    addPeople__invite_text: {
        color: '#fff',
        fontWeight: 400,
        fontSize: 35,
        lineHeight: 37,
        flex: 0.25,
        width: '100%'
    },
    addPeople__invite_text_blue: {
        color: '#4BB2DE',
    },
    addPeople__invite_container: {
        flex: 1,
        padding: 0
    },
    input: {
        padding: 10,
        width: '100%',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 30,
        color: '#fff',
        marginTop: 20,
        flex: 0.3

    },
    input__field: {
        padding: 10,
        width: '80%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: 70,
        fontSize: 30,
        color: '#fff',
        borderBottomColor: colors.secondary,
        borderBottomWidth: 2,
        marginTop: 20,
    },
    input__field_button: {
        height: 37,
        aspectRatio: '1/1',
        marginTop: 20,
    },
    addPeople__qr_container: {
        flex: 1.5,
        width: '100%'
    },
    input__qr_img: {
    },
    inviteDevice__createAccountButton: {
        backgroundColor: colors.secondary,
        color: colors.primary,
        borderRadius: 15,
        margin: 0,
        marginBottom: 20,
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inviteDevice__createAccountButton_text: {
        fontSize: 30,
        color: colors.textWhite
    },
});

export default AddPeople;
