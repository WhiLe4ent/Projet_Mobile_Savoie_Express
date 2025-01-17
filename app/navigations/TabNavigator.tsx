import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import theme from '../settings/Theme';
import { IconButton } from 'react-native-paper';
import React from 'react';
import Home from '../screens/Home/Home';
import DeliveryNavigator from './DeliveryNavigator';
import ProductNavigator from './ProductNavigator';
import { RootStackParamList } from './RootStackParamList';

const Tab = createBottomTabNavigator<RootStackParamList>();

const headerStyle = {
    backgroundColor: theme.colors.primary
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
                        case 'Livraisons':
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
                name='Livraisons' 
                component={DeliveryNavigator} 
                options={{}}
            />
            <Tab.Screen 
                name='ProductNavigator' 
                component={ProductNavigator} 
                options={{
                    tabBarLabel: 'Produits',
                    headerTitle: 'Produits',
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
