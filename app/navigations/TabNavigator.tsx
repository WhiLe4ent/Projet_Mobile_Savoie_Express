import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import theme from '../settings/Theme';
import { Icon, IconButton } from 'react-native-paper';
import React from 'react';
import Home from '../screens/Home/Home';
import DeliveriesList from '../screens/Deliveries/DeliveriesList';
import Products from '../screens/Products/Products';

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
                tabBarActiveTintColor: theme.colors.onPrimary,
                tabBarIcon: () => 
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
                        case 'Products':
                            iconName = 'package-variant-closed'
                            break;
                    }
                    
                    return (
                        <IconButton
                            icon={iconName}
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
            <Tab.Screen 
                name='Deliveries' 
                component={DeliveriesList} 
                options={{
                    tabBarLabel: 'Deliveries',
                    headerShown: true,
                    headerTitle: 'Deliveries',
                    headerStyle,
                    headerTitleStyle,
                }}
            />
            <Tab.Screen 
                name='Products' 
                component={Products} 
                options={{
                    tabBarLabel: 'Products',
                    headerShown: true,
                    headerTitle: 'Products',
                    headerStyle,
                    headerTitleStyle,
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;
