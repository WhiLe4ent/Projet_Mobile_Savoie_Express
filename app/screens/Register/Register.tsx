import React, { useState } from 'react';
import { View, Text,TextInput, Button, StyleSheet, KeyboardAvoidingView, Alert, ScrollView, Platform, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker'; 

type RegisterRouteProps = {
  email?: string;
  password?: string;
};

const Register = () => {
  const route = useRoute();
  const navigation = useNavigation<any>()
  const { email: initialEmail, password: initialPassword } = route.params as RegisterRouteProps;

  const [email, setEmail] = useState(initialEmail || '');
  const [password, setPassword] = useState(initialPassword || '');
  const [pseudo, setPseudo] = useState('');
  const [role, setRole] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false); // Contrôle de l'affichage du Picker

  const handleCreateAccount = async () => {
    if (!email || !password || !pseudo || !role) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    try {
      const response = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const userId = response.user.uid;

      // Crée ou remplace le document utilisateur (si t'as des problèmes de droits faut aller sur firebase tu cliques sur la collection et tu vas dans règles et tu modifies !)
      await setDoc(doc(FIREBASE_DB, 'Users', userId), {
        email: email,
        pseudo: pseudo,
        role: role,
        createdAt: new Date().toISOString(),
      });

      Alert.alert('Success', 'Account created successfully!');
    } catch (error: any) {
      console.error(error);
      Alert.alert('Error', error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      // Gestion du clavier sur iOS et Android
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
    >
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <TextInput
          value={email}
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={setEmail}
        />
        <TextInput
          value={password}
          secureTextEntry
          style={styles.input}
          placeholder="Password"
          autoCapitalize="none"
          onChangeText={setPassword}
        />
        <TextInput
          value={pseudo}
          style={styles.input}
          placeholder="Pseudo"
          onChangeText={setPseudo}
        />

        <TouchableOpacity onPress={() => setPickerVisible(!isPickerVisible)} style={styles.input}>
          <Text>{role || 'Select Role'}</Text>
        </TouchableOpacity>

        {isPickerVisible && (
          <Picker
            selectedValue={role}
            onValueChange={(itemValue: string) => {
              setRole(itemValue);
              setPickerVisible(false); 
            }}
            style={styles.input}
          >
            <Picker.Item label="Vendeur" value="Vendeur" />
            <Picker.Item label="RCO" value="RCO" />
            <Picker.Item label="FinancialManager" value="FinancialManager" />
            <Picker.Item label="Secretariat" value="Secretariat" />
            <Picker.Item label="ExpertProduit" value="ExpertProduit" />
          </Picker>
        )}

        <Button title="Créer compte" onPress={handleCreateAccount} />
      </ScrollView>
      
    </KeyboardAvoidingView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center', 
  },
  input: {
    marginVertical: 8,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});
