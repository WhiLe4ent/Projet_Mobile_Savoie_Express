import {View, Text, KeyboardAvoidingView, Button, StyleSheet} from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../../FirebaseConfig'

const HomeRco = () => {
    return (
        <View style = {styles.container}>
            <KeyboardAvoidingView behavior = "padding">
                <Text>Bienvenue cher RCO</Text>

                <Button title = "Ajouter une livraison" />
                <Button title = "Suivre une livraison" />
                <Button onPress={() => FIREBASE_AUTH.signOut()} title = "Se deconnecter" />
            </KeyboardAvoidingView>
        </View >
    )
}


export default HomeRco

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        flex: 1,
        justifyContent: 'center'
    },
    input: {
        marginVertical: 4,
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        padding: 10,
        backgroundColor: '#fff'
    }
})