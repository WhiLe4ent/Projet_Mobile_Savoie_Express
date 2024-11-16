import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView} from 'react-native';
import React, {useState} from 'react';
import { NavigationProp } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';

interface RouterProps {
    navigation: NavigationProp<any, any>;
}

const HomeVendeur = ({navigation}: RouterProps) => {

    return (
        <View style = {styles.container}>
            <KeyboardAvoidingView behavior = "padding">
                <Text>Bienvenue cher Vendeur</Text>

                <Button title = "Ajouter une livraison" />
                <Button title = "Suivre une livraison" />
                <Button onPress={() => FIREBASE_AUTH.signOut()} title = "Se deconnecter" />
            </KeyboardAvoidingView>
        </View >
    )

}


export default HomeVendeur;

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