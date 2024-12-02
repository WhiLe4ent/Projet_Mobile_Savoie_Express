import React from 'react';
import DeliveriesList from '../screens/Deliveries/DeliveriesList';
import CreateDelivery from '../screens/Deliveries/CreateDelivery';
import DeliveryDetails from '../screens/Deliveries/DeliveryDetails';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './RootStackParamList';

const DeliveryStack = createNativeStackNavigator<RootStackParamList>();

const DeliveryNavigator = () => {
    return (
        <DeliveryStack.Navigator
            initialRouteName="DeliveriesList"
            screenOptions={{
                headerStyle: { backgroundColor: '#006CFF' },
                headerTitleStyle: { color: 'white' },
                headerBackTitle: '',
                headerTintColor: '#FFFFFF'
            }}
        >
            <DeliveryStack.Screen
                name="DeliveriesList"
                component={DeliveriesList}
                options={{
                    title: 'All Deliveries'                
                }}
            />
            <DeliveryStack.Screen
                name="DeliveryDetails"
                component={DeliveryDetails}
                options={{
                    title: 'Delivery Details',
                }}
            />
            <DeliveryStack.Screen
                name="CreateDelivery"
                component={CreateDelivery}
                options={{
                    title: 'Create New Delivery',
                }}
            />
        </DeliveryStack.Navigator>
    );
};

export default DeliveryNavigator;
