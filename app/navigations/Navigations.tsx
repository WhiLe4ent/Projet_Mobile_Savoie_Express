import React, { useEffect } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
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
import * as Linking from 'expo-linking';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

const Stack = createStackNavigator<RootStackParamList>();

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['savoieexpress://', 'https://savoieexpress.com'],
  config: {
    screens: {
      Deliveries:  'DeliveriesList'
    },
  },
};


const Navigations = observer(() => {
  const { userStore } = useStores();
  const isLoggedIn = !!userStore.user;
  const url = Linking.useURL();

  const headerTitleStyle = {
    color: 'white',
  };

  useEffect(() => {
    if (!userStore.user) {
      navigationRef.navigate('Login');
    }
  }, [userStore.user]);

  return (
    <NavigationContainer ref={navigationRef} linking={linking}>
      <SheetProvider>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'TabScreens' : 'Login'} 
          screenOptions={{
            headerStyle: { backgroundColor: theme.colors.primary },
            headerTitleStyle,
            headerBackTitle: '',
            headerTintColor: '#FFFFFF',
            headerBackButtonDisplayMode: "minimal"
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
