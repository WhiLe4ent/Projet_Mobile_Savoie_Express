import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SheetProvider } from 'react-native-actions-sheet';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import TabNavigator from './TabNavigator';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import DeliveryNavigator from './DeliveryNavigator';
import RoleNavigator from './RoleNavigator';
import Products from '../screens/Products/Products';
import ProductDetails from '../screens/Products/ProductDetails';
import { RootStackParamList } from './RootStackParamList';
import theme from '../settings/Theme';
import { white } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';

const Stack = createStackNavigator<RootStackParamList>();

const Navigations = observer(() => {
  const { userStore } = useStores(); // Access the user store
  const isLoggedIn = !!userStore.user; // Check if a user is logged in

  const headerStyle = {
    backgroundColor: 'transparent',
  };

  const headerTitleStyle = {
    color: 'white',
  };

  return (
    <NavigationContainer>
      <SheetProvider>
        <Stack.Navigator
          initialRouteName={isLoggedIn ? 'TabScreens' : 'Login'} // Navigate based on login state
          screenOptions={{
            headerStyle: {backgroundColor: theme.colors.primary},
            headerTitleStyle,
            headerBackTitle: '',
            headerTintColor: '#FFFFFF'
          }}
        >
              <Stack.Screen
                name="Login"
                options={{ headerShown: false }}
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
                options={{headerShown: false}}
              />
              <Stack.Screen
                  name="RoleScreens"
                  component={RoleNavigator}
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
