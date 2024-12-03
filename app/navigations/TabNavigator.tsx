import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import theme from '../settings/Theme';
import { IconButton } from 'react-native-paper';
import React from 'react';
import Home from '../screens/Home/Home';
import DeliveryNavigator from './DeliveryNavigator';
import ProductNavigator from './ProductNavigator';

const Tab = createBottomTabNavigator();

export type TabStackNavigationList = {
    Home: undefined;
};

const headerStyle = {
    backgroundColor: '#006CFF'
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
                tabBarActiveTintColor: theme.colors.primary,
                tabBarInactiveTintColor: '#6e6e6e',
                tabBarIcon: ({focused, color}) => 
                {
                    let iconName = '';

                    switch(route.name)
                    {
                        case 'Home':
                            iconName = 'home'
                            break;
                        case 'Deliveries':
                            iconName = 'truck-delivery'
                            break;
                        case 'ProductNavigator':
                            iconName = 'package-variant-closed'
                            break;
                    }
                    
                    return (
                        <IconButton
                            icon={iconName}
                            size={24}
                            iconColor={focused ? theme.colors.primary : '#6e6e6e'}
                        />
                    );
                },
                tabBarHideOnKeyboard: true
            })}
            initialRouteName='Home'
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
            <Tab.Screen 
                name='Deliveries' 
                component={DeliveryNavigator} 
                options={{}}
            />
            <Tab.Screen 
                name='ProductNavigator' 
                component={ProductNavigator} 
                options={{
                    tabBarLabel: 'Products',
                    headerTitle: 'Products',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
