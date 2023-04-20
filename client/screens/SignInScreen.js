import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, TextInput, Button } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import ImageButton from '../components/ImageButton.js';
import { colors } from '../styles.js';

import { AuthContext } from '../AuthContext.js';

import AsyncStorage from '@react-native-async-storage/async-storage';

const SignInScreen = ({ navigation }) => {
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');

    const [error, setError] = useState('');

    const { login } = useContext(AuthContext);

    useEffect(() => {
        AsyncStorage.getItem('userToken').then((value) => {
            setCode(value);
        });
    }, []);

    function verrifyCodeAndPass() {
        if (code.length < 8) {
            setError('Code must be at least 8 characters long');
            return false;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return false;
        }
        setError('');
        return true;
    }

    function handleSubmit() {
        if (!verrifyCodeAndPass()) {
            return;
        }
        login(code, password);
    }
    return (
        <>
            <StatusBar style="auto" />
            <View style={styles.islandHider} />
            <View style={styles.container}>
                <View style={styles.header} >
                    <Text style={styles.header_title}>Link account</Text>
                </View>
                <View style={styles.main}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input__field}
                            value={code}
                            placeholder="Your Code"
                            placeholderTextColor="#525252"
                            onChangeText={(value) => setCode(value)}
                        />
                        <TextInput
                            style={styles.input__field}
                            value={password}
                            placeholder="Password"
                            onChangeText={(value) => setPassword(value)}
                            maxLength={32}
                            secureTextEntry={true}
                            placeholderTextColor="#525252"
                        />
                        <TouchableOpacity style={styles.logInButton} onPress={() => { navigation.navigate('SignUp'); }}>
                            <Text style={styles.logInButton_text}>Don't have an account?</Text>
                        </TouchableOpacity>
                    </View>
                    {error !== '' &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorContainer_text}>{error}</Text>
                        </View>
                    }
                    <TouchableOpacity style={styles.createAccountButton} onPress={handleSubmit}>
                        <Text style={styles.createAccountButton_text}>Link Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}


const styles = StyleSheet.create({
    islandHider: {
        backgroundColor: colors.primary,
        height: 20,
        width: '100%',
    },
    main: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-between',
        backgroundColor: colors.backgroundColor,
        marginBottom: 40
    },
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
    },
    header: {
        backgroundColor: colors.primary,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    header_title: {
        color: "#fff",
        fontSize: 40,
    },
    input__field: {
        padding: 10,
        width: '100%',
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
    inputContainer: {
        margin: 40,
        marginTop: 70,
        height: '24%',
        justifyContent: 'flex-start',
        flex: 1
    },
    logInButton: {
        marginTop: 30,
    },
    logInButton_text: {
        color: '#fff',
        textDecorationLine: 'underline',
        fontSize: 20,
        padding: 10
    },
    createAccountButton: {
        backgroundColor: colors.accent,
        color: colors.primary,
        borderRadius: 15,
        marginBottom: 20,
        width: '80%',
        margin: 40,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    createAccountButton_text: {
        fontSize: 30
    },
    errorContainer: {
        backgroundColor: colors.secondary,
        width: '80%',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 15,
        padding: 20
    },
    errorContainer_text: {
        color: '#fff',
        fontSize: 20,
    }

});

export default SignInScreen;