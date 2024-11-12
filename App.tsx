import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Login from './app/screens/login/Login';
import HomeVendeur from './app/screens/home/HomeVendeur';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './FirebaseConfig';

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
  return(
    <InsideStack.Navigator>
      <InsideStack.Screen name="Vendeur page" component={HomeVendeur} />
    </InsideStack.Navigator>
  );
}


export default function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    });
  }, []);
  
  return (

    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        {user ? (
          <Stack.Screen name = "Inside" component= {InsideLayout}  options={{headerShown: false}} />

        ) : (
          <Stack.Screen name = "Login" component= {Login}  options={{headerShown: false}} />

        )}
      </Stack.Navigator>

    </NavigationContainer>



  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
