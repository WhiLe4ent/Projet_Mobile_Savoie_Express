import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView} from 'react-native';
import React, {useState} from 'react';
import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = FIREBASE_AUTH;

    const signIn = async () => {
        setLoading(true);
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log(response);
        } catch (error: any){
            console.log(error);
            alert('Sign in failed: ' + error.message);
        }finally {
            setLoading(false);
        }
    }
    const signUp = async () => {
        setLoading(true);
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log(response);
            alert('Allez voir vos emails !');
        } catch (error: any){
            console.log(error);
            alert('Registraion failed: ' + error.message);
        }finally {
            setLoading(false);
        }
    }

    return (
        <View style = {styles.container}>
            <KeyboardAvoidingView behavior = "padding">
                <TextInput value={email} style ={styles.input} placeholder = "Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput value={password} secureTextEntry={true} style ={styles.input} placeholder = "password" autoCapitalize="none" onChangeText={(text) => setPassword(text)}></TextInput>

                {
                    loading ? <ActivityIndicator size="large" color="#0000ff" />: 
                    <>
                    <Button title="Se connecter" onPress={signIn}/>
                    <Button title="Creer compte" onPress={signUp}/>
                    </>
                }
            </KeyboardAvoidingView>
        </View >
    )

}


export default Login;

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