import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image, TouchableOpacity } from 'react-native';
import { colors } from '../styles.js';
import QRCode from 'react-native-qrcode-svg';

const code = '2D8KL09S'
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

    const [inviteCode, setInviteCode] = useState('ITEWSDSD');

    return (
        <>
            <StatusBar style="auto" />
            <View style={styles.islandHider} />
            <View style={styles.container}>
                <View style={styles.invitePeople__header} >
                    <Text style={styles.invitePeople__header_title}>Add People</Text>
                </View>
                <View style={styles.invitePeople__flex}>
                    <View style={styles.invitePeople__descriptionview}>
                        <Text style={styles.invitePeople__description}>Let your friend insert/scan it</Text>
                        <Text style={styles.invitePeople__description}>Code: <Text style={styles.invitePeople__description_highlight}>{code}</Text></Text>
                    </View>
                    <View style = {styles.invitePeople__qrCode_view}>
                        <View style={{ borderWidth: 10, borderColor: 'white' }}>
                            <QRCode
                                value={code}
                                size={200}
                                color='black'
                                backgroundColor='white'
                            />
                        </View>
                    </View>
                    <TouchableOpacity style = {styles.invitePeople__createAccountButton}>
                        <Text style = {styles.invitePeople__createAccountButton_text}>Create</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    islandHider: {
        backgroundColor: colors.complimentary,
        height: 50,
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
        fontSize: 40,
        // fontFamily: fonts.primary,
    },
    invitePeople__flex: {
        flex:1,
        margin: 40,
        justifyContent: 'space-between'
    },
    invitePeople__description: {
        color: "#898989",
        fontSize: 32,
        lineHeight: 32,
        marginTop: 10
    },
    invitePeople__descriptionview: {
    },
    invitePeople__description_highlight: {
        fontSize: 34,
        color: '#fff',
    },
    invitePeople__createAccountButton: {
        backgroundColor: colors.accent,
        color: colors.primary,
        borderTopLeftRadius:15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 15,
        margin: 0,
        marginBottom: 20,
        width: '100%',
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
      },
      invitePeople__createAccountButton_text: {
        fontSize:30
      },
      invitePeople__qrCode_style: {
        alignSelf: 'center',
      },
      invitePeople__qrCode_view: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
        
      }
});

export default InvitePeople;
