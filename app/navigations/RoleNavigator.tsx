import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { IconButton } from 'react-native-paper';
import Roles from '../screens/Roles/Roles';
import Configurations from '../screens/Configurations/Configurations';

const RoleTab = createBottomTabNavigator();

const RoleNavigator = () => {
    return (
        <RoleTab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: 'blue',
                tabBarIcon: () => {
                    let iconName = '';

                    switch (route.name) {
                        case 'Roles':
                            iconName = 'account';
                            break;
                        case 'Configurations':
                            iconName = 'settings';
                            break;
                    }

                    return <IconButton icon={iconName} size={24} />;
                },
            })}
        >
            <RoleTab.Screen name="Roles" component={Roles} />
            <RoleTab.Screen name="Configurations" component={Configurations} />
        </RoleTab.Navigator>
    );
};

export default RoleNavigator;
