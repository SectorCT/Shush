import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TextInput, Image } from 'react-native';
import { colors } from '../styles.js';
import { Header } from 'react-native/Libraries/NewAppScreen';
import QRScanner from '../components/QRScanner';
import QRCodeScanner from '../components/QRScanner';

const AddPeople = () => {
const [text, setText] = useState('');
  return (
    <>
        <StatusBar style="auto" />
        <View style={styles.islandHider} />
        <View style={styles.container}>
            <View style={styles.addPeople__header} >
                <Text style={styles.addPeople__header_title }>Add People</Text>
            </View>
            {/* Invite */}
            <View style = {styles.addPeople__invite_container}>
                <Text style={styles.addPeople__invite_text}>
                        Insert{' '}
                    <Text style={styles.addPeople__invite_text_blue}>invite code</Text>
                </Text>
                <View style={styles.input}>
                    <TextInput
                        style={styles.input__field}
                        value={text}
                        placeholder="Insert code"
                        onChangeText={(value) => setText(value.toUpperCase())}
                        maxLength={8}
                    />
                    <Image source = {require('../assets/next.png')} style = {styles.input__field_button}/>
                </View>
            </View>
            {/* QR */}
            <View style = {styles.addPeople__qr_container}>
                <Text style={styles.addPeople__invite_text}>
                        Or scan{' '}
                    <Text style={styles.addPeople__invite_text_blue}>QR code</Text>
                </Text>
                <Image source = {require('../assets/QR-clear.png')} style = {styles.input__qr_img}/>
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
    addPeople__header: {
        backgroundColor: colors.complimentary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    addPeople__header_title: {
        color: "#fff",
        fontSize: 30,
        // fontFamily: fonts.primary,
    },
    addPeople__invite_text: {
        color: '#fff',
        fontWeight: 400,
        fontSize: 30,
        lineHeight: 37,
        flex:0.25,
        width: '100%'
    },
    addPeople__invite_text_blue: {
        color: '#4BB2DE',
    },
    addPeople__invite_container : {
        margin: 30,
        flex: 1,
        padding: 0
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        width: '100%',
        height: 114,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.complimentary,
        justifyContent: 'space-between',
        fontSize: 30,
        color: '#fff',
        marginTop: 20,
        flex: 0.3

    },
    input__field: {
        padding: 10,
        width: '100%',
        height: '100%',
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.complimentary,
        fontSize: 30,
        color: '#fff',
        flex: 0.75,
    },
    input__field_button: {
        aspectRatio: '1/1',
        padding: 15,
        flex: 0.05,
        marginRight: 25

    },
    addPeople__qr_container: {
        margin: 30,
        flex: 1.5,
        width: '100%'
    },
    input__qr_img: {
    },
});

export default AddPeople;
