import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SheetProvider } from 'react-native-actions-sheet';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import TabNavigator from './TabNavigator';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import DeliveryNavigator from './DeliveryNavigator';
import Products from '../screens/Products/Products';
import ProductDetails from '../screens/Products/ProductDetails';
import { RootStackParamList } from './RootStackParamList';
import theme from '../settings/Theme';
import { createNavigationContainerRef } from '@react-navigation/native';

// Créez une référence de navigation globale
export const navigationRef = createNavigationContainerRef<RootStackParamList>();


const Stack = createStackNavigator<RootStackParamList>();

const Navigations = observer(() => {
  const { userStore } = useStores(); // Accédez au store utilisateur
  const isLoggedIn = !!userStore.user; // Vérifiez si un utilisateur est connecté


  const headerTitleStyle = {
    color: 'white',
  };

  useEffect(() => {
    // Vérifiez si l'utilisateur est connecté à chaque changement d'état
    if (!userStore.user) {
      // Si l'utilisateur n'est pas connecté, redirigez vers la page Login
      navigationRef.navigate('Login');
    }
  }, [userStore.user]);

  return (
    <NavigationContainer ref={navigationRef}> {/* Référence de navigation */}
      <SheetProvider>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'TabScreens' : 'Login'} // Redirige en fonction de l'état de connexion
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTitleStyle,
            headerBackTitle: '',
            headerTintColor: '#FFFFFF',
          }}
        >
          <Stack.Screen
            name="Login"
            options={{ headerShown: false, gestureEnabled: false }}
            component={Login}
          />
          <Stack.Screen
            name="Register"
            options={{ headerShown: false }}
            component={Register}
          />
          <Stack.Screen
            name="TabScreens"
            options={{ headerShown: false }}
            component={TabNavigator}
          />
          <Stack.Screen
            name="Deliveries"
            component={DeliveryNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Products"
            component={Products}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ProductDetails"
            component={ProductDetails}
            options={{ title: 'Product Details' }}
          />
        </Stack.Navigator>
      </SheetProvider>
    </NavigationContainer>
  );
});

export default Navigations;
