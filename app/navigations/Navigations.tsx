import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SheetProvider } from 'react-native-actions-sheet';
import { observer } from 'mobx-react';
import { useStores } from '../stores';
import TabNavigator from './TabNavigator';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import Home from '../screens/Home/Home';
import DeliveryNavigator from './DeliveryNavigator';
import RoleNavigator from './RoleNavigator';
import Products from '../screens/Products/Products';

const Stack = createStackNavigator();

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
            headerStyle,
            headerTitleStyle,
            headerBackTitle: '',
          }}
        >
          {!isLoggedIn ? (
            // Auth screens for not logged-in users
            <>
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
            </>
          ) : (
            // Main screens for logged-in users
            <>
                <Stack.Screen
                    name="TabScreens"
                    options={{ headerShown: false }}
                    component={TabNavigator}
                />
                <Stack.Screen
                    name="Home"
                    options={{ headerShown: false }}
                    component={Home}
                />
                <Stack.Screen
                    name="DeliveryScreens"
                    component={DeliveryNavigator}
                    options={{ headerShown: false }}
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
            </>
          )}
        </Stack.Navigator>
      </SheetProvider>
    </NavigationContainer>
  );
});

export default Navigations;
