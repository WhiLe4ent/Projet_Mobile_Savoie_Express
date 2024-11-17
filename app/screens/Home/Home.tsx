import { View, KeyboardAvoidingView, StyleSheet, Image } from 'react-native';
import { Button, Text, Divider } from 'react-native-paper';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useStores } from '../../stores';
import { User } from '../../types/FirebaseUser';

const Home = () => {
  const { userStore } = useStores();
  const navigation = useNavigation<any>();
  const user: User | null = userStore.user;

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
      <KeyboardAvoidingView behavior="padding" style={styles.innerContainer}>

        {/* Affichage du logo */}
        <Image source={require('../../../assets/splash-icon.png')} style={styles.logo} />
        
        {/* Bienvenue et rôle de l'utilisateur */}
        <Text style={styles.welcomeText}>
          Bienvenue, <Text style={styles.roleText}>{user?.role ?? 'Utilisateur'}</Text> !
        </Text>

        <Divider style={styles.divider} />

        {/* Boutons pour les actions principales */}
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('AddDelivery')}
        >
          Ajouter une livraison
        </Button>

        <Button
          mode="contained"
          style={styles.button}
          onPress={() => navigation.navigate('TrackDelivery')}
        >
          Suivre une livraison
        </Button>

        <Button
          mode="outlined"
          style={styles.signOutButton}
          onPress={signOut}
        >
          Se déconnecter
        </Button>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  roleText: {
    color: '#FF6347', // Couleur différente pour le rôle
  },
  divider: {
    marginVertical: 20,
    width: '80%',
    height: 1,
    backgroundColor: '#DDD',
  },
  button: {
    marginVertical: 10,
    width: '80%',
    backgroundColor: '#007BFF',
  },
  signOutButton: {
    marginTop: 20,
    width: '80%',
    borderColor: '#FF6347',
  },
});
