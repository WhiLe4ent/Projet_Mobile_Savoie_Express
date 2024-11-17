import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SheetProvider } from 'react-native-actions-sheet';
import TabNavigator from './TabNavigator';
import Login from '../screens/Login/Login';
import Register from '../screens/Register/Register';
import Home from '../screens/Home/Home';

const Stack = createStackNavigator()

const Navigations = () => 
{
    const headerStyle = {
        backgroundColor: 'transparent'
    };

    const headerTitleStyle = {
        color: 'white',
    };

    return (
        <NavigationContainer>
            <SheetProvider>
                <Stack.Navigator 
                    initialRouteName={'Login'}            
                    screenOptions={{
                        headerStyle,
                        headerTitleStyle,
                        headerBackTitle: '',
                    }}
                >
                    <Stack.Screen 
                        options={{ headerShown: false }} 
                        name="TabScreens" 
                        component={TabNavigator} 
                    />
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
                        name="Home" 
                        options={{ headerShown: false }} 
                        component={Home} 
                    />
                </Stack.Navigator>
            </SheetProvider>
        </NavigationContainer>
    );
};

export default Navigations;
