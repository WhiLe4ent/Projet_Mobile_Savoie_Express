import { View, KeyboardAvoidingView, StyleSheet } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useStores } from '../../stores';
import { User } from '../../types/FirebaseUser';

const Home = () => {
  const { userStore } = useStores();
  const theme = useTheme();
  const navigation = useNavigation<any>();
  const user: User | null = userStore.user;

  console.log(JSON.stringify(user, null, 3));

  const signOut = async () => {
    try {
      await userStore.disconnect();
      navigation.navigate('Login');
    } catch (e) {
      console.warn('Error during sign-out:', e);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text>Bienvenue {user?.role ?? 'Utilisateur'}</Text>
        <Button mode="text" onPress={() => navigation.navigate('Login')}>
          Ajouter une livraison
        </Button>

        <Button mode="text">Suivre une livraison</Button>

        <Button mode="contained" onPress={signOut}>
          Se déconnecter
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
});
