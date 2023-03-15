import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colors } from '../styles';

export default function AddPeopleOrSeeCode({ navigation }) {
    return (
        <>
            <View style={styles.container}>
                <View style={styles.islandHider} />
                <Text style={styles.header}>Connect with Friends</Text>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoText}>To add a friend and start texting them one of you must share an unique invite code.</Text>
                    <Text style={styles.infoText}>You can see yours and share it to your friend or add theirs.</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        title='Invite'
                        style={styles.inviteButton}
                        onPress={() => {
                            navigation.navigate('InvitePeople');
                        }}
                    >
                        <Text style={styles.inviteButton_Text}>Invite</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        title='Add'
                        style={styles.addButton}
                        onPress={() => {
                            navigation.navigate('AddPeople');
                        }}
                    >
                        <Text style={styles.addButton_Text}>Add</Text>
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
    container: {
        flex: 1,
        backgroundColor: colors.primary,
    },
    header: {
        fontSize: 30,
        fontWeight: 'bold',
        color: "#fff",
        justifyContent: 'center',
        textAlign: 'center',
        paddingTop: 40,
    },
    infoContainer: {
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
        gap: 30,
    },
    infoText: {
        fontSize: 30,
        color: "#A9A9A9",
        textAlign: 'left',
    },

    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'flex-end',
        paddingBottom: 80,
    },

    inviteButton: {
        backgroundColor: colors.secondary,
        width: "40%",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    inviteButton_Text: {
        color: "#fff",
        fontSize: 25,
    },

    addButton: {
        backgroundColor: colors.accent,
        width: "40%",
        height: 50,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    addButton_Text: {
        color: colors.primary,
        fontSize: 25,
    },

});