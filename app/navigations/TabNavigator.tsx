import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect } from 'react';
import theme from '../settings/Theme';
import { Icon, IconButton } from 'react-native-paper';
import React from 'react';
import Home from '../screens/Home/Home';

const Tab = createBottomTabNavigator();

export type TabStackNavigationList = {
    Home: undefined;
};

const headerStyle = {
    backgroundColor: 'transparent'
};

const headerTitleStyle = {
    color: 'white',
};

const TabNavigator = () =>
{

    return (            
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: theme.colors.onPrimary,
                tabBarIcon: () => 
                {
                    let iconName = '';

                    switch(route.name)
                    {
                        case 'Home':
                            iconName = 'local-bar'
                            break;
                    }
                    
                    return (
                        <IconButton
                            icon="home" 
                            size={24}
                        />
                    );
                },
                tabBarHideOnKeyboard: true
            })}
        >
            <Tab.Screen 
                name='Home' 
                component={Home} 
                options={{
                    tabBarLabel: 'Home',
                    headerShown: true,
                    headerTitle: 'Home',
                    headerStyle,
                    headerTitleStyle,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
